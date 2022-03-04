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
    other?: SelectOptions;
}

export function SelectField({ name, control, label, disabled, options, style, other }: SelectFieldProps) {
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
            <InputLabel id="demo-simple-select-label">{label}</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label={label}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                sx={style}
            >
                <MenuItem value={other?.id}>{other?.name}</MenuItem>
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