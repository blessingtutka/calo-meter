import { ScreenLayout } from '@/components/ScreenLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useUser } from '@/providers/userProvider';
import { analyzeFoodImage } from '@/services/gemini.service';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Trash2 } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function SnapMeal() {
    const router = useRouter();
    const { date: routeDate, screenId } = useLocalSearchParams();

    const dateKey = routeDate || new Date().toISOString().split('T')[0];

    const { xionManager, walletAddress } = useUser();

    const [image, setImage] = useState<string | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [foodItems, setFoodItems] = useState<FoodItem[]>([]);

    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView>(null);

    const takePicture = async () => {
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePictureAsync({ quality: 0.8, base64: true });
                setImage(photo.uri);
            } catch (error) {
                console.error('Error taking picture:', error);
                Alert.alert('Error', 'Failed to take picture');
            }
        }
    };

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
                base64: true,
            });

            if (!result.canceled) {
                setImage(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to pick image');
        }
    };

    const analyzeImage = async () => {
        if (!image) return;
        setAnalyzing(true);
        try {
            const result = await analyzeFoodImage(image);
            setFoodItems(result.foodItems || []);
        } catch (error) {
            console.error('Error analyzing image:', error);
            Alert.alert('Error', 'Failed to analyze image. Please try again.');
        } finally {
            setAnalyzing(false);
        }
    };

    const addToMeals = async (item: FoodItem) => {
        if (!xionManager || !walletAddress) {
            Alert.alert('Error', 'Please connect your wallet first');
            return;
        }

        try {
            const entry = {
                name: item.product_name || 'Unknown Food',
                calories: item.nutriments?.['energy-kcal_100g'] || 0,
                grams: 100,
                type: 'Snap',
                date: dateKey,
                createdAt: new Date().toISOString(),
            };

            await xionManager.storeDocument('foodEntry', `${item.code}-${dateKey}`, JSON.stringify(entry));

            Alert.alert('Success', `${entry.name} added to meals!`);
            router.push({
                pathname: '/meal',
                params: { date: dateKey, screenId: 'meal' },
            });
        } catch (err) {
            console.error('Error saving meal:', err);
            Alert.alert('Error', 'Could not save meal');
        }
    };

    const removeItem = (code: string) => {
        setFoodItems((prev) => prev.filter((item) => item.code !== code));
    };

    if (!permission) {
        return (
            <ScreenLayout>
                <View className='flex-1 justify-center items-center'>
                    <Text className='text-white'>Requesting camera permission...</Text>
                </View>
            </ScreenLayout>
        );
    }

    if (!permission.granted) {
        return (
            <ScreenLayout>
                <Card className='w-full max-w-2xl p-6 bg-[#121212] rounded-2xl'>
                    <View className='flex-1 justify-center items-center gap-3'>
                        <Text className='text-white'>No access to camera</Text>
                        <Button onPress={requestPermission} className='flex-1 blue-btn rounded-xl p-3 flex-row items-center justify-center'>
                            <Text className='text-white'>Grant Permission</Text>
                        </Button>
                        <Button onPress={pickImage} className='flex-1 blue-rbtn rounded-xl p-3 flex-row items-center justify-center'>
                            <Text className='text-white'>Pick Image from Gallery</Text>
                        </Button>
                    </View>
                </Card>
            </ScreenLayout>
        );
    }

    return (
        <ScreenLayout>
            <Card className='w-full max-w-2xl p-6 bg-[#121212] rounded-2xl'>
                <Text className='text-2xl font-bold text-white mb-6'>Snap Your Meal ({dateKey})</Text>

                {!image ? (
                    <View className='flex-1'>
                        <CameraView ref={cameraRef} style={{ width: '100%', height: 300, borderRadius: 12 }} facing='back' />
                        <View className='flex-row justify-between mt-4'>
                            <Button onPress={pickImage} variant='outline' className='flex-1 mr-2'>
                                <Text className='text-white'>Choose from Gallery</Text>
                            </Button>
                            <Button onPress={takePicture} className='flex-1 ml-2'>
                                <Text className='text-white'>Take Picture</Text>
                            </Button>
                        </View>
                    </View>
                ) : (
                    <View className='flex-1'>
                        <Image source={{ uri: image }} style={{ width: '100%', height: 300, borderRadius: 12 }} />

                        {analyzing ? (
                            <View className='mt-6 items-center'>
                                <ActivityIndicator size='large' color='#3b82f6' />
                                <Text className='text-white mt-2'>Analyzing your meal...</Text>
                            </View>
                        ) : foodItems.length > 0 ? (
                            <ScrollView className='mt-6 max-h-64'>
                                <Text className='text-lg font-bold text-white mb-3'>Detected Foods:</Text>
                                <FlatList
                                    data={foodItems}
                                    keyExtractor={(item) => item.code}
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
                                                <Text className='text-base font-semibold text-white'>{item.product_name}</Text>
                                                <Text className='text-sm text-gray-400 mt-1'>
                                                    {item.nutriments?.['energy-kcal_100g']} kcal / 100g
                                                </Text>
                                            </View>
                                            <View className='flex-row gap-2'>
                                                <TouchableOpacity onPress={() => addToMeals(item)} className='px-3 py-1 bg-blue-600 rounded-lg'>
                                                    <Text className='text-white text-sm'>Add</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => removeItem(item.code)} className='px-3 py-1 bg-red-600 rounded-lg'>
                                                    <Trash2 size={16} color='white' />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )}
                                />
                            </ScrollView>
                        ) : (
                            <View className='mt-6'>
                                <Button onPress={analyzeImage} className='mb-3'>
                                    <Text className='text-white'>Analyze Image</Text>
                                </Button>
                                <Button onPress={() => setImage(null)} variant='outline'>
                                    <Text className='text-white'>Retake Picture</Text>
                                </Button>
                            </View>
                        )}
                    </View>
                )}
            </Card>
        </ScreenLayout>
    );
}
