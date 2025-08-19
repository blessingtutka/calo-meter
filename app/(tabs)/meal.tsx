import { ScreenLayout } from '@/components/ScreenLayout';
import { Accordion, AccordionContent, AccordionHeader, AccordionItem, AccordionTitleText, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter } from 'expo-router';
import { Camera, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Plus } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, Image, Text, View } from 'react-native';

// Sample meals by date and type
const mealData: Record<string, Record<string, any[]>> = {
    '2025-08-19': {
        Breakfast: [
            { id: '1', name: 'Oatmeal', calories: 250 },
            { id: '2', name: 'Coffee', calories: 80 },
        ],
        Lunch: [
            { id: '3', name: 'Salad', calories: 180 },
            { id: '4', name: 'Pasta', calories: 420 },
        ],
        Dinner: [{ id: '5', name: 'Burger', calories: 700 }],
        Snacks: [{ id: '6', name: 'Protein Bar', calories: 200 }],
    },
};

export default function Meal() {
    const [currentDate, setCurrentDate] = useState(new Date());

    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    const today = new Date();
    const todayKey = formatDate(today);
    const dateKey = formatDate(currentDate);

    const router = useRouter();

    const handlePrevDay = () => {
        const prev = new Date(currentDate);
        prev.setDate(prev.getDate() - 1);
        setCurrentDate(prev);
    };

    const handleNextDay = () => {
        if (dateKey === todayKey) return; // prevent going beyond today
        const next = new Date(currentDate);
        next.setDate(next.getDate() + 1);
        setCurrentDate(next);
    };

    const mealsForDay = mealData[dateKey] || { Breakfast: [], Lunch: [], Dinner: [], Snacks: [] };

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

                <View className='w-full flex-row gap-3'>
                    <Button className='flex-1 blue-btn rounded-xl p-3 flex-row items-center justify-center'>
                        <Camera size={20} color='white' />
                        <Text className='ml-2 text-white font-medium'>Snap</Text>
                    </Button>
                    <Button onPress={() => router.push('/add_meal')} className='flex-1 blue-rbtn rounded-xl p-3 flex-row items-center justify-center'>
                        <Plus size={20} color='white' />
                        <Text className='ml-2 text-white font-medium'>Add</Text>
                    </Button>
                </View>

                {/* Accordion for meals */}
                <Accordion type='single' className='!bg-transparent' isCollapsible={true} isDisabled={false}>
                    {Object.keys(mealsForDay).map((mealType) => (
                        <AccordionItem key={mealType} value={mealType}>
                            <AccordionHeader>
                                <AccordionTrigger>
                                    {({ isExpanded }: { isExpanded: boolean }) => {
                                        return (
                                            <>
                                                <View className='flex-row gap-2'>
                                                    <AccordionTitleText className='text-white font-semibold text-lg'>{mealType}</AccordionTitleText>
                                                    <Text className='text-sm font-light text-gray-400 mt-1'>
                                                        {mealsForDay[mealType].reduce((a, e) => a + e.calories, 0)} kcal
                                                    </Text>
                                                </View>
                                                {isExpanded ? (
                                                    <ChevronUp color={'white'} size={24} className='ml-3' />
                                                ) : (
                                                    <ChevronDown color={'white'} size={24} className='ml-3' />
                                                )}
                                            </>
                                        );
                                    }}
                                </AccordionTrigger>
                            </AccordionHeader>
                            <AccordionContent>
                                {mealsForDay[mealType].length > 0 ? (
                                    <FlatList
                                        data={mealsForDay[mealType]}
                                        keyExtractor={(item) => item.id}
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
            </Card>
        </ScreenLayout>
    );
}
