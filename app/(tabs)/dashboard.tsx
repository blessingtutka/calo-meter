import { Image } from 'expo-image';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { Platform, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: 'transparent', dark: 'transparent' }}
            headerImage={<Image source={require('@/assets/images/partial-react-logo.png')} style={styles.reactLogo} />}
        >
            <View style={styles.titleContainer}>
                <Text className='text-2xl text-white'>Welcome!</Text>
                <HelloWave />
            </View>
            <View style={styles.stepContainer}>
                <Text className='text-xl text-white'>Step 1: Try it</Text>
                <Text className='text-white'>
                    Edit <Text className='font-semibold text-white'>app/(tabs)/index.tsx</Text> to see changes. Press{' '}
                    <Text className='font-semibold text-white'>
                        {Platform.select({
                            ios: 'cmd + d',
                            android: 'cmd + m',
                            web: 'F12',
                        })}
                    </Text>
                    to open developer tools.
                </Text>
            </View>
            <View style={styles.stepContainer}>
                <Text className='text-xl text-white'>Step 2: Explore</Text>
                <Text className='text-white'>{`Tap the Explore tab to learn more about what's included in this starter app.`}</Text>
            </View>
            <View style={styles.stepContainer}>
                <Text className='text-xl text-white'>Step 3: Get a fresh start</Text>
                <Text className='text-white'>
                    {`When you're ready, run `}
                    <Text className='font-semibold text-white'>npm run reset-project</Text> to get a fresh
                    <Text className='font-semibold text-white'>app</Text> directory. This will move the current{' '}
                    <Text className='font-semibold text-white'>app</Text> to <Text className='font-semibold text-white'>app-example</Text>.
                </Text>
            </View>
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: 'absolute',
    },
});
