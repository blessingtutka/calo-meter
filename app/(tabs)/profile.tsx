import { ScreenLayout } from '@/components/ScreenLayout';
import { Card } from '@/components/ui/card';
import { useRouter } from 'expo-router';
import { ChevronRight, LogOut } from 'lucide-react-native';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

export default function Profile() {
    const { push } = useRouter();

    return (
        <ScreenLayout>
            {/* Profile Card */}
            <Card className='w-full max-w-2xl p-6 bg-[#121212] rounded-2xl shadow-lg'>
                <View className='items-center'>
                    <Image source={{ uri: 'https://i.pravatar.cc/150?img=12' }} className='w-24 h-24 rounded-full mb-4' />
                    <Text className='text-white text-xl font-semibold'>John Doe</Text>
                    <Text className='text-gray-400'>john.doe@email.com</Text>
                </View>

                {/* Action Buttons */}
                <TouchableOpacity className='flex-row justify-between items-center p-4 border-b border-gray-700'>
                    <Text className='text-white text-base'>Account Settings</Text>
                    <ChevronRight size={20} color='gray' />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => push('/health')} className='flex-row justify-between items-center p-4 border-b border-gray-700'>
                    <Text className='text-white text-base'>Profile Configuration</Text>
                    <ChevronRight size={20} color='gray' />
                </TouchableOpacity>

                <TouchableOpacity className='flex-row justify-between items-center p-4 border-b border-gray-700'>
                    <Text className='text-white text-base'>App Preferences</Text>
                    <ChevronRight size={20} color='gray' />
                </TouchableOpacity>

                <TouchableOpacity className='flex-row justify-between items-center p-4'>
                    <View className='flex-row gap-2 items-center'>
                        <LogOut size={20} className='text-red-500' />
                        <Text className='text-red-500 text-base font-semibold'>Logout</Text>
                    </View>

                    <ChevronRight size={20} className='text-red-500' />
                </TouchableOpacity>
            </Card>
        </ScreenLayout>
    );
}
