import { ScreenLayout } from '@/components/ScreenLayout';
import { ActivityIndicator } from '@/components/ui/activity-indicator';
import { Card } from '@/components/ui/card';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { AuthForm } from '../../components/auth';

export default function Auth() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { push } = useRouter();

    const handleGoogleAuth = async () => {
        setIsLoading(true);
        setError(null);
        try {
            console.log('Google auth');
            // await google()
            push('/auth');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAuthSubmit = async (data: any) => {
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
        <ScreenLayout>
            <Card className='w-full max-w-md bg-[#121212] rounded-lg shadow-sm'>
                <View className='flex-col justify-center'>
                    <Text className={`font-medium text-blue-400 text-3xl`}>Welcome!</Text>
                    <Text className={`font-medium text-gray-500 text-base`}>Log in or sign up with your email</Text>
                </View>

                <View className='p-6'>
                    {error && <Text className='text-red-400 mb-4 text-sm'>{error}</Text>}

                    {isLoading ? (
                        <View className='items-center justify-center py-8'>
                            <ActivityIndicator size='large' color='#60a5fa' />
                        </View>
                    ) : (
                        <AuthForm onGoogleSignIn={handleGoogleAuth} onSubmit={handleAuthSubmit} isLoading={isLoading} />
                    )}
                </View>
            </Card>
        </ScreenLayout>
    );
}
