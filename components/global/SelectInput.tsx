import { ChevronDownIcon } from '@/components/ui/icon';
import {
    Select,
    SelectBackdrop,
    SelectContent,
    SelectDragIndicator,
    SelectDragIndicatorWrapper,
    SelectIcon,
    SelectInput,
    SelectItem,
    SelectPortal,
    SelectTrigger,
} from '@/components/ui/select';

type CSelectInputProps = {
    placeholder?: string;
    value?: string;
    onChange?: (val: string) => void;
    options: { label: string; value: string; disabled?: boolean }[];
    className?: string;
};

export function CSelectInput({ placeholder, value, onChange, options, className }: CSelectInputProps) {
    return (
        <Select selectedValue={value} onValueChange={onChange}>
            <SelectTrigger variant='outline' size='md' className={className}>
                <SelectInput placeholder={placeholder} />
                <SelectIcon className='mr-3' as={ChevronDownIcon} />
            </SelectTrigger>
            <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                    <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    {options.map((opt) => (
                        <SelectItem key={opt.value} label={opt.label} value={opt.value} isDisabled={opt.disabled} />
                    ))}
                </SelectContent>
            </SelectPortal>
        </Select>
    );
}
