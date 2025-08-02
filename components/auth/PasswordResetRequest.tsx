/* eslint-disable react-native/no-raw-text */
import { ActivityIndicator } from '@/components/ui/activity-indicator';
import { Button } from '@/components/ui/button';
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
import { AlertCircle, RefreshCcwDot, Send } from 'lucide-react-native';
import { Controller, useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import { restPassowordRequestSchema, type resetPasswordRequestValue } from '../../utils/validators';

export function PasswordResetRequest({ onSubmit, isLoading }: { onSubmit: (data: resetPasswordRequestValue) => void; isLoading: boolean }) {
    const form = useForm<resetPasswordRequestValue>({
        resolver: zodResolver(restPassowordRequestSchema),
        defaultValues: {
            email: '',
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
                                placeholderTextColor='#757575 '
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

            <Button onPress={form.handleSubmit(onSubmit)} disabled={isLoading} className='main-btn flex-row items-center justify-center gap-2'>
                {isLoading ? (
                    <>
                        <ActivityIndicator className='text-white' />
                        <Text className='text-white font-medium'>Requesting...</Text>
                    </>
                ) : (
                    <>
                        <RefreshCcwDot size={18} className='text-white' />
                        <Text className='text-white font-medium'>Request Password Reset</Text>
                    </>
                )}
            </Button>
        </View>
    );
}
