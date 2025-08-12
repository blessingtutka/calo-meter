// HealthStepForm.tsx
import { ActivityIndicator } from '@/components/ui/activity-indicator';
import { Button } from '@/components/ui/button';
import { FormControl, FormControlError, FormControlErrorText, FormControlLabel, FormControlLabelText } from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import { stepFields } from '../../utils/fields';
import { healthSchemas, type HealthFormData } from '../../utils/validators';
import { CSelectInput } from '../global/SelectInput';

interface HealthStepFormProps {
    onSave: (step: number, data: Partial<HealthFormData>) => Promise<void>;
}

export function HealthStepForm({ onSave }: HealthStepFormProps) {
    const [step, setStep] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);

    const form = useForm<Partial<HealthFormData>>({
        resolver: zodResolver(healthSchemas[step - 1]),
        defaultValues: {},
    });

    const onSubmit = async (data: Partial<HealthFormData>) => {
        setLoading(true);
        await onSave(step, data);
        setLoading(false);
        if (step < stepFields.length) setStep((prev) => prev + 1);
    };

    return (
        <View className='gap-4'>
            <Text className='text-lg font-bold text-white'>{stepFields[step - 1].title}</Text>

            {stepFields[step - 1].fields.map((field) => (
                <Controller
                    key={field.name}
                    control={form.control}
                    name={field.name as keyof HealthFormData}
                    render={({ field: f, fieldState }) => (
                        <FormControl isInvalid={!!fieldState.error}>
                            <FormControlLabel>
                                <FormControlLabelText className='text-sm font-medium text-gray-200'>{field.label}</FormControlLabelText>
                            </FormControlLabel>
                            {field.type === 'select' ? (
                                <CSelectInput
                                    placeholder={field.placeholder}
                                    value={String(f.value ?? '')}
                                    options={field.items ?? []}
                                    className='flex-1 py-2 px-3 text-white'
                                />
                            ) : (
                                <Input className='main-input'>
                                    <InputField
                                        placeholder={field.placeholder}
                                        value={String(f.value ?? '')}
                                        onChangeText={(val) => {
                                            f.onChange(field.type === 'number' ? Number(val) : val);
                                        }}
                                        keyboardType={field.type === 'number' ? 'numeric' : 'default'}
                                        className='flex-1 py-2 px-3 text-white'
                                    />
                                </Input>
                            )}
                            {fieldState.error && (
                                <FormControlError>
                                    <FormControlErrorText className='text-red-400'>{fieldState.error.message}</FormControlErrorText>
                                </FormControlError>
                            )}
                        </FormControl>
                    )}
                />
            ))}

            <View className='flex-row justify-between'>
                {step > 1 && (
                    <Button onPress={() => setStep((prev) => prev - 1)} className='main-rbtn'>
                        Back
                    </Button>
                )}
                <Button onPress={form.handleSubmit(onSubmit)} disabled={loading} className='main-btn'>
                    {loading ? <ActivityIndicator /> : step === stepFields.length ? 'Finish' : 'Next'}
                </Button>
            </View>
        </View>
    );
}
