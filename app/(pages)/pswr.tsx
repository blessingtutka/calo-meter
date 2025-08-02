import { PasswordResetRequest } from '@/components/auth';
import { Card } from '@/components/ui/card';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View } from 'react-native';

export default function PasswordRequest() {
    const { push } = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const handleSubmit = async (data: any) => {
        setIsLoading(true);
        try {
            console.log('Login data:', data);
            // await reset(data.email, data.password)
            push('/dashboard');
        } catch (err: any) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <View className='flex-1 items-center justify-center p-4'>
            <Card className='w-full max-w-md bg-[#121212] rounded-lg shadow-sm border border-gray-700'>
                <PasswordResetRequest onSubmit={handleSubmit} isLoading={isLoading} />
            </Card>
        </View>
    );
}
