// context/UserContext.tsx
import { XionManager } from '@/utils/xion.namager';
import { useAbstraxionAccount, useAbstraxionClient, useAbstraxionSigningClient } from '@burnt-labs/abstraxion-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface TUser {
    walletAddress: string;
    profile?: Profile;
}

interface UserContextType {
    user: TUser | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    profile: Profile | null;
    walletAddress: string | null;
    contractAddress: string | null;
    signingClient: any;
    queryClient: any;
    xionManager: XionManager | null;
    login: (userData: Partial<TUser>) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (profileData: Partial<Profile>) => Promise<void>;
    refreshUserData: () => Promise<void>;
}

// Create context
export const UserContext = createContext<UserContextType | undefined>(undefined);

type UserProviderProps = {
    children: ReactNode;
};

export const UserProvider = ({ children }: UserProviderProps) => {
    // Abstraxion hooks
    const { data: account, isConnected, logout: xionLogout } = useAbstraxionAccount();
    const { client: signingClient } = useAbstraxionSigningClient();
    const { client: queryClient } = useAbstraxionClient();

    // State
    const [user, setUser] = useState<TUser | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [contractAddress, setContractAddress] = useState<string | null>(null);
    const [xionManager, setXionManager] = useState<XionManager | null>(null);

    // Get contract address from environment
    useEffect(() => {
        const contractAddr = process.env.EXPO_PUBLIC_DOCUSTORE_CONTRACT_ADDRESS;
        if (contractAddr) {
            setContractAddress(contractAddr);
        } else {
            console.error('EXPO_PUBLIC_DOCUSTORE_CONTRACT_ADDRESS is not set');
        }
    }, []);

    useEffect(() => {
        if (signingClient && queryClient && account?.bech32Address && contractAddress) {
            setXionManager(new XionManager(signingClient, queryClient, account.bech32Address, contractAddress));
        }
    }, [signingClient, queryClient, account?.bech32Address, contractAddress]);

    // Fetch user profile from contract
    const fetchUserProfile = async (address: string): Promise<Profile | null> => {
        if (!xionManager) {
            console.log('xionManager not initialized');
            setIsLoading(false);
            return null;
        }

        try {
            const result = await xionManager.queryDocuments('profiles', address);
            if (result.success && result.documents.length > 0) {
                const profileDoc = result.documents.find(([id]: [string, any]) => id === address);
                if (profileDoc) {
                    return JSON.parse(profileDoc[1].data);
                }
            }
        } catch (error) {
            console.error('Error fetching profile from contract:', error);
        } finally {
            setIsLoading(false);
        }

        return null;
    };

    const updateContractProfile = async (profileData: Partial<Profile>): Promise<boolean> => {
        if (!xionManager || !walletAddress) return false;

        try {
            const currentProfile = profile || { displayName: '', email: '', avatar: '' };
            const updatedProfile = { ...currentProfile, ...profileData };

            const result = await xionManager.updateDocument('profiles', walletAddress, updatedProfile);

            if (result.success) {
                setProfile(updatedProfile);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error updating profile in contract:', error);
            return false;
        }
    };

    // Load user data on app start
    useEffect(() => {
        const loadUserData = async () => {
            try {
                const [storedUser] = await Promise.all([AsyncStorage.getItem('user')]);

                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    setUser({ ...parsedUser });
                    setIsLoggedIn(true);

                    // If we have a wallet address, try to fetch profile
                    if (parsedUser.walletAddress) {
                        const userProfile = await fetchUserProfile(parsedUser.walletAddress);
                        if (userProfile) {
                            setProfile(userProfile);
                        }
                    }
                }
            } catch (error) {
                console.error('Error loading user data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadUserData();
    }, []);

    // Sync with Abstraxion account changes
    useEffect(() => {
        if (account?.bech32Address && isConnected) {
            setWalletAddress(account.bech32Address);

            // If user is logged in but wallet address changed, update it
            if (isLoggedIn && user?.walletAddress !== account.bech32Address) {
                setUser((prev) => (prev ? { ...prev, walletAddress: account.bech32Address } : null));
            }
        }
    }, [account?.bech32Address, isConnected, isLoggedIn]);

    // Login function
    const login = async (userData: Partial<TUser>) => {
        try {
            const newUser: TUser = {
                walletAddress: userData.walletAddress || account?.bech32Address || '',
                profile: userData.profile,
            };

            setUser(newUser);
            setIsLoggedIn(true);

            // Store in AsyncStorage
            await AsyncStorage.setItem(
                'user',
                JSON.stringify({
                    walletAddress: newUser.walletAddress,
                }),
            );

            // Fetch profile from contract if wallet address is available
            if (newUser.walletAddress) {
                const userProfile = await fetchUserProfile(newUser.walletAddress);
                if (userProfile) {
                    setProfile(userProfile);
                }
            }
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    };

    // Logout function
    const logout = async () => {
        setUser(null);
        setProfile(null);
        setWalletAddress(null);
        setIsLoggedIn(false);
        await xionLogout();
        await AsyncStorage.removeItem('user');
    };

    // Update profile function
    const updateProfile = async (profileData: Partial<Profile>) => {
        if (!walletAddress) {
            throw new Error('No wallet address available');
        }

        const success = await updateContractProfile(profileData);
        if (success) {
            // Update local state
            setProfile((prev) => ({ ...prev!, ...profileData }));

            // Update user object if it exists
            if (user) {
                setUser({
                    ...user,
                    profile: { ...user.profile!, ...profileData },
                });
            }
        } else {
            throw new Error('Failed to update profile');
        }
    };

    // Refresh user data
    const refreshUserData = async () => {
        if (!walletAddress) return;

        try {
            const userProfile = await fetchUserProfile(walletAddress);
            if (userProfile) {
                setProfile(userProfile);
            }
        } catch (error) {
            console.error('Error refreshing user data:', error);
        }
    };

    const contextValue: UserContextType = {
        user,
        isLoggedIn,
        isLoading,
        profile,
        walletAddress,
        contractAddress,
        signingClient,
        queryClient,
        xionManager,
        login,
        logout,
        updateProfile,
        refreshUserData,
    };

    return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};

// Custom hook for easier usage
export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
