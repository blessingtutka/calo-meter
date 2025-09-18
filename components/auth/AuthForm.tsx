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
import { AlertCircle, LogIn, Send, UserPlus } from 'lucide-react-native';
import { Controller, useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import { authSchema, type AuthFormData } from '../../utils/validators';
import GoogleAuth from './GoogleAuth';

export function AuthForm({ onSubmit, isLoading }: { onSubmit: (data: AuthFormData) => void; isLoading: boolean }) {
    const form = useForm<AuthFormData>({
        resolver: zodResolver(authSchema),
        defaultValues: {
            email: '',
        },
    });

    return (
        <View className='gap-4'>
            {/* Email Field */}
            <Controller
                control={form.control}
                name='email'
                render={({ field, fieldState }) => (
                    <FormControl isInvalid={!!fieldState.error}>
                        <FormControlLabel>
                            <FormControlLabelText className='text-sm font-medium text-gray-200'>Email</FormControlLabelText>
                        </FormControlLabel>
                        <Input className='border border-gray-700 bg-[#121212] focus:border-white focus:border-2 rounded-md'>
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
                                className='flex-1 py-2 px-3 !text-white placeholder:!text-ph'
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

            <Button onPress={form.handleSubmit(onSubmit)} disabled={isLoading} className='main-btn flex-row items-center justify-center gap-2'>
                {isLoading ? (
                    <>
                        <ActivityIndicator className='text-white' />
                        <Text className='text-white font-medium'>Signing in...</Text>
                    </>
                ) : (
                    <>
                        <LogIn size={18} color={'white'} />
                        <Text className='text-white font-medium'>Sign In / </Text>
                        <UserPlus size={18} color={'white'} />
                        <Text className='text-white font-medium'>Sign Up</Text>
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
            <GoogleAuth />
        </View>
    );
}
