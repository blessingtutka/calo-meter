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
import { CheckBox, CSelectInput, DateInput, MultiSelectInput } from '../global';

interface HealthStepFormProps {
    onSave: (step: number, data: Partial<HealthFormData>) => Promise<void>;
    initialData?: Partial<HealthFormData>;
}

export function HealthStepForm({ onSave, initialData }: HealthStepFormProps) {
    const [step, setStep] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);

    const form = useForm<Partial<HealthFormData>>({
        resolver: zodResolver(healthSchemas[step - 1]),
        defaultValues: { ...initialData },
    });

    const onSubmit = async (data: Partial<HealthFormData>) => {
        setLoading(true);
        await onSave(step, data);
        setLoading(false);
        if (step < stepFields.length) setStep((prev) => prev + 1);
    };

    const handleNext = async () => {
        const isValid = await form.trigger();
        if (!isValid) return;

        if (step < stepFields.length) {
            setStep((prev) => prev + 1);
            form.reset(); // Reset form for next step
        }
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
                                    onChange={(val) => {
                                        f.onChange(val || '');
                                    }}
                                    options={field.items ?? []}
                                    className='flex-1 text-white'
                                />
                            ) : field.type === 'multi-select' ? (
                                <MultiSelectInput
                                    placeholder={field.placeholder}
                                    value={Array.isArray(f.value) ? f.value : []}
                                    onChange={(val) => f.onChange(val)}
                                    options={field.items ?? []}
                                />
                            ) : field.type === 'date' ? (
                                <DateInput
                                    placeholder={field.placeholder}
                                    value={f.value ? new Date(f.value as string) : undefined}
                                    onChange={(val) => f.onChange(val.toISOString())}
                                    className='flex-1'
                                />
                            ) : field.type === 'checkbox' ? (
                                <CheckBox placeholder={field.placeholder} value={!!f.value} onChange={(val) => f.onChange(val)} className='flex-1' />
                            ) : (
                                <Input className='text-white border-none outline-none'>
                                    <InputField
                                        placeholder={field.placeholder}
                                        value={String(f.value ?? '')}
                                        onChangeText={(val) => {
                                            f.onChange(field.type === 'number' ? Number(val) : val);
                                        }}
                                        keyboardType={field.type === 'number' ? 'numeric' : 'default'}
                                        className='main-input'
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
                        <Text className='text-main'>Back</Text>
                    </Button>
                )}
                {/* <Button onPress={form.handleSubmit(onSubmit)} disabled={loading} className='main-btn'>
                    {loading ? <ActivityIndicator /> : step === stepFields.length ? 'Finish' : 'Next'}
                </Button> */}
                <View className='flex-row gap-2'>
                    <Button onPress={form.handleSubmit(onSubmit)} disabled={loading} className='main-rbtn'>
                        {loading ? <ActivityIndicator /> : <Text className='text-main'>Save</Text>}
                    </Button>
                    <Button onPress={handleNext} disabled={loading} className='main-btn'>
                        {loading ? (
                            <ActivityIndicator />
                        ) : step === stepFields.length ? (
                            <Text className='text-white'>Finish</Text>
                        ) : (
                            <Text className='text-white'>Next</Text>
                        )}
                    </Button>
                </View>
            </View>
        </View>
    );
}
