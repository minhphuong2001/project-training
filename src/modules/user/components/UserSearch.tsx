import React, { useState } from 'react'
import { Button, FormControl, Grid, InputLabel, MenuItem, OutlinedInput, Select as MuiSelect } from '@mui/material'
import InputField from '../../../components/FormField/InputField'
import { SelectField } from '../../../components/FormField/SelectField';
import { Box } from '@mui/system';
import { useForm, Controller } from 'react-hook-form';

const membershipsOptions = [
    {
        id: 'M_4',
        name: 'General(Memberships)'
    },
    {
        id: 'P_4',
        name: 'General(Pending Memberships)'
    },
]

const statusOption = [
    {
        id: '',
        name: 'Any Status'
    },
    {
        id: 'E',
        name: 'Enable'
    },
    {
        id: 'D',
        name: 'Disable'
    },
    {
        id: 'U',
        name: 'Unapproved vendor'
    },   
]
export interface IUserRole {
    id: string | number;
    enable: string | number;
    name: string;
}
export interface UserSearchProps {
    userRole: any;
}

export default function UserSearch({ userRole }: UserSearchProps) {
    const { control, handleSubmit } = useForm({
        defaultValues: {
            search: '',
            memberships: [],
            types: '',
            status: []
        },
    });

    const handleSearch = (data: any) => {
        console.log(data);
    }

    return (
        <Box sx={{
            backgroundColor: '#dfe4ea',
            padding: '5px 10px'
        }}>
            <form onSubmit={handleSubmit(handleSearch)}>
                <Grid container spacing={2}>
                    <Grid item md={3}>
                        <InputField
                            name='search'
                            label='Search'
                            placeholder='Search keywords'
                            control={control}
                        />
                    </Grid>
                    <Grid item md={3}>
                        <SelectField
                            name='memberships'
                            label='All memberships'
                            control={control}
                            options={membershipsOptions}
                        />
                    </Grid>
                    <Grid item md={3}>
                        <Controller
                            name='types'
                            control={control}
                            render={({ field }) => (
                                <FormControl size='small' fullWidth sx={{ marginTop: '16px' }}>
                                    <InputLabel htmlFor="grouped-native-select">User type</InputLabel>
                                    <MuiSelect
                                        native
                                        id="grouped-native-select"
                                        label='User type'
                                        value={field.value}
                                        onChange={(e) => field.onChange(e)}
                                    >
                                        <option value=""></option>
                                        <optgroup label="Memberships">
                                            {userRole.administrator ? userRole.administrator.map((item: any) => (
                                                    <option key={item?.id} value={item?.id}>{item?.name}</option>
                                            )) : ''}
                                        </optgroup>
                                        <optgroup label="Pending memberships">
                                            {userRole.customer ? userRole.customer.map((item: any) => (
                                                    <option key={item?.id} value={item?.id}>{item?.name}</option>
                                                )) : ''}
                                        </optgroup>
                                    </MuiSelect>
                                </FormControl>
                            )}
                        />
                    </Grid>
                    <Grid item md={2}>
                        <SelectField
                            name='status'
                            label='Status'
                            control={control}
                            options={statusOption}
                        />
                    </Grid>
                    <Grid item md={1}>
                        <Button
                            type='submit'
                            variant='contained'
                            color='secondary'
                            sx={{ marginTop: 2 }}
                        >
                            search
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    )
}