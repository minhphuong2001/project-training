import React from 'react'
import { Button, Grid } from '@mui/material'
import InputField from '../../../components/FormField/InputField'
import { SelectField } from '../../../components/FormField/SelectField';
import { Box } from '@mui/system';
import { useForm } from 'react-hook-form';

const categoryOption = [
    {
        id: 'Mobile',
        name: 'Mobile'
    },
    {
        id: 'Laptop',
        name: 'Laptop'
    },
]

const statusOption = [
    {
        id: 'Pending',
        name: 'Pending'
    },
    {
        id: 'Received',
        name: 'Received'
    },
]

export default function UserSearch() {
    const { control, handleSubmit } = useForm({
        defaultValues: {
            search: '',
            category: '',
            userType: '',
            status: ''
        },
    });
    const handleSearch = () => {
        console.log('ok');
        
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
                            name='member'
                            label='All member'
                            control={control}
                            options={categoryOption}
                        />
                    </Grid>
                    <Grid item md={3}>
                        <SelectField
                            name='userType'
                            label='User type'
                            control={control}
                            options={categoryOption}
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