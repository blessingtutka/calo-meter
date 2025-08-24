import { useColorScheme } from '@/hooks/useColorScheme';
import { UserProvider } from '@/providers/userProvider';
import { AbstraxionProvider } from '@burnt-labs/abstraxion-react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import 'react-native-reanimated';
import '../assets/styles/global.css';

import { Buffer } from 'buffer';
global.Buffer = Buffer;

SplashScreen.preventAutoHideAsync();

const treasuryConfig = {
    treasury: process.env.EXPO_PUBLIC_TREASURY_CONTRACT_ADDRESS,
    gasPrice: '0.001uxion',
    rpcUrl: process.env.EXPO_PUBLIC_RPC_ENDPOINT,
    restUrl: process.env.EXPO_PUBLIC_REST_ENDPOINT,
    callbackUrl: 'calometer://',
};

const TransparentDarkTheme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        background: 'transparent',
        text: '#FFFFFF',
    },
};

const CustomDefaultTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        placeholder: '#808080',
        text: DefaultTheme.colors.text,
    },
};

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <AbstraxionProvider config={treasuryConfig}>
            <ThemeProvider value={colorScheme === 'dark' ? TransparentDarkTheme : CustomDefaultTheme}>
                <UserProvider>
                    <Stack initialRouteName='(pages)'>
                        <Stack.Screen name='(pages)' options={{ headerShown: false }} />
                        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
                        <Stack.Screen name='+not-found' />
                    </Stack>
                    <StatusBar style='auto' />
                </UserProvider>
            </ThemeProvider>
        </AbstraxionProvider>
    );
}
