import { ScreenLayout } from '@/components/ScreenLayout';
import { Card } from '@/components/ui/card';
import { getOpenFood } from '@/services/food.service';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams } from 'expo-router';
import { Plus, Search } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function FoodSearchScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [foods, setFoods] = useState<OpenFoodFactsResponse>({});
    const [grams, setGrams] = useState<Record<string, string>>({});
    const [mealTypes, setMealTypes] = useState<Record<string, string>>({});

    const { mealDate: routeMealDate } = useLocalSearchParams();
    const mealDate = routeMealDate || new Date().toISOString().split('T')[0];
    const walletId = '0xUSER_WALLET_ID'; //to change

    const handleSearch = async () => {
        const results = await getOpenFood(searchQuery);
        setFoods(results);
    };

    const handleAddFood = (food: FoodItem) => {
        const g = parseFloat(grams[food.code] || '100');
        if (!g) return;
        const mealType = mealTypes[food.code] || 'Breakfast';
        const calories = ((food.nutriments?.['energy-kcal_100g'] || 0) * g) / 100;
        console.log(`Added ${g}g ${food.product_name} → ${calories.toFixed(0)} kcal to ${mealType}`);
        // integrate with meal log here
    };

    return (
        <ScreenLayout>
            <Card className='w-full max-w-2xl p-4 bg-[#121212] rounded-2xl shadow-lg overflow-hidden'>
                {/* Header Search Bar */}
                <View className='mt-2 p-2 bg-[#1e1e1e] flex-row items-center rounded-2xl'>
                    <TextInput
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSubmitEditing={handleSearch}
                        placeholder='Search foods...'
                        placeholderTextColor='#888'
                        className='flex-1 bg-[#2a2a2a] text-white px-4 py-2 rounded-xl'
                    />
                    <TouchableOpacity onPress={handleSearch} className='ml-3 p-2 flex-row gap-1 items-center bg-blue-600 rounded-xl'>
                        <Search size={20} color={'white'} />
                        <Text className='text-white font-medium'>Search</Text>
                    </TouchableOpacity>
                </View>

                {/* Results */}
                <FlatList
                    data={foods.products}
                    keyExtractor={(item) => item.code}
                    contentContainerStyle={{ padding: 16 }}
                    scrollEnabled={false}
                    renderItem={({ item }) => (
                        <View className='bg-[#1e1e1e] rounded-xl p-4 mb-3 border border-gray-800'>
                            <View className='flex-row items-center mb-2'>
                                <View className='flex-1'>
                                    <Text className='text-white font-semibold text-base'>{item.product_name}</Text>
                                    <Text className='text-gray-400 text-sm'>{`${item.nutriments?.['energy-kcal_100g'].toFixed(0)} kcal / 100g`}</Text>
                                </View>
                                {Platform.OS === 'web' ? (
                                    <Picker
                                        selectedValue={grams[item.code] || 'Breakfast'}
                                        onValueChange={(value) => setMealTypes({ ...mealTypes, [item.code]: value })}
                                        style={{ color: 'white', backgroundColor: '#2a2a2a', borderRadius: 12 }}
                                        className='me-2 p-1 text-sm'
                                    >
                                        <Picker.Item label='breakfast' value='Breakfast' />
                                        <Picker.Item label='lunch' value='Lunch' />
                                        <Picker.Item label='dinner' value='Dinner' />
                                        <Picker.Item label='snacks' value='Snacks' />
                                    </Picker>
                                ) : (
                                    ''
                                )}

                                <TextInput
                                    value={grams[item.code] || ''}
                                    onChangeText={(text) => setGrams({ ...grams, [item.code]: text })}
                                    placeholder='g'
                                    placeholderTextColor='#888'
                                    keyboardType='numeric'
                                    className='w-16 bg-[#2a2a2a] text-white px-2 py-1 rounded-lg mr-3 text-center'
                                />
                                <TouchableOpacity onPress={() => handleAddFood(item)} className='p-2 bg-blue-600 rounded-full'>
                                    <Plus size={20} color='white' />
                                </TouchableOpacity>
                            </View>
                            {Platform.OS !== 'web' ? (
                                <View style={styles.container}>
                                    <Picker
                                        selectedValue={mealTypes[item.code] || 'Breakfast'}
                                        onValueChange={(value) => setMealTypes({ ...mealTypes, [item.code]: value })}
                                        mode='dropdown'
                                        style={styles.picker}
                                    >
                                        <Picker.Item style={{ fontSize: 13 }} label='Meal Type' value='' enabled={false} />
                                        <Picker.Item style={{ fontSize: 13 }} label='breakfast' value='Breakfast' />
                                        <Picker.Item style={{ fontSize: 13 }} label='lunch' value='Lunch' />
                                        <Picker.Item style={{ fontSize: 13 }} label='dinner' value='Dinner' />
                                        <Picker.Item style={{ fontSize: 13 }} label='snacks' value='Snacks' />
                                    </Picker>
                                </View>
                            ) : (
                                ''
                            )}
                        </View>
                    )}
                />
            </Card>
        </ScreenLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        backgroundColor: '#2a2a2a',
        overflow: 'hidden',
    },
    picker: {
        color: '#fff',
        paddingVertical: 4,
        width: '100%',
        paddingHorizontal: 4,
        fontSize: 12,
        height: 50,
    },
});
