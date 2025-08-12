import { HealthStepForm } from '@/components/health';
import { ActivityIndicator } from '@/components/ui/activity-indicator';
import { Card } from '@/components/ui/card';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

export default function Auth() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { push } = useRouter();

    const handleSubmit = async (data: any) => {
        setIsLoading(true);
        setError(null);
        try {
            console.log('Login data:', data);
            // await login(data.email, data.password)
            push('/otp');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScrollView showsVerticalScrollIndicator={false} className='scrolled-view'>
            <View className='content-view'>
                <Card className='w-full md:w-8/12 lg:w-7/12 bg-[#121212] rounded-lg shadow-sm'>
                    <View className='flex-col justify-center'>
                        <Text className={`font-medium text-blue-400 text-3xl`}>Tell us more!</Text>
                        <Text className={`font-medium text-gray-500 text-base`}>Tell us more to track your health better</Text>
                    </View>

                    <View className='p-6'>
                        {error && <Text className='text-red-400 mb-4 text-sm'>{error}</Text>}

                        {isLoading ? (
                            <View className='items-center justify-center py-8'>
                                <ActivityIndicator size='large' color='#60a5fa' />
                            </View>
                        ) : (
                            <HealthStepForm onSave={handleSubmit} />
                        )}
                    </View>
                </Card>
            </View>
        </ScrollView>
    );
}
