import { Stack, useRouter } from 'expo-router';

import { ArrowLeft } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

export default function PagesLayout() {
    const router = useRouter();

    return (
        <Stack>
            <Stack.Screen name='index' options={{ title: 'Welcome', headerShown: false }} />

            <Stack.Screen
                name='auth'
                options={{
                    title: 'Authentication',
                    headerLeft: () => (
                        <Pressable onPress={() => router.replace('/')} className='px-2'>
                            <ArrowLeft size={24} color='white' />
                        </Pressable>
                    ),
                    headerBackground: () => <View className='flex-1 bg-black border-b border-b-[#FDB327]' />,
                }}
            />

            <Stack.Screen
                name='otp'
                options={{
                    title: 'One time Password',
                    headerLeft: () => (
                        <Pressable onPress={() => router.replace('/auth')} className='px-2'>
                            <ArrowLeft size={24} color='white' />
                        </Pressable>
                    ),
                    headerBackground: () => <View className='flex-1 bg-black border-b border-b-[#FDB327]' />,
                }}
            />
            <Stack.Screen name='xion' options={{ title: 'XION EX', headerShown: false }} />
            <Stack.Screen name='zktls' options={{ title: 'ZKTLS EX', headerShown: false }} />
        </Stack>
    );
}
