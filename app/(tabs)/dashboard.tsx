import { ScreenLayout } from '@/components/ScreenLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useUser } from '@/providers/userProvider';
import { useRouter } from 'expo-router';
import { Camera, ChevronRight, Plus } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, View } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

interface MealEntry {
    id: string;
    name: string;
    calories: number;
    grams: number;
    type: string;
    date: string;
    createdAt: string;
}

export default function Dashboard() {
    const { walletAddress, xionManager, isLoggedIn } = useUser();
    const router = useRouter();

    const dailyGoal = 2000;
    const today = new Date().toISOString().split('T')[0];

    const [meals, setMeals] = useState<MealEntry[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchMeals = async () => {
        if (!xionManager || !walletAddress) return;

        setLoading(true);
        try {
            const result = await xionManager.queryDocuments('foodEntry', walletAddress);
            if (result.success && result.documents.length > 0) {
                // Filter meals for today
                const docs = result.documents
                    .map(([id, doc]: [id: string, doc: { data: string }]) => ({ id, ...JSON.parse(doc.data) }))
                    .filter((m: MealEntry) => m.date === today);

                setMeals(docs);
            } else {
                setMeals([]);
            }
        } catch (err) {
            console.error('Error fetching meals:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            fetchMeals();
        }
    }, [isLoggedIn]);

    const consumed = meals.reduce((sum, m) => sum + m.calories, 0);
    const remaining = Math.max(0, dailyGoal - consumed);
    const progressPercent = Math.min(100, (consumed / dailyGoal) * 100);

    const getProgressColor = () => {
        if (progressPercent < 50) return '#4ade80'; // green
        if (progressPercent < 80) return '#fbbf24'; // yellow
        return '#ef4444'; // red
    };

    return (
        <ScreenLayout>
            <Card className='w-full max-w-2xl p-0 bg-[#121212] rounded-2xl shadow-lg overflow-hidden'>
                {/* Header */}
                <View className='w-full h-32 relative bg-main header p-6 overflow-hidden'>
                    <Image
                        source={require('@/assets/images/header-back.png')}
                        className='absolute top-0 left-0 right-0 bottom-0'
                        resizeMode='cover'
                    />
                    <Text className='text-3xl font-bold text-white'>CaloMeter</Text>
                    <Text className='text-sm text-gray-800 mt-1'>Track your meals and stay healthy</Text>
                </View>

                {/* Content */}
                <View className='p-4'>
                    {/* Circular Progress Section */}
                    <View className='items-center mt-10'>
                        <AnimatedCircularProgress
                            size={180}
                            width={14}
                            fill={progressPercent}
                            tintColor={getProgressColor()}
                            backgroundColor='#1f2937'
                            rotation={0}
                            lineCap='round'
                        >
                            {() => (
                                <View className='items-center'>
                                    <Text className='text-2xl font-bold text-white'>
                                        {consumed}
                                        <Text className='text-lg font-normal text-gray-400'> / {dailyGoal} kcal</Text>
                                    </Text>
                                    <Text className='text-sm text-gray-400 mt-1'>
                                        {remaining > 0 ? `${remaining} kcal remaining` : 'Goal exceeded!'}
                                    </Text>
                                </View>
                            )}
                        </AnimatedCircularProgress>
                    </View>

                    {/* Progress Bar */}
                    <View className='px-6 mt-10'>
                        <View className='flex-row justify-between mb-1'>
                            <Text className='text-sm text-gray-400'>Daily Progress</Text>
                            <Text className='text-sm font-medium' style={{ color: getProgressColor() }}>
                                {Math.round(progressPercent)}%
                            </Text>
                        </View>
                        <View className='h-3 bg-gray-700 rounded-full overflow-hidden'>
                            <View
                                className='h-full rounded-full'
                                style={{
                                    width: `${progressPercent}%`,
                                    backgroundColor: getProgressColor(),
                                }}
                            />
                        </View>
                    </View>

                    {/* Quick Actions */}
                    <View className='w-3/4 px-6 mt-6 gap-3 self-center'>
                        <Button
                            onPress={() =>
                                router.push({
                                    pathname: '/snap_meal',
                                    params: { date: today, screenId: 'dashboard' },
                                })
                            }
                            className='flex-1 blue-btn rounded-xl p-3 flex-row items-center justify-center'
                        >
                            <Camera size={20} color='white' />
                            <Text className='ml-2 text-white font-medium'>Snap / Scan Meal</Text>
                        </Button>
                        <Button
                            onPress={() =>
                                router.push({
                                    pathname: '/add_meal',
                                    params: { date: today, screenId: 'dashboard' },
                                })
                            }
                            className='flex-1 blue-rbtn rounded-xl p-3 flex-row items-center justify-center'
                        >
                            <Plus size={20} color='white' />
                            <Text className='ml-2 text-white font-medium'>Add Manually</Text>
                        </Button>
                    </View>

                    {/* Recent Meals Section */}
                    <View className='flex-1 mt-6'>
                        <View className='px-6'>
                            <View className='flex-row justify-between items-center mb-3'>
                                <Text className='text-lg font-bold text-white'>Recent Meals</Text>
                                <Button
                                    onPress={() =>
                                        router.push({
                                            pathname: '/add_meal',
                                            params: { date: today, screenId: 'dashboard' },
                                        })
                                    }
                                    variant='link'
                                    className='flex-row items-center'
                                >
                                    <Text className='text-blue-400 font-medium'>View All</Text>
                                    <ChevronRight size={16} color='#3b82f6' />
                                </Button>
                            </View>
                        </View>

                        {loading ? (
                            <ActivityIndicator size='large' color='#3b82f6' />
                        ) : (
                            <FlatList
                                data={meals}
                                keyExtractor={(item) => item.id}
                                contentContainerStyle={{ paddingHorizontal: 24 }}
                                scrollEnabled={false}
                                renderItem={({ item }) => (
                                    <View className='bg-[#1e1e1e] rounded-xl shadow-sm mb-3 p-4 border border-gray-800 flex-row items-center'>
                                        <Image
                                            source={require('@/assets/images/placeholder.jpg')}
                                            resizeMode='cover'
                                            style={{ width: 64, height: 64 }}
                                            className='w-16 h-16 rounded-lg mr-4'
                                        />
                                        <View className='flex-1'>
                                            <Text className='text-base font-semibold text-white'>{item.name}</Text>
                                            <Text className='text-sm text-gray-400 mt-1'>{item.calories} kcal</Text>
                                        </View>
                                        <View className='bg-blue-900/40 rounded-full px-3 py-1'>
                                            <Text className='text-blue-400 font-medium text-sm'>
                                                {Math.round((item.calories / dailyGoal) * 100)}%
                                            </Text>
                                        </View>
                                    </View>
                                )}
                            />
                        )}
                    </View>
                </View>
            </Card>
        </ScreenLayout>
    );
}
