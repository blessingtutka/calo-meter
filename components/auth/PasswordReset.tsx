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
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, RefreshCcwDot } from 'lucide-react-native';
import { Controller, useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import { resetPasswordSchema, type resetPasswordValues } from '../../utils/validators';
import { PasswordInput } from '../global';

export function PasswordReset({ onSubmit, isLoading }: { onSubmit: (data: resetPasswordValues) => void; isLoading: boolean }) {
    const form = useForm<resetPasswordValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            newPassword: '',
            confirmPassword: '',
        },
    });

    return (
        <View className='space-y-4'>
            {/* Password Field */}
            <Controller
                control={form.control}
                name='newPassword'
                render={({ field, fieldState }) => (
                    <FormControl isInvalid={!!fieldState.error}>
                        <FormControlLabel>
                            <FormControlLabelText className='text-sm font-medium text-gray-200'>Password</FormControlLabelText>
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

            {/* Password Confirm Field */}
            <Controller
                control={form.control}
                name='confirmPassword'
                render={({ field, fieldState }) => (
                    <FormControl isInvalid={!!fieldState.error}>
                        <FormControlLabel>
                            <FormControlLabelText className='text-sm font-medium text-gray-200'>Password</FormControlLabelText>
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
                        <Text className='text-white font-medium'>Reseting...</Text>
                    </>
                ) : (
                    <>
                        <RefreshCcwDot size={18} className='text-white' />
                        <Text className='text-white font-medium'>Reset Password</Text>
                    </>
                )}
            </Button>
        </View>
    );
}
