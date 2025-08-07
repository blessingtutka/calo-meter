import OtpForm from '@/components/auth/OtpForm';
import { Card } from '@/components/ui/card';
import React from 'react';
import { View } from 'react-native';

export default function Auth() {
    return (
        <View className='flex-1 items-center justify-center p-4'>
            <Card className='w-full max-w-md bg-[#121212] rounded-lg shadow-sm'>
                <OtpForm />
            </Card>
        </View>
    );
}
