import { Button } from '@/components/ui/button';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { Eye, EyeOff, LockKeyhole } from 'lucide-react-native';
import { useState } from 'react';

export function PasswordInput({ ...props }: React.ComponentProps<typeof InputField>) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <Input className='relative border border-gray-700 bg-[#121212] rounded-md'>
            <InputSlot className='pl-3'>
                <InputIcon as={LockKeyhole} className='text-gray-400' />
            </InputSlot>
            <InputField
                type={showPassword ? 'text' : 'password'}
                placeholder='••••••••'
                className='pr-10 text-white placeholder:text-ph'
                {...props}
            />
            <InputSlot className='absolute right-2 top-1/2 -translate-y-1/2'>
                <Button size='sm' variant='link' className='p-1' onPress={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className='h-4 w-4 text-gray-400' /> : <Eye className='h-4 w-4 text-gray-400' />}
                </Button>
            </InputSlot>
        </Input>
    );
}
