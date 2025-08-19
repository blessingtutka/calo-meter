import { ScreenLayout } from '@/components/ScreenLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';

export default function Home() {
    const navigation = useRouter();

    return (
        <ScreenLayout>
            <Card className='w-fit bg-dark-trans rounded-lg shadow-sm p-6 space-y-4'>
                <Image source={require('@/assets/images/logo.png')} className='!w-32 !h-32 self-center' />

                <View className='flex-col items-center'>
                    <Text className='text-3xl font-bold text-[#FDB327]'>Welcome to</Text>
                    <Text className='text-5xl font-extrabold text-[#0082f4]'>CaloMeter</Text>
                    <Text className='text-base text-[#FFB4A6] mt-1 text-center'>
                        Calorie tracker application that helps you manage your nutritional intake, stay on track with your goals, and live a healthier
                        life.
                    </Text>
                    <Text className='text-[#1DAC5C] font-semibold mt-2 text-center'>With CaloMeter: Track. Balance. Thrive.</Text>
                </View>

                <Button size='lg' className='main-btn mt-4' onPress={() => navigation.push('/auth')}>
                    <Text className='text-white font-bold'>Login</Text>
                </Button>

                <View className='flex-row items-center mt-3'>
                    <Text className='text-[#666] text-sm flex-shrink-1'>Don't have an account? </Text>
                    <Pressable onPress={() => navigation.push('/auth')}>
                        <Text className='text-[#FE4031] text-sm font-medium'>Sign up</Text>
                    </Pressable>
                </View>
            </Card>
        </ScreenLayout>
    );
}
