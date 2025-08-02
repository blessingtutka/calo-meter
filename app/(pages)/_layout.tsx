import { Stack, useRouter } from 'expo-router';

import { ArrowLeft } from 'lucide-react-native';
import { ImageBackground, Pressable, StyleSheet, View } from 'react-native';

export default function PagesLayout() {
    const router = useRouter();

    return (
        <ImageBackground source={require('@/assets/images/back.png')} style={styles.background} resizeMode='cover'>
            <View style={styles.overlay} className='!p-0'>
                <Stack
                    screenOptions={{
                        headerBackground: () => <View className='flex-1 bg-black border-b border-b-[#FDB327]' />,
                    }}
                >
                    <Stack.Screen name='index' options={{ title: 'Home', headerShown: false }} />

                    <Stack.Screen
                        name='auth'
                        options={{
                            title: 'Authentication',
                            headerLeft: () => (
                                <Pressable onPress={() => router.replace('/')} className='px-2'>
                                    <ArrowLeft size={24} color='white' />
                                </Pressable>
                            ),
                        }}
                    />

                    <Stack.Screen
                        name='pswr'
                        options={{
                            title: 'Password Request Reset',
                            headerLeft: () => (
                                <Pressable onPress={() => router.replace('/auth')} className='px-2'>
                                    <ArrowLeft size={24} color='white' />
                                </Pressable>
                            ),
                        }}
                    />
                </Stack>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        paddingTop: 40,
    },
});
