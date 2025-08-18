import { ScreenLayout } from '@/components/ScreenLayout';
import { Card } from '@/components/ui/card';
import React from 'react';

export default function Calendar() {
    return (
        <ScreenLayout>
            <Card className='w-full max-w-2xl p-0 bg-[#121212] rounded-2xl shadow-lg overflow-hidden'>{/* Calandar */}</Card>
        </ScreenLayout>
    );
}
