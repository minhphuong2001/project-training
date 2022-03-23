import React, { useState } from 'react'
import {
    Button,
    Collapse,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Radio,
    RadioGroup,
    Select as MuiSelect,
    styled,
    TextField,
    Typography,
} from '@mui/material'
import InputField from '../../../components/FormField/InputField'
import { SelectField } from '../../../components/FormField/SelectField';
import { Box } from '@mui/system';
import { useForm, Controller } from 'react-hook-form';
import { KeyboardDoubleArrowDownRounded, KeyboardDoubleArrowUpRounded } from '@mui/icons-material';
import { DateRange, DateRangePicker, LocalizationProvider } from '@mui/lab';
import AdapterMomentFns from '@mui/lab/AdapterMoment';
import { IUserFilter } from '../../../models/user';

const membershipsOptions = [
    { id: 'M_4', name: 'General(Memberships)' },
    { id: 'P_4', name: 'General(Pending Memberships)' },
]

const statusOption = [
    { id: '', name: 'Any Status' },
    { id: 'E', name: 'Enable' },
    { id: 'D', name: 'Disable' },
    { id: 'U', name: 'Unapproved vendor' },   
]
export interface IUserRole {
    id: string | number;
    enable: string | number;
    name: string;
}
export interface UserSearchProps {
    userRole: any;
    onSearch: (data: any) => void;
}

const initialValues = {
    search: '',
    memberships: [],
    types: [],
    status: [],
    country: '',
    state: '',
    address: '',
    phone: ''
}

const CustomButton = styled(Button)({
    backgroundColor: '#d2dae2',
})

export default function UserSearch({ userRole, onSearch }: UserSearchProps) {
    const [isOpenFilter, setIsOpenFilter] = useState(false);
    const [filter, setFilter] = useState<IUserFilter>({
        search: '',
        memberships: [],
        types: [],
        status: '',
        country: '',
        state: '',
        address: '',
        phone: '',
        date_range: [null, null],
        date_type: 'R',
        sort: '',
        order_by: 'DESC',
        tz: 7,
    });
    const { control, handleSubmit } = useForm({
        defaultValues: initialValues,
    });

    const handleDateTypeChange = (e: any) => {
        setFilter({ ...filter, date_type: e.target.value });
    };
    
    const handleDateRangeChange = (newValue: DateRange<Date | null>) => {
        setFilter({ ...filter, date_range: newValue });
    };

    const handleSearch = (data: any) => {
        onSearch(data);
    }

    return (
        <Box sx={{
            backgroundColor: '#dfe4ea',
            padding: '5px 10px'
        }}>
            <form onSubmit={handleSubmit(handleSearch)}>
                <Box>
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
                            {/* <SelectField
                                name='memberships'
                                label='All memberships'
                                control={control}
                                options={membershipsOptions}
                            /> */}
                            <Controller
                                name='memberships'
                                control={control}
                                render={({ field }) => {
                                    return (
                                        <FormControl size='small' fullWidth sx={{ marginTop: '16px' }}>
                                            <InputLabel>All memberships</InputLabel>
                                            <MuiSelect
                                                label='All memberships'
                                                value={field.value}
                                                multiple
                                                onChange={(e) => field.onChange(e)}
                                                input={<OutlinedInput label="All memberships" />}
                                                renderValue={(selected: any) => selected.join(', ')}
                                            >
                                                {membershipsOptions.map((item) => (
                                                    <MenuItem key={item.id} value={item.id}>
                                                        {item.name}
                                                    </MenuItem>
                                                ))}
                                            </MuiSelect>
                                        </FormControl>
                                    )
                                }}
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
                        <Grid container spacing={2}>
                            <Grid item md={4} sx={{ display: 'flex', flexDirection: 'column', ml: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography  sx={{ width: '100px' }} variant='body1'>Country</Typography>
                                    <SelectField
                                        name='country'
                                        label='Country'
                                        control={control}
                                        options={statusOption}
                                    />
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography  sx={{ width: '100px' }} variant='body1'>State</Typography>
                                    <SelectField
                                        name='state'
                                        label='State'
                                        control={control}
                                        options={statusOption}
                                    />
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography sx={{ width: '100px' }} variant='body1'>Address</Typography>
                                    <InputField
                                        name='sddress'
                                        label='Address'
                                        control={control}
                                    />
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography sx={{ width: '100px' }} variant='body1'>Phone</Typography>
                                    <InputField
                                        name='phone'
                                        label='Phone'
                                        control={control}
                                    />
                                </Box>
                            </Grid>
                            <Grid item md={4} ml={6}>
                                <FormControl size="small" fullWidth sx={{ paddingBottom: 1 }}>
                                    <Typography sx={{ mt: 2 }} variant='body1'>User activity</Typography>
                                    <RadioGroup row name="user-activity" value={filter.date_type} onChange={handleDateTypeChange}>
                                        <FormControlLabel
                                            value="R"
                                            control={ <Radio size='small'/>}
                                            label="Register"
                                        />
                                        <FormControlLabel
                                            value="L"
                                            control={<Radio size='small' />}
                                            label="Last logged in"
                                        />
                                    </RadioGroup>
                                </FormControl>
                                <LocalizationProvider dateAdapter={AdapterMomentFns}>
                                    <DateRangePicker
                                        disableFuture
                                        value={filter.date_range}
                                        onChange={handleDateRangeChange}
                                        mask="____-__-__"
                                        inputFormat="yyyy-MM-dd"
                                        renderInput={(startProps, endProps) => (
                                            <>
                                                <Box width={1} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                    <TextField autoComplete="off" size="small" fullWidth {...startProps} />
                                                    <Box sx={{ mx: 2, color: '#fff' }}> to </Box>
                                                    <TextField autoComplete="off" size="small" fullWidth {...endProps} />
                                                    <Button
                                                        sx={{ marginLeft: 2 }}
                                                        variant="contained"
                                                        color="secondary"
                                                        onClick={(e) => setFilter({ ...filter, date_range: [null, null] })}
                                                    >
                                                        Clear
                                                    </Button>
                                                </Box>
                                            </>
                                        )}
                                    />
                                </LocalizationProvider>
                            </Grid>
                        </Grid>
                    </Collapse>
                </Box>
            </form>
        </Box>
    )
}