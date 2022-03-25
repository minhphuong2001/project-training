import React, { useEffect, useState } from 'react'
import {
    Button,
    Collapse,
    FormControl,
    FormControlLabel,
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
    Checkbox,
    ListItemText
} from '@mui/material'
import InputField from '../../../components/FormField/InputField'
import { SelectField } from '../../../components/FormField/SelectField';
import { Box } from '@mui/system';
import { useForm, Controller } from 'react-hook-form';
import { KeyboardDoubleArrowDownRounded, KeyboardDoubleArrowUpRounded } from '@mui/icons-material';
import { DateRange, DateRangePicker, LocalizationProvider } from '@mui/lab';
import AdapterMomentFns from '@mui/lab/AdapterMoment';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../../redux/reducer';
import { IStateData } from '../../../models/commonData'
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'typesafe-actions';
import { fetchThunk } from '../../common/redux/thunk';
import { API_PATHS } from '../../../configs/api';
import moment from 'moment';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

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
interface IFilter {
    date_range: DateRange<Date>;
    date_type: string;
}

const CustomButton = styled(Button)({
    backgroundColor: '#d2dae2',
})

export default function UserSearch({ userRole, onSearch }: UserSearchProps) {
    const { countries } = useSelector((state: AppState) => state.commonData);
    const [countryCode, setCountryCode] = useState<string>('');
    const [isOpenFilter, setIsOpenFilter] = useState(false);
    const [stateList, setStateList] = useState<IStateData[]>([]);
    const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();

    const [filter, setFilter] = useState<IFilter>({
        date_range: [null, null],
        date_type: 'R'
    });

    const { control, handleSubmit, setValue } = useForm({
        defaultValues: {
            search: '',
            memberships: [],
            types: [],
            status: [],
            country: '',
            state: '',
            address: '',
            phone: '',
            date_type: '',
            date_range: []
        },
    });

    const handleDateTypeChange = (e: any) => {
        setFilter({ ...filter, date_type: e.target.value });
    };
    
    const handleDateRangeChange = (newValue: DateRange<Date | null>) => {
        setFilter({ ...filter, date_range: newValue });
    };

    useEffect(() => {
        const getStateList = async () => {
            const response = await dispatch(fetchThunk(API_PATHS.state, 'post', { code: countryCode }));

            if (response?.success === true) {
                setStateList(response?.data);
            }
        }
        getStateList();
    }, [dispatch, countryCode])

    const stateOptions = stateList && stateList.map(state => {
        return { id: state.state, name: state.state }
    });

    // const formatDate = filter.date_range.length > 1 && filter.date_range.map(item => {
    //     return moment(item).format('YYYY-MM-DD');
    // });

    useEffect(() => {
        setValue('date_type', filter.date_type);
        setValue('date_range', filter.date_range as any);
    }, [setValue, filter])

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
                                                        <Checkbox checked={field.value.indexOf(item.id as never) > -1} />
                                                        <ListItemText primary={item.name} />
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
                                    <Controller
                                        name='country'
                                        control={control}
                                        render={({ field }) => (
                                            <MuiSelect
                                                size='small'
                                                sx={{ width: '100%' }}
                                                value={field.value}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    setCountryCode(e.target.value as string)
                                                }}
                                                MenuProps={MenuProps}
                                            >
                                                <MenuItem value="">None</MenuItem>
                                                {countries.map((item) => (
                                                    <MenuItem key={item.country} value={item.code}>
                                                        {item.country}
                                                    </MenuItem>
                                                ))}
                                            </MuiSelect>
                                        )}
                                    />
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography sx={{ width: '100px' }} variant='body1'>State</Typography>
                                    {stateList && stateList.length > 0 ? (
                                        <SelectField
                                            name='state'
                                            label='State'
                                            control={control}
                                            options={stateOptions}
                                        />
                                    ) : (<InputField
                                            name='state'
                                            label='State'
                                            control={control}
                                    />)
                                    }
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography sx={{ width: '100px' }} variant='body1'>Address</Typography>
                                    <InputField
                                        name='address'
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
                            <Grid item md={4} ml={8}>
                                <Box pb={2} sx={{ display: 'flex' }}>
                                    <Typography sx={{ mt: 2, mr: 4 }} variant='body1'>User activity</Typography>
                                    <RadioGroup sx={{ mt: 1 }} row name="user-activity" value={filter.date_type} onChange={handleDateTypeChange}>
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
                                </Box>
                                <LocalizationProvider dateAdapter={AdapterMomentFns}>
                                    <DateRangePicker
                                        disableFuture
                                        value={filter.date_range}
                                        onChange={handleDateRangeChange}
                                        inputFormat='YYYY-MM-DD'
                                        mask="____-__-__"
                                        renderInput={(startProps, endProps) => (
                                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                <TextField autoComplete="off" size="small" fullWidth {...startProps} />
                                                <Typography mx={2}> to </Typography>
                                                <TextField autoComplete="off" size="small" fullWidth {...endProps} />
                                            </Box>
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