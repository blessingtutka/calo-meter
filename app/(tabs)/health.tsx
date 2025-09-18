import { HealthStepForm } from '@/components/health';
import { ScreenLayout } from '@/components/ScreenLayout';
import { ActivityIndicator } from '@/components/ui/activity-indicator';
import { Card } from '@/components/ui/card';
import { useUser } from '@/providers/userProvider';
import { HealthFormData } from '@/utils/validators';
import React, { useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';

export default function Health() {
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [healthData, setHealthData] = useState<Partial<HealthFormData> | null>(null);

    const { walletAddress, contractAddress, signingClient, queryClient, isLoggedIn } = useUser();

    // Fetch health data from contract
    const fetchHealthData = async (): Promise<HealthFormData | null> => {
        if (!queryClient || !contractAddress || !walletAddress) return null;

        try {
            const response = await queryClient.queryContractSmart(contractAddress, {
                UserDocuments: {
                    owner: walletAddress,
                    collection: 'health',
                },
            });

            if (response?.documents) {
                const healthDoc = response.documents.find(([id]: [string, any]) => id === walletAddress);
                if (healthDoc) {
                    return JSON.parse(healthDoc[1].data);
                }
            }
        } catch (error) {
            console.error('Error fetching health data from contract:', error);
        }
        return null;
    };

    // Update health data in contract
    const updateHealthData = async (data: Partial<HealthFormData>): Promise<boolean> => {
        if (!signingClient || !walletAddress || !contractAddress) {
            throw new Error('Not connected to wallet or contract');
        }

        try {
            await signingClient.execute(
                walletAddress,
                contractAddress,
                {
                    Set: {
                        collection: 'health',
                        document: walletAddress,
                        data: JSON.stringify(data),
                    },
                },
                'auto',
            );
            return true;
        } catch (error) {
            console.error('Error updating health data in contract:', error);
            throw new Error('Failed to update health data');
        }
    };

    // Load health data on component mount
    useEffect(() => {
        const loadHealthData = async () => {
            if (!isLoggedIn || !walletAddress) {
                setIsFetching(false);
                return;
            }

            try {
                const data = await fetchHealthData();
                if (data) {
                    setHealthData(data);
                }
            } catch (error) {
                console.error('Error loading health data:', error);
                setError('Failed to load health data');
            } finally {
                setIsFetching(false);
            }
        };

        loadHealthData();
    }, [isLoggedIn, walletAddress]);

    const handleSubmit = async (step: number, data: Partial<HealthFormData>) => {
        if (!isLoggedIn) {
            Alert.alert('Error', 'Please connect your wallet first');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const success = await updateHealthData(data);

            if (success) {
                setHealthData(data);
                Alert.alert('Success', 'Health data updated successfully!');

                // Optionally navigate to another screen
                // push('/dashboard');
            }
        } catch (err: any) {
            setError(err.message);
            Alert.alert('Error', err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isLoggedIn) {
        return (
            <ScreenLayout>
                <Card className='w-full p-8 max-w-2xl bg-[#121212] rounded-2xl shadow-lg overflow-hidden'>
                    <View className='flex-col justify-center items-center py-8'>
                        <Text className='font-medium text-gray-400 text-lg text-center'>Please connect your wallet to access health tracking</Text>
                    </View>
                </Card>
            </ScreenLayout>
        );
    }

    if (isFetching) {
        return (
            <ScreenLayout>
                <Card className='w-full p-8 max-w-2xl bg-[#121212] rounded-2xl shadow-lg overflow-hidden'>
                    <View className='items-center justify-center py-8'>
                        <ActivityIndicator size='large' color='#60a5fa' />
                        <Text className='text-gray-400 mt-4'>Loading your health data...</Text>
                    </View>
                </Card>
            </ScreenLayout>
        );
    }

    return (
        <ScreenLayout>
            <Card className='w-full p-8 max-w-2xl bg-[#121212] rounded-2xl shadow-lg overflow-hidden'>
                <View className='flex-col justify-center'>
                    <Text className={`font-medium text-blue-400 text-3xl`}>{healthData ? 'Update Your Health Profile' : 'Tell us more!'}</Text>
                    <Text className={`font-medium text-gray-500 text-base`}>
                        {healthData ? 'Keep your health information up to date' : 'Tell us more to track your health better'}
                    </Text>
                </View>

                <View className='mt-6'>
                    {error && <Text className='text-red-400 mb-4 text-sm text-center'>{error}</Text>}

                    {isLoading ? (
                        <View className='items-center justify-center py-8'>
                            <ActivityIndicator size='large' color='#60a5fa' />
                            <Text className='text-gray-400 mt-4'>Saving your health data...</Text>
                        </View>
                    ) : (
                        <HealthStepForm onSave={handleSubmit} initialData={healthData || undefined} />
                    )}
                </View>
            </Card>
        </ScreenLayout>
    );
}
