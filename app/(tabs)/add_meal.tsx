import { ScreenLayout } from '@/components/ScreenLayout';
import { Card } from '@/components/ui/card';
import { useUser } from '@/providers/userProvider';
import { getOpenFood } from '@/services/food.service';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Plus, Search } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, FlatList, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function FoodSearchScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [foods, setFoods] = useState<OpenFoodFactsResponse>({});
    const [grams, setGrams] = useState<Record<string, string>>({});
    const [mealTypes, setMealTypes] = useState<Record<string, string>>({});

    const { date: routeDate, screenId } = useLocalSearchParams();
    const mealDate = (routeDate as string) || new Date().toISOString().split('T')[0];

    const { walletAddress, xionManager, isLoggedIn } = useUser();
    const router = useRouter();

    const handleSearch = async () => {
        const results = await getOpenFood(searchQuery);
        setFoods(results);
    };

    const handleAddFood = async (food: FoodItem) => {
        if (!isLoggedIn || !walletAddress || !xionManager) {
            Alert.alert('Error', 'Please connect your wallet first');
            console.log('Please connect your wallet first');
            return;
        }

        const g = parseFloat(grams[food.code] || '100');
        if (!g) {
            Alert.alert('Error', 'Please enter grams');
            return;
        }

        const mealType = mealTypes[food.code] || 'Breakfast';
        const calories = ((food.nutriments?.['energy-kcal_100g'] || 0) * g) / 100;

        const mealEntry = {
            name: food.product_name || 'Unknown food',
            type: mealType,
            grams: g,
            calories,
            date: mealDate,
            createdAt: new Date().toISOString(),
        };

        try {
            const result = await xionManager.storeDocument('foodEntry', `${food.code}-${mealDate}`, mealEntry);

            if (result.success) {
                Alert.alert('Success', `Added ${g}g ${food.product_name} to ${mealType}`);
                // Navigate back to meal screen and refresh
                if (screenId === 'meal') {
                    router.back();
                }
            } else {
                Alert.alert('Error', 'Failed to save meal');
            }
        } catch (err) {
            console.error('Error saving meal:', err);
            Alert.alert('Error', 'Something went wrong while saving the meal');
        }
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
                                    <Text className='text-gray-400 text-sm'>
                                        {`${item.nutriments?.['energy-kcal_100g']?.toFixed?.(0) || 0} kcal / 100g`}
                                    </Text>
                                </View>
                                {Platform.OS === 'web' ? (
                                    <Picker
                                        selectedValue={mealTypes[item.code] || 'Breakfast'}
                                        onValueChange={(value) => setMealTypes({ ...mealTypes, [item.code]: value })}
                                        style={{
                                            color: 'white',
                                            backgroundColor: '#2a2a2a',
                                            borderRadius: 12,
                                        }}
                                        className='me-2 p-1 text-sm'
                                    >
                                        <Picker.Item label='Breakfast' value='Breakfast' />
                                        <Picker.Item label='Lunch' value='Lunch' />
                                        <Picker.Item label='Dinner' value='Dinner' />
                                        <Picker.Item label='Snacks' value='Snacks' />
                                    </Picker>
                                ) : null}

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
                                        <Picker.Item style={{ fontSize: 13 }} label='Breakfast' value='Breakfast' />
                                        <Picker.Item style={{ fontSize: 13 }} label='Lunch' value='Lunch' />
                                        <Picker.Item style={{ fontSize: 13 }} label='Dinner' value='Dinner' />
                                        <Picker.Item style={{ fontSize: 13 }} label='Snacks' value='Snacks' />
                                    </Picker>
                                </View>
                            ) : null}
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
