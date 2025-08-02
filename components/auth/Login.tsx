/* eslint-disable react-native/no-raw-text */
import { ActivityIndicator } from '@/components/ui/activity-indicator';
import { Button } from '@/components/ui/button';
import { Divider } from '@/components/ui/divider';
import {
    FormControl,
    FormControlError,
    FormControlErrorIcon,
    FormControlErrorText,
    FormControlLabel,
    FormControlLabelText,
} from '@/components/ui/form-control';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { AlertCircle, LogIn, Send } from 'lucide-react-native';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';
import { loginSchema, type LoginFormData } from '../../utils/validators';
import { Google, PasswordInput } from '../global';

export function LoginForm({
    onSubmit,
    isLoading,
    onGoogleSignIn,
}: {
    onSubmit: (data: LoginFormData) => void;
    isLoading: boolean;
    onGoogleSignIn: () => void;
}) {
    const router = useRouter();

    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
            remember: false,
        },
    });

    return (
        <View className='space-y-4'>
            {/* Email Field */}
            <Controller
                control={form.control}
                name='email'
                render={({ field, fieldState }) => (
                    <FormControl isInvalid={!!fieldState.error}>
                        <FormControlLabel>
                            <FormControlLabelText className='text-sm font-medium text-gray-200'>Email</FormControlLabelText>
                        </FormControlLabel>
                        <Input className='border border-gray-700 bg-[#121212] rounded-md'>
                            <InputSlot className='pl-3'>
                                <InputIcon as={Send} className='text-gray-400' />
                            </InputSlot>
                            <InputField
                                placeholder='email@example.com'
                                value={field.value}
                                onChangeText={field.onChange}
                                onBlur={field.onBlur}
                                autoCapitalize='none'
                                keyboardType='email-address'
                                className='flex-1 py-2 px-3 text-white placeholder:text-ph'
                            />
                        </Input>
                        {fieldState.error && (
                            <FormControlError>
                                <FormControlErrorIcon as={AlertCircle} size='sm' />
                                <FormControlErrorText className='text-red-400'>{fieldState.error.message}</FormControlErrorText>
                            </FormControlError>
                        )}
                    </FormControl>
                )}
            />

            {/* Password Field */}
            <Controller
                control={form.control}
                name='password'
                render={({ field, fieldState }) => (
                    <FormControl isInvalid={!!fieldState.error}>
                        <FormControlLabel className='flex-row items-center justify-between'>
                            <FormControlLabelText className='text-sm font-medium text-gray-200'>Password</FormControlLabelText>
                            <Pressable onPress={() => router.push('/pswr')}>
                                <Text className='text-xs font-medium text-[#FDB327] hover:underline'>Forgot Password?</Text>
                            </Pressable>
                        </FormControlLabel>
                        <PasswordInput value={field.value} onChangeText={field.onChange} onBlur={field.onBlur} />
                        {fieldState.error && (
                            <FormControlError>
                                <FormControlErrorIcon as={AlertCircle} size='sm' />
                                <FormControlErrorText className='text-red-400'>{fieldState.error.message}</FormControlErrorText>
                            </FormControlError>
                        )}
                    </FormControl>
                )}
            />

            <Button onPress={form.handleSubmit(onSubmit)} disabled={isLoading} className='main-btn flex-row items-center justify-center gap-2'>
                {isLoading ? (
                    <>
                        <ActivityIndicator className='text-white' />
                        <Text className='text-white font-medium'>Signing in...</Text>
                    </>
                ) : (
                    <>
                        <LogIn size={18} className='text-white' />
                        <Text className='text-white font-medium'>Sign In</Text>
                    </>
                )}
            </Button>

            <View className='relative'>
                <View className='absolute inset-0 flex items-center'>
                    <Divider className='w-full' />
                </View>
                <View className='relative w-full flex items-center'>
                    <Text className='px-2 w-fit bg-black text-center text-sm text-gray-400'>OR CONTINUE WITH</Text>
                </View>
            </View>

            <Google onSuccess={onGoogleSignIn} disabled={isLoading} />
        </View>
    );
}
