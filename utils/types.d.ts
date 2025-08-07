interface User {
    id: string;
    name?: string;
    email: string;
    avatar?: string;
}

interface AuthResponse {
    accessToken: string;
    user?: User;
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
