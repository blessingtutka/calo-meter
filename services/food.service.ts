import { useAbstraxionAccount, useAbstraxionSigningClient } from '@burnt-labs/abstraxion-react-native';
import axios from 'axios';

const RUM_CONTRACT_ADDRESS = process.env.EXPO_PUBLIC_RUM_CONTRACT_ADDRESS ?? '';
const RPC_ENDPOINT = 'https://rpc.xion.network';

export const getOpenFood = async (query: string): Promise<any> => {
    try {
        const url = `https://corsproxy.io/?https://world.openfoodfacts.org/cgi/search.pl?search_terms=${query}&fields=product_name,nutriments&json=1`;

        const response = await axios.get(url);

        if (response.data.status === 'error') {
            throw new Error(response.data.error.message);
        }

        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            const serverError = error.response.data;
            throw new Error(serverError.error?.message || 'Server error');
        } else {
            throw new Error(error.message || 'An unexpected error occurred');
        }
    }
};

export const useXionClient = () => {
    const { client: signingClient } = useAbstraxionSigningClient();
    const { data: account } = useAbstraxionAccount();
    return { signingClient, account };
};

export const saveFoodEntry = async (signingClient: any, account: any, data: any) => {
    if (!signingClient || !account) {
        throw new Error('Xion account not connected.');
    }

    const saveMessage = {
        add_food_entry: {
            meal_date: data.mealDate,
            meal_type: data.mealType,
            product_name: data.productName,
            calories: data.calories,
            grams: data.grams,
            code: data.openFoodFactsCode,
            // reclaim_proof: data.reclaimProof, // Optional: only include if available
        },
    };

    try {
        const result = await signingClient.execute(account.address, RUM_CONTRACT_ADDRESS, saveMessage, 'auto');
        console.log('Transaction result:', result);
        return result.transactionHash;
    } catch (error) {
        console.error('Error saving data to Xion:', error);
        throw error;
    }
};

export const deleteFoodEntryByCode = async (signingClient: any, account: any, foodCode: string) => {
    if (!signingClient || !account) {
        throw new Error('Xion account not connected.');
    }

    const deleteMessage = {
        delete_food_entry: {
            food_code: foodCode,
        },
    };

    try {
        const result = await signingClient.execute(account.address, RUM_CONTRACT_ADDRESS, deleteMessage, 'auto');
        console.log('Food entry deleted:', result.transactionHash);
        return result.transactionHash;
    } catch (error) {
        console.error('Error deleting food entry:', error);
        throw error;
    }
};
