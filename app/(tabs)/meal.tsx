import { ScreenLayout } from '@/components/ScreenLayout';
import { Accordion, AccordionContent, AccordionHeader, AccordionItem, AccordionTitleText, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useUser } from '@/providers/userProvider';
import { useRouter } from 'expo-router';
import { Camera, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Plus } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, View } from 'react-native';

// Meal entry type
interface MealEntry {
    id: string;
    name: string;
    calories: number;
    type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
    date: string;
}

export default function Meal() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [mealData, setMealData] = useState<Record<string, MealEntry[]>>({
        Breakfast: [],
        Lunch: [],
        Dinner: [],
        Snacks: [],
    });
    const [isFetching, setIsFetching] = useState(true);

    const { walletAddress, xionManager, isLoggedIn } = useUser();
    const router = useRouter();

    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    const today = new Date();
    const todayKey = formatDate(today);
    const dateKey = formatDate(currentDate);

    const handlePrevDay = () => {
        const prev = new Date(currentDate);
        prev.setDate(prev.getDate() - 1);
        setCurrentDate(prev);
    };

    const handleNextDay = () => {
        if (dateKey === todayKey) return;
        const next = new Date(currentDate);
        next.setDate(next.getDate() + 1);
        setCurrentDate(next);
    };

    // Fetch meals for this date
    const fetchMeals = async () => {
        if (!xionManager || !walletAddress) return;

        setIsFetching(true);
        try {
            const result = await xionManager.queryDocuments('foodEntry', walletAddress);

            if (result.success && result.documents.length > 0) {
                // Filter entries by date
                const meals = result.documents
                    .map(([id, doc]: [string, any]) => ({
                        id,
                        ...JSON.parse(doc.data),
                    }))
                    .filter((meal: MealEntry) => meal.date === dateKey);

                // Group by type
                const grouped: Record<string, MealEntry[]> = {
                    Breakfast: [],
                    Lunch: [],
                    Dinner: [],
                    Snacks: [],
                };
                meals.forEach((meal: MealEntry) => {
                    if (grouped[meal.type]) {
                        grouped[meal.type].push(meal);
                    }
                });

                setMealData(grouped);
            } else {
                setMealData({ Breakfast: [], Lunch: [], Dinner: [], Snacks: [] });
            }
        } catch (err) {
            console.error('Error fetching meals:', err);
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        if (isLoggedIn && walletAddress) {
            fetchMeals();
        }
    }, [dateKey, isLoggedIn, walletAddress]);

    return (
        <ScreenLayout>
            <Card className='w-full max-w-2xl p-4 bg-[#121212] rounded-2xl shadow-lg overflow-hidden'>
                {/* Date Navigation */}
                <View className='flex-row justify-between items-center px-4 py-2'>
                    <Button variant='solid' onPress={handlePrevDay}>
                        <ChevronLeft size={20} color='white' />
                    </Button>
                    <Text className='text-white font-semibold'>{dateKey}</Text>
                    <Button variant='solid' onPress={handleNextDay} disabled={dateKey === todayKey}>
                        <ChevronRight size={20} color={dateKey === todayKey ? 'gray' : 'white'} />
                    </Button>
                </View>

                {/* Actions */}
                <View className='w-full flex-row gap-3 mb-4'>
                    <Button
                        onPress={() =>
                            router.push({
                                pathname: '/snap_meal',
                                params: {
                                    date: dateKey,
                                    screenId: 'meal',
                                },
                            })
                        }
                        className='flex-1 blue-btn rounded-xl p-3 flex-row items-center justify-center'
                    >
                        <Camera size={20} color='white' />
                        <Text className='ml-2 text-white font-medium'>Snap</Text>
                    </Button>
                    <Button
                        onPress={() =>
                            router.push({
                                pathname: '/add_meal',
                                params: {
                                    date: dateKey,
                                    screenId: 'meal',
                                },
                            })
                        }
                        className='flex-1 blue-rbtn rounded-xl p-3 flex-row items-center justify-center'
                    >
                        <Plus size={20} color='white' />
                        <Text className='ml-2 text-white font-medium'>Add</Text>
                    </Button>
                </View>

                {/* Meals */}
                {isFetching ? (
                    <View className='items-center justify-center py-8'>
                        <ActivityIndicator size='large' color='#60a5fa' />
                        <Text className='text-gray-400 mt-2'>Loading meals...</Text>
                    </View>
                ) : (
                    <Accordion type='single' className='!bg-transparent' isCollapsible={true} isDisabled={false}>
                        {Object.keys(mealData).map((mealType) => (
                            <AccordionItem key={mealType} value={mealType}>
                                <AccordionHeader>
                                    <AccordionTrigger>
                                        {({ isExpanded }: { isExpanded: boolean }) => (
                                            <>
                                                <View className='flex-row gap-2'>
                                                    <AccordionTitleText className='text-white font-semibold text-lg'>{mealType}</AccordionTitleText>
                                                    <Text className='text-sm font-light text-gray-400 mt-1'>
                                                        {mealData[mealType].reduce((a, e) => a + e.calories, 0)} kcal
                                                    </Text>
                                                </View>
                                                {isExpanded ? (
                                                    <ChevronUp color={'white'} size={24} className='ml-3' />
                                                ) : (
                                                    <ChevronDown color={'white'} size={24} className='ml-3' />
                                                )}
                                            </>
                                        )}
                                    </AccordionTrigger>
                                </AccordionHeader>
                                <AccordionContent>
                                    {mealData[mealType].length > 0 ? (
                                        <FlatList
                                            data={mealData[mealType]}
                                            keyExtractor={(item) => item.id}
                                            scrollEnabled={false}
                                            renderItem={({ item }) => (
                                                <View className='bg-[#1e1e1e] rounded-xl shadow-sm mb-3 p-4 border border-gray-800 flex-row items-center'>
                                                    <Image
                                                        source={require('@/assets/images/placeholder.jpg')}
                                                        resizeMode='cover'
                                                        style={{ width: 48, height: 48 }}
                                                        className='rounded-lg mr-4'
                                                    />
                                                    <View className='flex-1'>
                                                        <Text className='text-base font-semibold text-white'>{item.name}</Text>
                                                        <Text className='text-sm text-gray-400 mt-1'>{item.calories} kcal</Text>
                                                    </View>
                                                </View>
                                            )}
                                        />
                                    ) : (
                                        <Text className='text-gray-400 px-2'>No meals logged.</Text>
                                    )}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                )}
            </Card>
        </ScreenLayout>
    );
}
