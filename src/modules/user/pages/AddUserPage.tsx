import React, { useState } from 'react'
import { Backdrop, Box, CircularProgress } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import { useHistory } from 'react-router'
import { ROUTES } from '../../../configs/routes';
import AddUser from '../components/AddUser';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from '../../../redux/reducer';
import { Action } from 'typesafe-actions';
import { fetchThunk } from '../../common/redux/thunk';
import { API_PATHS } from '../../../configs/api';
import { toast, ToastContainer } from 'react-toastify'

export default function AddUserPage() {
    const history = useHistory();
    const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
    const [isLoading, setIsLoading] = useState(false);
    
    const onAddNewUser = async (data: any) => {
        setIsLoading(true);
        const values = {
            email: data?.email,
            firstName: data?.firstName,
            lastName: data?.lastName,
            membership_id: '',
            password: data?.password,
            confirm_password: data?.confirm_password,
            paymentRailsType: data?.paymentRailsType,
            access_level: data?.access_level,
            taxExempt: data?.taxExempt === false ? 0 : 1,
            forceChangePassword: data?.forceChangePassword === false ? 0 : 1,
        }
        const response = await dispatch(fetchThunk(`${API_PATHS.userAdmin}/create`, 'post', values));

        setIsLoading(false);
        if (response?.success === true) {
            toast.success('Create account successfully');
            
            setTimeout(() => {
                history.push(`${ROUTES.user}/manage-users`);
            }, 3500);
        } else {
            toast.error('The email has been already existed');
        }
    }

    return (
        <div>
            <Box mb={2}
                sx={{
                    backgroundColor: '#fff',
                    color: '#000',
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                }}
                onClick={() => history.push(`${ROUTES.user}/manage-users`)}
            >
                <ArrowBack />
            </Box>
            {isLoading ?
                <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
                    <CircularProgress color="inherit" />
                </Backdrop> : null
            }
            <AddUser onAddNewUser={onAddNewUser} />
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    )
}