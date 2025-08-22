import { ScreenLayout } from '@/components/ScreenLayout';
import { Card } from '@/components/ui/card';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

function getDaysInMonth(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOffset(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
}

export default function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const navigation = useNavigation();

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOffset = getFirstDayOffset(currentDate);

    const year = currentDate.getFullYear();
    const month = currentDate.toLocaleString('default', { month: 'long' });

    const daysArray: (number | null)[] = [
        ...Array.from({ length: firstDayOffset }, () => null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];
    const goToPrevMonth = () => {
        const prev = new Date(currentDate);
        prev.setMonth(prev.getMonth() - 1);
        setCurrentDate(prev);
    };

    const goToNextMonth = () => {
        const next = new Date(currentDate);
        next.setMonth(next.getMonth() + 1);
        setCurrentDate(next);
    };

    const handleDayPress = (day: number | null) => {
        if (!day) return;
        const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        // navigation.navigate("meal", { date: selectedDate.toISOString().split("T")[0] });
    };

    return (
        <ScreenLayout>
            <Card className='w-full max-w-2xl p-4 bg-[#121212] rounded-2xl shadow-lg overflow-hidden'>
                <View className='flex-row justify-between items-center mb-4'>
                    <TouchableOpacity onPress={goToPrevMonth}>
                        <Text className='text-lg font-bold text-white'>{'<'}</Text>
                    </TouchableOpacity>
                    <Text className='text-xl font-bold text-white'>
                        {month} {year}
                    </Text>
                    <TouchableOpacity onPress={goToNextMonth}>
                        <Text className='text-lg font-bold text-white'>{'>'}</Text>
                    </TouchableOpacity>
                </View>

                <View className='items-center justify-center'>
                    <View className='flex-row gap-2 mb-2'>
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                            <Text key={d} className='w-10 text-center font-semibold text-gray-200'>
                                {d}
                            </Text>
                        ))}
                    </View>

                    <FlatList
                        data={daysArray}
                        numColumns={7}
                        keyExtractor={(_, i) => i.toString()}
                        scrollEnabled={false}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                className='w-10 h-10 m-1 justify-center items-center rounded-full bg-gray-800'
                                onPress={() => handleDayPress(item)}
                            >
                                <Text className='text-center text-white'>{item ?? ''}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </Card>
        </ScreenLayout>
    );
}
