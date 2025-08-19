import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Tabs, useRouter } from 'expo-router';
import { ArrowLeft, CalendarDays, CircleUserRound, House, Soup } from 'lucide-react-native';
import React from 'react';
import { Platform, Pressable } from 'react-native';

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const router = useRouter();
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                headerShown: false,
                tabBarButton: HapticTab,
                sceneStyle: { backgroundColor: 'transparent' },
                tabBarBackground: TabBarBackground,
                tabBarStyle: Platform.select({
                    default: {},
                }),
            }}
        >
            <Tabs.Screen
                name='dashboard'
                options={{
                    title: 'Dashboard',
                    tabBarIcon: ({ color }) => <House size={28} color={color} />,
                }}
            />

            <Tabs.Screen
                name='meal'
                options={{
                    title: 'Meal',
                    tabBarIcon: ({ color }) => <Soup size={28} color={color} />,
                }}
            />

            <Tabs.Screen
                name='calendar'
                options={{
                    title: 'calendar',
                    tabBarIcon: ({ color }) => <CalendarDays size={28} color={color} />,
                }}
            />
            <Tabs.Screen
                name='profile'
                options={{
                    title: 'profile',
                    tabBarIcon: ({ color }) => <CircleUserRound size={28} color={color} />,
                }}
            />

            <Tabs.Screen
                name='health'
                options={{
                    title: 'health',
                    href: null,
                    headerShown: true,

                    tabBarStyle: { display: 'flex' },
                    headerLeft: () => (
                        <Pressable onPress={() => router.replace('/profile')} className='px-2'>
                            <ArrowLeft size={24} color='white' />
                        </Pressable>
                    ),
                }}
            />
            <Tabs.Screen
                name='add_meal'
                options={{
                    title: 'Add Meal',
                    href: null,
                    headerShown: true,

                    tabBarStyle: { display: 'flex' },
                    headerLeft: () => (
                        <Pressable onPress={() => router.replace('/meal')} className='px-2'>
                            <ArrowLeft size={24} color='white' />
                        </Pressable>
                    ),
                }}
            />
        </Tabs>
    );
}
