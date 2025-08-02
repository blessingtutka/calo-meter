import { ActivityIndicator } from '@/components/ui/activity-indicator';
import { googleService } from '@/services/google.service';
import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes, // Import statusCodes directly
} from '@react-native-google-signin/google-signin';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

interface GoogleSignInButtonProps {
    onSuccess: (userInfo: any) => void;
    onError?: (error: any) => void;
    isLoading?: boolean;
    disabled?: boolean;
}

export function Google({ onSuccess, onError, isLoading = false, disabled = false }: GoogleSignInButtonProps) {
    useEffect(() => {
        googleService();
    }, []);

    const handlePress = async () => {
        try {
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            const userInfo = await GoogleSignin.signIn();
            const { idToken } = await GoogleSignin.getTokens();
            onSuccess({ ...userInfo, idToken });
        } catch (error: any) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                console.log('User cancelled sign-in');
            } else if (error.code === statusCodes.IN_PROGRESS) {
                console.log('Sign-in in progress');
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                console.log('Play services not available');
            } else {
                console.error('Google Sign-In Error:', error);
                onError?.(error);
            }
        }
    };

    if (isLoading) {
        return (
            <View className='w-full h-12 bg-gray-800 rounded flex items-center justify-center'>
                <ActivityIndicator className='text-white' />
                <Text className='text-white ml-2'>Signing in with Google...</Text>
            </View>
        );
    }

    return (
        <View className='w-full'>
            <GoogleSigninButton
                style={{ width: '100%', height: 48 }}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={handlePress}
                disabled={disabled || isLoading}
            />
        </View>
    );
}
