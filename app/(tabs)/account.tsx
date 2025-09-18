import { ProfileForm } from '@/components/auth/ProfileForm';
import { ScreenLayout } from '@/components/ScreenLayout';
import { ActivityIndicator } from '@/components/ui/activity-indicator';
import { Card } from '@/components/ui/card';
import { useUser } from '@/providers/userProvider';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { ProfileFormValues } from '../../utils/validators';

export default function Account() {
    const { profile, updateProfile } = useUser();

    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (data: ProfileFormValues) => {
        setLoading(true);
        setError(null);
        try {
            console.log('Profile data:', data);
            await updateProfile(data as Profile);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenLayout>
            <Card className='w-full p-8 max-w-2xl bg-[#121212] rounded-2xl shadow-lg overflow-hidden gap-3'>
                <View className='flex-col justify-center'>
                    <Text className={`font-medium text-blue-400 text-3xl`}>Update your Profile!</Text>
                </View>

                <View>
                    {error && <Text className='text-red-400 mb-4 text-sm'>{error}</Text>}

                    {isLoading ? (
                        <View className='items-center justify-center py-8'>
                            <ActivityIndicator size='large' color='#60a5fa' />
                        </View>
                    ) : (
                        <ProfileForm onSubmit={handleSubmit} isLoading={isLoading} data={profile} />
                    )}
                </View>
            </Card>
        </ScreenLayout>
    );
}
