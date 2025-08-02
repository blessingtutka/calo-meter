import { ActivityIndicator } from '@/components/ui/activity-indicator';
import { Card } from '@/components/ui/card';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { LoginForm, SignupForm } from '../../components/auth';

export default function AuthTabs() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [tab, setTab] = useState<'login' | 'signup'>('login');
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

    const handleLoginSubmit = async (data: any) => {
        setIsLoading(true);
        setError(null);
        try {
            console.log('Login data:', data);
            // await login(data.email, data.password)
            push('/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignupSubmit = async (data: any) => {
        setIsLoading(true);
        setError(null);
        try {
            console.log('Signup data:', data);
            // await register(data)
            push('/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View className='flex-1 items-center justify-center p-4'>
            <Card className='w-full max-w-md bg-[#121212] rounded-lg shadow-sm border border-gray-700'>
                <View className='flex-row border-b border-gray-700'>
                    <TouchableOpacity
                        className={`flex-1 py-4 items-center ${tab === 'login' ? 'border-b-2 border-blue-500' : ''}`}
                        onPress={() => setTab('login')}
                    >
                        <Text className={`font-medium ${tab === 'login' ? 'text-blue-400' : 'text-gray-400'}`}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className={`flex-1 py-4 items-center ${tab === 'signup' ? 'border-b-2 border-blue-500' : ''}`}
                        onPress={() => setTab('signup')}
                    >
                        <Text className={`font-medium ${tab === 'signup' ? 'text-blue-400' : 'text-gray-400'}`}>Sign Up</Text>
                    </TouchableOpacity>
                </View>

                <View className='p-6'>
                    {error && <Text className='text-red-400 mb-4 text-sm'>{error}</Text>}

                    {isLoading ? (
                        <View className='items-center justify-center py-8'>
                            <ActivityIndicator size='large' color='#60a5fa' />
                        </View>
                    ) : (
                        <>
                            {tab === 'login' ? (
                                <LoginForm onGoogleSignIn={handleGoogleAuth} onSubmit={handleLoginSubmit} isLoading={isLoading} />
                            ) : (
                                <SignupForm onSubmit={handleSignupSubmit} isLoading={isLoading} />
                            )}
                        </>
                    )}
                </View>
            </Card>
        </View>
    );
}
