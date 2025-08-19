import OtpForm from '@/components/auth/OtpForm';
import { ScreenLayout } from '@/components/ScreenLayout';
import { Card } from '@/components/ui/card';
import React from 'react';

export default function Otp() {
    return (
        <ScreenLayout>
            <Card className='w-full max-w-md bg-[#121212] rounded-lg shadow-sm'>
                <OtpForm />
            </Card>
        </ScreenLayout>
    );
}
