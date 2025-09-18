import { HealthStepForm } from '@/components/health';
import { ScreenLayout } from '@/components/ScreenLayout';
import { ActivityIndicator } from '@/components/ui/activity-indicator';
import { Card } from '@/components/ui/card';
import { useUser } from '@/providers/userProvider';
import { HealthFormData } from '@/utils/validators';
import React, { useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';

const DEFAULT_HEALTH_DATA: HealthFormData = {};

export default function Health() {
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [healthData, setHealthData] = useState<HealthFormData>(DEFAULT_HEALTH_DATA);

    const { walletAddress, isLoggedIn, xionManager } = useUser();

    // Fetch or initialize health data
    const fetchOrCreateHealthData = async (): Promise<HealthFormData> => {
        if (!xionManager || !walletAddress) return DEFAULT_HEALTH_DATA;

        try {
            const result = await xionManager.queryDocuments('health', walletAddress);
            if (result.success && result.documents.length > 0) {
                const healthDoc = result.documents.find(([id]: [string, any]) => id === walletAddress);
                if (healthDoc) {
                    return JSON.parse(healthDoc[1].data);
                }
            }

            // If no document exists, create a blank one
            await xionManager.storeDocument('health', walletAddress, DEFAULT_HEALTH_DATA);
            return DEFAULT_HEALTH_DATA;
        } catch (err) {
            console.error('Error fetching health data:', err);
            throw new Error('Could not fetch health data');
        }
    };

    // Update health data
    const updateHealthData = async (data: Partial<HealthFormData>): Promise<boolean> => {
        if (!xionManager || !walletAddress) {
            throw new Error('Not connected to wallet or contract');
        }

        try {
            await xionManager.updateDocument('health', walletAddress, data);
            return true;
        } catch (err) {
            console.error('Error updating health data:', err);
            throw new Error('Failed to update health data');
        }
    };

    // Load health data when logged in
    useEffect(() => {
        const loadHealthData = async () => {
            if (!isLoggedIn || !walletAddress) {
                setIsFetching(false);
                return;
            }

            try {
                const data = await fetchOrCreateHealthData();
                setHealthData(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsFetching(false);
            }
        };

        loadHealthData();
    }, [isLoggedIn, walletAddress]);

    const handleSubmit = async (_step: number, data: Partial<HealthFormData>) => {
        if (!isLoggedIn) {
            Alert.alert('Error', 'Please connect your wallet first');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const success = await updateHealthData(data);

            if (success) {
                setHealthData({ ...healthData, ...data });
                Alert.alert('Success', 'Health data updated successfully!');
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

    return (
        <ScreenLayout>
            <Card className='w-full p-8 max-w-2xl bg-[#121212] rounded-2xl shadow-lg overflow-hidden'>
                {/* Title */}
                <View className='flex-col justify-center'>
                    <Text className='font-medium text-blue-400 text-3xl'>{healthData ? 'Update Your Health Profile' : 'Tell us more!'}</Text>
                    <Text className='font-medium text-gray-500 text-base'>
                        {healthData ? 'Keep your health information up to date' : 'Tell us more to track your health better'}
                    </Text>
                </View>

                {/* Status messages */}
                <View className='mt-6'>
                    {isFetching && (
                        <View className='items-center justify-center py-4'>
                            <ActivityIndicator size='large' color='#60a5fa' />
                            <Text className='text-gray-400 mt-2'>Loading your health data...</Text>
                        </View>
                    )}
                    {error && <Text className='text-red-400 mb-4 text-sm text-center'>{error}</Text>}
                    {isLoading && (
                        <View className='items-center justify-center py-4'>
                            <ActivityIndicator size='large' color='#60a5fa' />
                            <Text className='text-gray-400 mt-2'>Saving your health data...</Text>
                        </View>
                    )}
                </View>

                {/* Form always visible */}
                <View className='mt-6'>
                    <HealthStepForm onSave={handleSubmit} initialData={healthData || DEFAULT_HEALTH_DATA} />
                </View>
            </Card>
        </ScreenLayout>
    );
}
