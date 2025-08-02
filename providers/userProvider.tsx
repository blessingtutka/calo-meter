import React, { createContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UserContextType = {
    user: TUser | null;
    isLoggedIn: boolean;
    login: (userData: TUser) => Promise<void>;
    logout: () => Promise<void>;
};

export const UserContext = createContext<UserContextType | null>(null);

type UserProviderProps = {
    children: ReactNode;
};

export const UserProvider = ({ children }: UserProviderProps) => {
    const [user, setUser] = useState<TUser | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        Promise.all([AsyncStorage.getItem('accessToken'), AsyncStorage.getItem('user')]).then(([storedAccessToken, storedUser]) => {
            if (storedAccessToken && storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUser({ ...parsedUser, accessToken: storedAccessToken });
                setIsLoggedIn(true);
            }
        });
    }, []);

    const login = async (userData: TUser) => {
        const { username, accessToken } = userData;
        setUser(userData);
        setIsLoggedIn(true);

        await AsyncStorage.setItem('accessToken', accessToken);
        await AsyncStorage.setItem('user', JSON.stringify({ username }));
    };

    const logout = async () => {
        setUser(null);
        setIsLoggedIn(false);

        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('user');
    };

    return <UserContext.Provider value={{ user, isLoggedIn, login, logout }}>{children}</UserContext.Provider>;
};
