interface User {
    id: string;
    name?: string;
    email: string;
    avatar?: string;
}

interface AuthResponse {
    walletID: string;
    user?: User;
}

interface OpenFoodFactsResponse {
    products?: FoodItem[];
}

interface FoodItem {
    code: string;
    product_name?: string;
    nutriments?: Nutriments;
}

interface Nutriments {
    'energy-kcal_100g': number;
}

interface ErrorResponse {
    status: string;
    error: {
        code: string;
        message: string;
    };
}

interface ApiResponse<T> {
    status: string;
    message: string;
    data: T;
    status_code: number;
}

type Profile = {
    displayName: string;
    email: string;
    avatar?: string;
};
