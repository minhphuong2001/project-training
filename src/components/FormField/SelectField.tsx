import React, { InputHTMLAttributes } from 'react'
import { Control, useController } from 'react-hook-form';
import { FormControl, InputLabel, MenuItem, Select, FormHelperText } from '@mui/material'

export interface SelectOptions {
    name: string;
    id: number | string;
}

interface SelectFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    name: string;
    control: Control<any>;
    label?: string;
    disabled?: boolean;
    options: SelectOptions[];
    style?: any;
}

export function SelectField({ name, control, label, disabled, options, style }: SelectFieldProps) {
    const {
        field: { value, onChange, onBlur },
        fieldState: { invalid, error },
    } = useController({ name, control });

    return (
        <FormControl
            margin='normal'
            variant="outlined"
            size="small"
            fullWidth
            disabled={disabled}
            error={invalid}
        >
            <InputLabel id="filterByCity">{label}</InputLabel>
            <Select
                labelId="filterByCity"
                label={label}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                sx={style}
            >
                {
                    options.map(option => {
                        return (
                            <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
                        )
                    })
                }
            </Select>
            {error && <FormHelperText>{error?.message}</FormHelperText>}
        </FormControl>
    )
}