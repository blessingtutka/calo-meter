import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY || '');

export interface FoodAnalysisResult {
    foodItems: FoodItem[];
}

export async function analyzeFoodImage(imageUri: string): Promise<FoodAnalysisResult> {
    try {
        // Convert image to base64
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const base64Data = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                // @ts-ignore
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.readAsDataURL(blob);
        });

        const model = genAI.getGenerativeModel({
            model: 'gemini-pro-vision',
            generationConfig: {
                temperature: 0.4,
                topK: 32,
                topP: 1,
                maxOutputTokens: 4096,
            },
            safetySettings: [
                {
                    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
            ],
        });

        const prompt = `Analyze this food image and identify all food items. For each item, try to find the most likely barcode or product code. 
            Return the data in JSON format with this structure: { foodItems: [ { code: string, product_name: string, type:'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks' } ] }. 
            If you can't identify a barcode, make your best guess for the product name.
            Result should be related to open food fact
            `;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Data,
                    mimeType: 'image/jpeg',
                },
            },
        ]);

        const responseText = result.response.text();

        // Extract JSON from the response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('No JSON found in response');
        }

        const analysisResult = JSON.parse(jsonMatch[0]) as FoodAnalysisResult;

        // Now enrich with nutrition data from OpenFoodFacts
        for (const item of analysisResult.foodItems) {
            if (item.code) {
                try {
                    const nutritionData = await fetchNutritionData(item.code);
                    if (nutritionData) {
                        item.product_name = nutritionData.product_name || item.product_name;
                        item.nutriments = nutritionData.nutriments;
                    }
                } catch (error) {
                    console.warn(`Could not fetch nutrition data for ${item.code}:`, error);
                }
            }
        }

        return analysisResult;
    } catch (error) {
        console.error('Error analyzing food image:', error);
        throw error;
    }
}

async function fetchNutritionData(barcode: string): Promise<FoodItem | null> {
    try {
        const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
        const data = await response.json();

        if (data.status === 1) {
            return {
                code: barcode,
                product_name: data.product.product_name,
                nutriments: data.product.nutriments,
            };
        }

        return null;
    } catch (error) {
        console.error('Error fetching nutrition data:', error);
        return null;
    }
}
