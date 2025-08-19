import { OtpInput } from '@/components/global';
import { HStack, Spinner } from '@gluestack-ui/themed';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { Button, ButtonText } from '../ui/button';

const OtpForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [resendCountdown, setResendCountdown] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const route = useRouter();

    const handleComplete = async (otp: string) => {
        setIsSubmitting(true);
        setErrorMessage('');
        try {
            console.log('Submitting OTP:', otp);
            // await verifyOTP(otp);
            route.push('/dashboard');
        } catch (error) {
            setErrorMessage('Invalid verification code. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResendCode = async () => {
        setIsResending(true);
        try {
            console.log('Requesting new OTP');
            // await resendOTP();
            setResendCountdown(30);
            const timer = setInterval(() => {
                setResendCountdown((prev) => {
                    if (prev <= 1) clearInterval(timer);
                    return prev - 1;
                });
            }, 1000);
        } catch (error) {
            setErrorMessage('Failed to resend code. Please try again.');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <View className='flex-col items-center justify-center flex-1 px-4 gap-2'>
            <Text className='text-2xl mb-4 text-center text-white'>Enter 6-digit verification code</Text>

            <Text className='text-sm text-gray-500 mb-4 text-center'>Please check your email for the verification code</Text>

            <OtpInput onCodeFilled={handleComplete} />

            {errorMessage && <Text className='text-red-500 text-sm mt-2 text-center'>{errorMessage}</Text>}

            <View className='flex-col items-center justify-center gap-2'>
                <Text className='text-sm text-gray-500'>Didn't receive code?</Text>

                {resendCountdown > 0 ? (
                    <Text className='text-sm text-gray-500'>Resend in {resendCountdown}s</Text>
                ) : (
                    <Button variant='link' className='text-main p-0' disabled={isResending} onPress={handleResendCode}>
                        {isResending ? (
                            <HStack className='space-x-1 items-center'>
                                <Spinner size='small' />
                                <ButtonText className='text-sm'>Resending</ButtonText>
                            </HStack>
                        ) : (
                            <ButtonText className='text-primary-500 text-sm'>Resend now</ButtonText>
                        )}
                    </Button>
                )}
            </View>

            <Button variant='link' onPress={() => route.push('/auth')} className='main-btn p-3'>
                <ButtonText className='text-primary-500'>Change email</ButtonText>
            </Button>
        </View>
    );
};

export default OtpForm;
