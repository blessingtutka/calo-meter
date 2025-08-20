import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { View } from 'react-native';

type CSelectInputProps = {
    placeholder?: string;
    value?: string;
    onChange?: (val: string) => void;
    options: { label: string; value: string; disabled?: boolean }[];
    className?: string;
};

export function CSelectInput({ placeholder, value, onChange, options, className }: CSelectInputProps) {
    return (
        <View className={` ${className || ''}`}>
            <Picker
                selectedValue={value}
                dropdownIconColor='#fff'
                onValueChange={(val) => {
                    if (onChange) onChange(val);
                }}
                className='main-input'
            >
                {placeholder && <Picker.Item label={placeholder} value='' enabled={false} color='#888' />}
                {options.map((opt) => (
                    <Picker.Item key={opt.value} label={opt.label} value={opt.value} enabled={!opt.disabled} />
                ))}
            </Picker>
        </View>
    );
}
