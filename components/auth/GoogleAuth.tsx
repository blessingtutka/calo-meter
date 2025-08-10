import { useAbstraxionAccount, useAbstraxionSigningClient } from '@burnt-labs/abstraxion-react-native';
// import { ReclaimVerification } from '@reclaimprotocol/inapp-rn-sdk';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

let ReclaimVerification: any = null;

if (Platform.OS === 'ios' || Platform.OS === 'android') {
    // Dynamically require only on native platforms
    ReclaimVerification = require('@reclaimprotocol/inapp-rn-sdk').ReclaimVerification;
}

const RUM_CONTRACT_ADDRESS = process.env.EXPO_PUBLIC_RUM_CONTRACT_ADDRESS ?? '';

const reclaimEnv = {
    appId: process.env.EXPO_PUBLIC_RECLAIM_APP_ID ?? '',
    appSecret: process.env.EXPO_PUBLIC_RECLAIM_APP_SECRET ?? '',
    providerId: process.env.EXPO_PUBLIC_RECLAIM_PROVIDER_ID ?? 'gmail',
};

type Status = 'idle' | 'verifying' | 'verification_complete' | 'executing' | 'complete' | 'error';

export default function GoogleAuth() {
    const { client } = useAbstraxionSigningClient();
    const { data: account, isConnected, login, isConnecting } = useAbstraxionAccount();

    const [queryResult, setQueryResult] = useState<number | undefined>(undefined);
    const [status, setStatus] = useState<Status>('idle');
    const [loading, setLoading] = useState(false);

    const queryRUMContract = async () => {
        if (!client) return;

        try {
            const queryMsg = {
                get_value_by_user: {
                    address: account?.bech32Address,
                },
            };

            const result: string = await client.queryContractSmart(RUM_CONTRACT_ADDRESS, queryMsg);
            const parsed = parseInt(result.replace(/"/g, ''), 10);
            setQueryResult(isNaN(parsed) ? undefined : parsed);
        } catch (error) {
            console.log('Error querying RUM contract:', error);
        }
    };

    useEffect(() => {
        if (client) {
            queryRUMContract();
        }
    }, [client]);

    if (!ReclaimVerification) {
        console.warn('ReclaimVerification not supported on web');
        return (
            <TouchableOpacity className='flex-row items-center justify-center gap-2 bg-white rounded-md p-2' disabled>
                <FontAwesome name='google' size={20} color='#FDB327' />
                <Text className='text-main font-bold'>Sign in with Google</Text>
            </TouchableOpacity>
        );
    }
    const reclaimVerification = new ReclaimVerification();

    const startVerificationFlow = async () => {
        if (!account?.bech32Address) {
            Alert.alert('Error', 'Please connect your wallet first');
            return;
        }

        if (!client) {
            Alert.alert('Error', 'Client not found');
            return;
        }

        if (status === 'error') {
            setQueryResult(undefined);
        }

        setLoading(true);
        setStatus('verifying');

        try {
            // Step 1: Verify Gmail account with Reclaim
            const verificationResult = await reclaimVerification.startVerification({
                appId: reclaimEnv.appId,
                secret: reclaimEnv.appSecret,
                providerId: reclaimEnv.providerId,
            });

            console.log('Verification result:', verificationResult);
            setStatus('verification_complete');

            // Step 2: Execute smart contract with proof
            setStatus('executing');

            const claimInfo = {
                provider: verificationResult.proofs[0].claimData.provider,
                parameters: verificationResult.proofs[0].claimData.parameters,
                context: verificationResult.proofs[0].claimData.context,
            };

            const signedClaim = {
                claim: {
                    identifier: verificationResult.proofs[0].claimData.identifier,
                    owner: verificationResult.proofs[0].claimData.owner,
                    epoch: verificationResult.proofs[0].claimData.epoch,
                    timestampS: verificationResult.proofs[0].claimData.timestampS,
                },
                signatures: verificationResult.proofs[0].signatures,
            };

            const executeMsg = {
                update: {
                    value: {
                        proof: {
                            claimInfo,
                            signedClaim,
                        },
                    },
                },
            };

            const executeResult = await client.execute(account?.bech32Address, RUM_CONTRACT_ADDRESS, executeMsg, 'auto');

            console.log('Contract executed:', executeResult);
            setStatus('complete');

            await queryRUMContract();
            Alert.alert('Success', 'Verification completed and on-chain update successful!');
        } catch (error: any) {
            console.error('Verification error:', error);
            setStatus('error');

            if (error instanceof ReclaimVerification.ReclaimVerificationException) {
                switch (error.type) {
                    case ReclaimVerification.ExceptionType.Cancelled:
                        Alert.alert('Cancelled', 'Verification was cancelled by the user.');
                        break;
                    case ReclaimVerification.ExceptionType.Dismissed:
                        Alert.alert('Dismissed', 'Verification was dismissed.');
                        break;
                    case ReclaimVerification.ExceptionType.SessionExpired:
                        Alert.alert('Expired', 'Verification session expired.');
                        break;
                    case ReclaimVerification.ExceptionType.Failed:
                    default:
                        Alert.alert('Failed', 'Verification failed.');
                }
            } else {
                Alert.alert('Error', error instanceof Error ? error.message : 'Unknown error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    const getStatusText = () => {
        switch (status) {
            case 'idle':
                return 'Ready to start verification';
            case 'verifying':
                return 'Verifying with Reclaim...';
            case 'verification_complete':
                return '✓ Verification completed';
            case 'executing':
                return 'Executing contract...';
            case 'complete':
                return '✓ Verification flow complete';
            case 'error':
                return '❌ Error occurred';
            default:
                return 'Unknown';
        }
    };

    const getStatusColor = () => {
        switch (status) {
            case 'idle':
                return '#cccccc';
            case 'verifying':
            case 'executing':
                return '#ffaa00';
            case 'verification_complete':
            case 'complete':
                return '#4caf50';
            case 'error':
                return '#ff4444';
            default:
                return '#cccccc';
        }
    };

    const isButtonDisabled = () => loading || status === 'complete';

    const getButtonText = () => {
        if (loading) return 'Processing...';
        if (status === 'complete') return 'Verification Complete';
        if (status === 'error') return 'Retry Verification';
        return 'Signin with Google';
    };

    return (
        <View style={styles.container}>
            {!isConnected ? (
                <View style={styles.connectButtonContainer}>
                    <TouchableOpacity
                        onPress={login}
                        style={[styles.menuButton, styles.fullWidthButton, isConnecting && styles.disabledButton]}
                        disabled={isConnecting}
                    >
                        <Text style={styles.buttonText}>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    <TouchableOpacity
                        style={[styles.button, isButtonDisabled() && styles.disabledButton]}
                        onPress={startVerificationFlow}
                        disabled={isButtonDisabled()}
                    >
                        <FontAwesome name='google' size={20} color='#FDB327' />
                        <Text style={styles.buttonText}>{getButtonText()}</Text>
                    </TouchableOpacity>

                    <View style={styles.statusContainer}>
                        <Text style={styles.statusTitle}>Status:</Text>
                        <Text style={[styles.statusText, { color: getStatusColor() }]}>{getStatusText()}</Text>
                    </View>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 15,
    },
    connectButtonContainer: {
        width: '100%',
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    fullWidthButton: {
        width: '100%',
        maxWidth: '100%',
    },
    menuButton: {
        padding: 15,
        borderRadius: 5,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        flex: 1,
        minWidth: 120,
        maxWidth: '48%',
    },
    buttonText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: '500',
    },
    disabledButton: {
        backgroundColor: '#333333',
        opacity: 0.6,
    },
    button: {
        backgroundColor: '#ffffff',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    statusContainer: {
        backgroundColor: '#111111',
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#333333',
    },
    statusTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 5,
    },
    statusText: {
        fontSize: 14,
        fontWeight: '500',
    },
    infoContainer: {
        backgroundColor: '#111111',
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#333333',
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 5,
    },
    infoText: {
        fontSize: 14,
        color: '#cccccc',
    },
});

// export default function GoogleAuth() {}
