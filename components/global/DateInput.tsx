import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

type DateInputProps = {
    value?: Date;
    onChange?: (date: Date) => void;
    placeholder?: string;
    className?: string;
};

export function DateInput({ value, onChange, placeholder = 'Select a date', className }: DateInputProps) {
    const [show, setShow] = useState(false);
    const [date, setDate] = useState<Date>(value || new Date());

    const formatDate = (date: Date): string => {
        if (!date || isNaN(date.getTime())) return '';
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${month}-${day}-${year}`;
    };

    const handleChange = (event: any, selectedDate?: Date) => {
        setShow(false);

        if (selectedDate) {
            setDate(selectedDate);
            if (onChange) onChange(selectedDate);
        }
    };

    // Web version - use native HTML input
    if (Platform.OS === 'web') {
        return (
            <View className={className}>
                <input
                    type='date'
                    value={date.toISOString().split('T')[0]}
                    onChange={(e) => {
                        const newDate = new Date(e.target.value);
                        setDate(newDate);
                        if (onChange) onChange(newDate);
                    }}
                    className='main-input p-3 rounded-md border border-gray-300 text-white bg-[#121212] w-full'
                    placeholder={placeholder}
                    style={{ color: 'white', colorScheme: 'dark' }}
                />
            </View>
        );
    }

    return (
        <View className={className}>
            <Pressable className='main-input p-3 rounded-md border border-gray-300' onPress={() => setShow(true)}>
                <Text className='text-white'>{date ? formatDate(date) : placeholder}</Text>
            </Pressable>

            {show && (
                <DateTimePicker
                    value={date}
                    mode='date'
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleChange}
                    themeVariant='dark'
                    maximumDate={new Date(2100, 0, 1)}
                    minimumDate={new Date(1900, 0, 1)}
                    textColor='white'
                    accentColor='white'
                />
            )}
        </View>
    );
}
