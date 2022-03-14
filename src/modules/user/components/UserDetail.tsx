import React, { useEffect } from 'react'
import {
    Typography,
    TextareaAutosize,
    Checkbox,
    Button,
    FormControl,
    MenuItem,
    Select as MuiSelect
} from '@mui/material';
import { IUserProfileDetail } from '../../../models/user'
import { Box } from '@mui/system';
import { numberFormat } from '../../../utils/common';
import moment from 'moment';
import InputField from '../../../components/FormField/InputField';
import { useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { SelectField } from '../../../components/FormField/SelectField';

export interface UserDetailProps{
    profileDetail: IUserProfileDetail;
    onUpdate: (data: any) => void;
}

export default function UserDetail({ profileDetail, onUpdate }: UserDetailProps) {
    const initialValues = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        account_status: '',
        status_comment: '',
        membership_id: '',
        forceChangePassword: false,
        taxExempt: false
    }

    const validationSchema = Yup.object().shape({
        firstName: Yup.string()
          .required('First name is required.'),
        lastName: Yup.string()
          .required('Last name is required.'),
        email: Yup.string()
            .required('Email is required.')
            .matches(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Email is invalid."),
        password: Yup.string()
            .required('Password is required.')
            .min(6, 'Mininum of 6 characters.'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Password does not match.') 
    });
    
    const { control, handleSubmit, setValue } = useForm({
        defaultValues: initialValues,
        resolver: yupResolver(validationSchema),
        mode: 'all'
    });

    useEffect(() => {
        setValue('firstName', profileDetail?.info.firstName);
        setValue('lastName', profileDetail?.info.lastName);
        setValue('email', profileDetail?.info.email);
        setValue('status_comment', profileDetail?.info.statusComment);
        setValue('membership_id', 'Ignore Membership')
    }, [profileDetail, setValue])

    const onSubmit = (data: any) => {
        onUpdate(data);
    }

    return (
        <div>
            {/* general information */}
            <Box>
                <Typography my={1} variant='h5' sx={{ color: '#fff' }} >
                    {profileDetail?.info.email}
                </Typography>
                <Typography
                    sx={{
                        position: 'relative',
                        display: 'inline-block',
                        textAlign: 'center',
                        color: '#b18aff',
                        marginLeft: '10px',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: '-5px',
                            width: '125%',
                            height: '2px',
                            left: '-10px',
                            backgroundColor: '#b18aff',
                            borderRadius: '2px'
                        }
                    }}
                >Account details</Typography>
                <Box my={2}>
                    <div className='profile-item'>
                        <p className="item-name">Orders placed as a buyer</p>
                        <p className="item-data">
                            <span>{profileDetail?.info.order_as_buyer}</span>
                            <span>(${`${numberFormat(profileDetail?.info.order_as_buyer_total)}`})</span>
                        </p>
                    </div>
                    <div className='profile-item'>
                        <p className="item-name">Vendor Income</p>
                        <p className="item-data">
                            ${numberFormat(profileDetail?.info.income)}
                        </p>
                    </div>
                    <div className='profile-item'>
                        <p className="item-name">Vendor Expense</p>
                        <p className="item-data">
                            ${numberFormat(profileDetail?.info.expense)}
                        </p>
                    </div>
                    <div className='profile-item'>
                        <p className="item-name">Earning balance</p>
                        <p className="item-data">
                            ${numberFormat(profileDetail?.info.earning)}
                        </p>
                    </div>
                    <div className='profile-item'>
                        <p className="item-name">Products listed as vendor</p>
                        <p className="item-data">
                            {numberFormat(profileDetail?.info.products_total)}
                        </p>
                    </div>
                    <div className='profile-item'>
                        <p className="item-name">Joined</p>
                        <p className="item-data">
                        {moment(new Date(Number(profileDetail?.info.joined * 1000)).getTime()).format('lll')}
                        </p>
                    </div>
                    <div className='profile-item'>
                        <p className="item-name">Last login</p>
                        <p className="item-data">
                            {moment(new Date(Number(profileDetail?.info.last_login * 1000)).getTime()).format('lll')}
                        </p>
                    </div>
                    <div className='profile-item'>
                        <p className="item-name">Language</p>
                        <p className="item-data">
                            {numberFormat(profileDetail?.info.language)}
                        </p>
                    </div>
                    <div className='profile-item'>
                        <p className="item-name">Referer</p>
                        <p className="item-data">
                            {numberFormat(profileDetail?.info.referer)}
                        </p>
                    </div>
                </Box>
            </Box>
            <div
                style={{
                    overflow: 'hidden',
                    backgroundColor: '#323259',
                    height: '20px',
                    width: '100%'
                }}
            ></div>
            {/* email and password */}
            <Box my={2}>
                <Typography my={2} variant='h5' sx={{ color: '#fff' }} >{`Email & password`}</Typography>
                <div className="profile-item">
                    <p className="item-name">First name *</p>
                    <div className='item-input'>
                        <InputField
                            name='firstName'
                            control={control}
                            style={{color: '#fff', backgroundColor: '#323259', width: '250px' }}
                        />
                    </div>
                </div>
                <div className="profile-item">
                    <p className="item-name">Last name *</p>
                    <div className="item-input">
                        <InputField
                            name='lastName'
                            control={control}
                            style={{color: '#fff', backgroundColor: '#323259', width: '250px' }}
                        />
                    </div>
                </div>
                <div className="profile-item">
                    <p className="item-name">Email *</p>
                    <div className="item-input">
                        <InputField
                            name='email'
                            control={control}
                            type='email'
                            style={{color: '#fff', backgroundColor: '#323259', width: '250px' }}
                        />
                    </div>
                </div>
                <div className="profile-item">
                    <p className="item-name">Password</p>
                    <div className="item-input">
                        <InputField
                            name='password'
                            control={control}
                            type='password'
                            style={{color: '#fff', backgroundColor: '#323259', width: '250px' }}
                        />
                    </div>
                </div>
                <div className="profile-item">
                    <p className="item-name">Confirm password</p>
                    <div className="item-input">
                        <InputField
                            name='confirmPassword'
                            control={control}
                            type='password'
                            style={{color: '#fff', backgroundColor: '#323259', width: '250px' }}
                        />
                    </div>
                </div>
                <div className="profile-item">
                    <p className="item-name">Type</p>
                    <p className="item-data">
                        {profileDetail?.info.paymentRailsType}
                    </p>
                </div>
                <div className="profile-item">
                    <p className="item-name">PaymentRails ID</p>
                    <p className="item-data">
                        {profileDetail?.info.paymentRailsId}
                    </p>
                </div>
            </Box>
            <div
                style={{
                    overflow: 'hidden',
                    backgroundColor: '#323259',
                    height: '20px',
                    width: '100%'
                }}
            ></div>
            {/* access information */}
            <Box mt={2}>
                <Typography my={2} variant='h5' sx={{ color: '#fff' }} >Access information</Typography>
                <div className="profile-item">
                    <p className="item-name">Access level</p>
                    <p className="item-data">
                        {profileDetail?.info.access_level}
                    </p>
                </div>
                <div className="profile-item">
                    <p className="item-name">Account status <span style={{ color: 'red', marginLeft: '5px'}}>*</span></p>
                    <div className="item-input">
                        <Controller
                            name='account_status'
                            control={control}
                            render={({ field }) => (
                                <FormControl size='small' sx={{ color: '#fff', backgroundColor: '#323259', width: '250px', marginTop: '16px' }}>
                                    <MuiSelect
                                        value={field.value}
                                        onChange={(e) => field.onChange(e)}
                                    >
                                        <MenuItem value='E'>{profileDetail?.account_status.E}</MenuItem>
                                        <MenuItem value='D'>{profileDetail?.account_status.D}</MenuItem>
                                        <MenuItem value='U'>{profileDetail?.account_status.U}</MenuItem>
                                    </MuiSelect>
                                </FormControl>
                            )}
                        />
                    </div>
                </div>
                <div className="profile-item">
                    <p className="item-name">Status comment (reason)</p>
                    <div className="item-input">
                        <Controller
                            name='status_comment'
                            control={control}
                            render={({ field }) => (
                                <TextareaAutosize
                                    maxRows={4}
                                    minRows={3}
                                    aria-label="maximum height"
                                    placeholder="Comment"
                                    style={{color: '#fff', backgroundColor: '#323259', width: 500, padding: '10px', marginTop: '16px' }}
                                    value={field.value}
                                    onChange={(e) => field.onChange(e)}
                                />
                            )}
                        />
                    </div>
                </div>
                <div className="profile-item">
                    <p className="item-name">Membership</p>
                    <p className="item-input">
                        <SelectField
                            name='membership_id'
                            label='All memberships'
                            control={control}
                            options={[
                                { id: 1, name: 'Ignore Membership' },
                                { id: 2, name: 'General' },
                            ]}
                            style={{ color: '#fff', backgroundColor: '#323259', width: '250px'}}
                        />
                    </p>
                </div>
                <div className="profile-item">
                    <p className="item-name">Pending membership</p>
                    <p className="item-data">
                        {profileDetail?.info.pending_membership_id === null ? 'none' : profileDetail?.info.pending_membership_id}
                    </p>
                </div>
                <div className="profile-item">
                    <p className="item-name">Require to change password on next log in</p>
                    <p className="item-data">
                        <Controller
                            name='forceChangePassword'
                            control={control}
                            render={({ field }) => (
                                <Checkbox
                                    inputProps={{ 'aria-label': 'Checkbox demo' }}
                                    size='small'
                                    style={{ marginLeft: '-16px', marginTop: '-8px' }}
                                    onChange={(e) => field.onChange(e.target.checked)}
                                    checked={field.value}
                                />
                            )}
                        />
                    </p>
                </div>
            </Box>
            <div
                style={{
                    overflow: 'hidden',
                    backgroundColor: '#323259',
                    height: '20px',
                    width: '100%'
                }}
            ></div>
            <Box my={2}>
                <Typography my={2} variant='h5' sx={{ color: '#fff' }} >Tax information</Typography>
                <div className="profile-item">
                    <p className="item-name">Require to change password on next log in</p>
                    <p className="item-data">
                        <Controller
                            name='taxExempt'
                            control={control}
                            render={({ field }) => (
                                <Checkbox
                                    inputProps={{ 'aria-label': 'Checkbox' }}
                                    size='small'
                                    style={{ marginLeft: '-16px', marginTop: '-8px' }}
                                    onChange={(e) => field.onChange(e.target.checked)}
                                    checked={field.value}
                                />
                            )}
                        />
                    </p>
                </div>
            </Box>
            <Box
                sx={{
                    backgroundColor: '#323259',
                    padding: '10px 30px',
                    position: 'sticky',
                    bottom: '0px',
                    boxShadow: '0 0 13px 0 #b18aff',
                    borderStyle: 'solid',
                    borderColor:'#323259',
                    borderImage: 'initial',
                    zIndex: 2,
                    width: '100%', 
                }}
            >
                <Button variant='contained' color='warning' onClick={handleSubmit(onSubmit)}>
                    update
                </Button>
            </Box>
        </div>
    )
}