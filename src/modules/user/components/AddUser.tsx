import React from 'react'
import { Button, Checkbox, Typography } from '@mui/material'
import { Box } from '@mui/system'
import '../components/user.scss'
import { useForm, Controller } from 'react-hook-form'
import InputField from '../../../components/FormField/InputField'
import { SelectField } from '../../../components/FormField/SelectField'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

interface AddUserProps {
    onAddNewUser: (data: any) => void;
}

export default function AddUser({ onAddNewUser }: AddUserProps) {
    const initialValues = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirm_password: '',
        paymentRailsType: '',
        access_level: '',
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
        confirm_password: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Password does not match.') 
    });

    const { control, handleSubmit } = useForm({
        defaultValues: initialValues,
        resolver: yupResolver(validationSchema),
        mode: 'all'
    });

    const onSubmit = (data: any) => {
        onAddNewUser(data);
    }

    return (
        <div>
            <Box>
                <Typography my={1} variant='h4' sx={{ color: '#fff' }} >Create profile</Typography>
                <Typography my={1} variant='body1' sx={{ color: '#fff' }} >{`Email & password`}</Typography>
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
                            name='confirm_password'
                            control={control}
                            type='password'
                            style={{color: '#fff', backgroundColor: '#323259', width: '250px' }}
                        />
                    </div>
                </div>
                <div className="profile-item">
                    <p className="item-name">Type</p>
                    <p className="item-data">
                        <SelectField
                            name='paymentRailsType'
                            control={control}
                            options={[
                                { id: 'individual', name: 'Individual' },
                                { id: 'business', name: 'Business' },
                            ]}
                            style={{ color: '#fff', backgroundColor: '#323259', width: '250px', marginTop: '-16px' }}
                        />
                    </p>
                </div>
                <div className="profile-item">
                    <p className="item-name">PaymentRails ID</p>
                    <p className="item-data"></p>
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
                <Typography my={2} variant='body2' sx={{ color: '#fff' }} >Access information</Typography>
                <div className="profile-item">
                    <p className="item-name">Access level</p>
                    <p className="item-data">
                        <SelectField
                            name='access_level'
                            control={control}
                            options={[
                                { id: '1', name: 'Admin' },
                                { id: '10', name: 'Vendor' },
                            ]}
                            style={{ color: '#fff', backgroundColor: '#323259', width: '250px', marginTop: '-16px' }}
                        />
                    </p>
                </div>
                <div className="profile-item">
                    <p className="item-name">Membership</p>
                    <p className="item-input">
                        <SelectField
                            name='membership_id'
                            control={control}
                            options={[
                                { id: '1', name: 'Ignore Membership' },
                                { id: '2', name: 'General' },
                            ]}
                            style={{ color: '#fff', backgroundColor: '#323259', width: '250px', marginTop: '-16px' }}
                        />
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
            {/* tax */}
            <Box my={2}>
                <Typography my={2} variant='body1' sx={{ color: '#fff' }} >Tax information</Typography>
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
                    create account
                </Button>
            </Box>
        </div>
    )
}