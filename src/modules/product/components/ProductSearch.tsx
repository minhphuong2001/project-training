import React, { useState, useEffect } from 'react'
import { Button, Checkbox, Collapse, FormControlLabel, Grid, styled, Typography } from '@mui/material'
import InputField from '../../../components/FormField/InputField'
import { SelectField } from '../../../components/FormField/SelectField';
import { Box } from '@mui/system';
import { useForm, Controller } from 'react-hook-form';
import { useSelector } from 'react-redux'
import { AppState } from '../../../redux/reducer'
import Select from 'react-select'
import { KeyboardDoubleArrowDownRounded, KeyboardDoubleArrowUpRounded } from '@mui/icons-material';

const statusOption = [
    { id: 'all', name: 'Any stock status' },
    { id: 'in', name: 'In stock' },
    { id: 'low', name: 'Low stock' },
    { id: 'out', name: 'SOLD' },
]

const availabilityOptions = [
    { id: 'all', name: 'Any availability status' },
    { id: 1, name: 'Only enabled' },
    { id: 0, name: 'Only disabled' }
]

const CustomButton = styled(Button)({
    backgroundColor: '#d2dae2',
})

export interface ProductSearchProps {
    onSearch: (data: any) => void;
}

export default function ProductSearch({ onSearch }: ProductSearchProps) {
    const [searchType, setSearchType] = useState({ search_type: ''});
    const { categories } = useSelector((state: AppState) => state.category);
    const { vendors } = useSelector((state: AppState) => state.vendor);
    const [isOpenFilter, setIsOpenFilter] = useState(false);

    const { control, handleSubmit, setValue } = useForm({
        defaultValues: {
            search: '',
            category: '',
            stock_status: '',
            availability: '',
            vendor: '',
            search_type: ''
        },
    });

    const colourStyles = {
        control: (styles: any) => ({
            ...styles,
            marginTop: '6px',
            backgroundColor: '#d2dae2',
            color: '#000',
            width: '300px',
            border: '1px solid #999999'
        }),
    };
    
    const vendorOptions: any = vendors.slice(0, 200).map(function (vendor) {
        return { value: vendor.id, label: vendor.name };
    });

    const handleSearchTypeChange = (isTypeIn: boolean, type: 'name' | 'sku' | 'description') => {
        setSearchType((prev) => {
          const prevSearchType = prev.search_type.split(',');
          const newSearchType = isTypeIn
            ? [...prevSearchType, type].filter((item) => item !== '')
            : [...prevSearchType].filter((item) => item !== '' && item !== type && true);
          return { ...prev, search_type: newSearchType.join(',') };
        });
      };
      const isSearchType = (type: 'name' | 'sku' | 'description') => {
        return searchType.search_type.split(',').indexOf(type) > -1;
    };
    
    const handleSearch = (data: any) => {
        onSearch(data);
    }

    useEffect(() => {
        setValue('search_type', searchType as any);
    }, [setValue, searchType]);

    return (
        <Box sx={{
            backgroundColor: '#d2dae2',
            padding: '5px 10px'
        }}>
            <form onSubmit={handleSubmit(handleSearch)}>
                <Box>
                    <Grid container spacing={2}>
                        <Grid item md={5}>
                            <InputField
                                name='search'
                                label='Search'
                                placeholder='Search keywords'
                                control={control}
                            />
                        </Grid>
                        <Grid item md={3}>
                            <SelectField
                                name='category'
                                label='Category'
                                control={control}
                                options={categories}
                                other={{ id: '0', name: 'Any category' }}
                            />
                        </Grid>
                        <Grid item md={3}>
                            <SelectField
                                name='stock_status'
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
                </Box>
                {isOpenFilter ? <hr style={{ margin: '8px 0' }} /> : null}
                <Box width={1} flexGrow={1} sx={{ position: 'relative' }}>
                    <CustomButton
                        color="inherit"
                        size="small"
                        variant="contained"
                        sx={{
                            position: 'absolute',
                            bottom: '0',
                            left: '50%',
                            transform: 'translate(-50%, 100%)',
                            p: 0,
                            borderTopRightRadius: 'none',
                            borderTopLeftRadius: 'none',
                            zIndex: 0,
                            margin: '-5px',
                            '&:hover': {
                                boxShadow: 'none',
                                backgroundColor: 'none'
                            }
                        }}
                        onClick={() => setIsOpenFilter(!isOpenFilter)}
                    >
                        {isOpenFilter ? <KeyboardDoubleArrowUpRounded /> : <KeyboardDoubleArrowDownRounded />}
                    </CustomButton>
                    <Collapse in={isOpenFilter}>
                        <Box>
                            <Grid container spacing={1}>
                                <Grid item md={3}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start'}}> 
                                        <Typography mt={1} variant='body1'>Search in: </Typography>
                                        <Box ml={2} sx={{ display: 'flex', flexDirection: 'column' }}>
                                            <FormControlLabel
                                                label="Name"
                                                control={
                                                    <Checkbox
                                                        size='small'
                                                        checked={isSearchType('name')}
                                                        onChange={(e) => handleSearchTypeChange(e.target.checked, 'name')}
                                                    />
                                                }
                                            />
                                            <FormControlLabel
                                                label="Sku"
                                                control={
                                                    <Checkbox
                                                        size='small'
                                                        checked={isSearchType('sku')}
                                                        onChange={(e) => handleSearchTypeChange(e.target.checked, 'sku')}
                                                    />
                                                }
                                            />
                                            <FormControlLabel
                                                label="Full Description"
                                                control={
                                                    <Checkbox
                                                        size='small'
                                                        checked={isSearchType('description')}
                                                        onChange={(e) => handleSearchTypeChange(e.target.checked, 'description')}
                                                    />
                                                }
                                            />
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item md={3}>
                                    <Box sx={{  display: 'flex', alignItems: 'center' }}>
                                        <Typography mr={2} variant='body1'>Availability</Typography>
                                        <SelectField
                                            name='availability'
                                            label='Availability'
                                            control={control}
                                            options={availabilityOptions}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item md={4}>
                                    <Box ml={2} sx={{  display: 'flex', alignItems: 'center', marginTop: '12px' }}>
                                        <Typography mr={2} variant='body1'>Vendor</Typography>
                                        <Controller
                                            name='vendor'
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    styles={colourStyles}
                                            
                                                    className="search-vendor"
                                                    classNamePrefix='select'
                                                    value={field.value}
                                                    onChange={(e) => {
                                                        field.onChange(e)
                                                    }}
                                                    options={vendorOptions}
                                                />
                                            )}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Collapse>
                </Box>
            </form>
        </Box>
    )
}