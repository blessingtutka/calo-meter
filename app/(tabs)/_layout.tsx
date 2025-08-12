import { Tabs } from 'expo-router';
import React from 'react';
import { ImageBackground, Platform, StyleSheet, View } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <ImageBackground source={require('@/assets/images/back.png')} style={styles.background} resizeMode='cover'>
            <View style={styles.overlay}>
                <Tabs
                    screenOptions={{
                        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                        headerShown: false,
                        tabBarButton: HapticTab,
                        tabBarBackground: TabBarBackground,
                        tabBarStyle: Platform.select({
                            ios: {
                                // Use a transparent background on iOS to show the blur effect
                                position: 'absolute',
                            },
                            default: {},
                        }),
                    }}
                >
                    <Tabs.Screen
                        name='dashboard'
                        options={{
                            title: 'Dashboard',
                            tabBarIcon: ({ color }) => <IconSymbol size={28} name='house.fill' color={color} />,
                        }}
                    />
                    <Tabs.Screen
                        name='explore'
                        options={{
                            title: 'Explore',
                            tabBarIcon: ({ color }) => <IconSymbol size={28} name='paperplane.fill' color={color} />,
                        }}
                    />
                    <Tabs.Screen
                        name='health'
                        options={{
                            title: 'health',
                            tabBarIcon: ({ color }) => <IconSymbol size={28} name='paperplane.fill' color={color} />,
                        }}
                    />
                </Tabs>
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
        paddingTop: 0,
    },
});
