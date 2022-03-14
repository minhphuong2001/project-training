import React, { useState, useEffect, useCallback } from 'react'
import { ArrowBack } from '@mui/icons-material';
import { Box, CircularProgress } from '@mui/material';
import { useHistory, useParams } from 'react-router';
import { ROUTES } from '../../../configs/routes';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from '../../../redux/reducer';
import { Action } from 'typesafe-actions';
import { fetchThunk } from '../../common/redux/thunk';
import { API_PATHS } from '../../../configs/api';
import { IUserProfileDetail } from '../../../models/user';
import UserDetail from '../components/UserDetail';
import '../components/user.scss'
import { toast, ToastContainer } from 'react-toastify'

export default function UserDetailPage() {
    const { id }: any = useParams();
    const history = useHistory();
    const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
    const [userProfileDetail, setUserProfileDetail] = useState<IUserProfileDetail>();
    const [isLoading, setIsLoading] = useState(false);

    const getUserProfileDetail = useCallback(async () => {
        setIsLoading(true);
        const response = await dispatch(fetchThunk(API_PATHS.userProfileDetail, 'post', { id: id }));
        
        setIsLoading(false);
        setUserProfileDetail(response?.data);
    }, [dispatch, id])

    const handleUpdateUser = async (data: any) => {
        setIsLoading(true);
        const values = {
            id: id,
            email: data?.email,
            firstName: data?.firstName,
            lastName: data?.lastName,
            forceChangePassword: data?.forceChangePassword === false ? 0 : 1,
            membership_id: data?.membership_id,
            password: data?.password,
            confirm_password: data?.confirmPassword,
            status: data?.account_status,
            statusComment: data?.status_comment,
            taxExempt: data?.taxExempt === false ? 0 : 1,
            roles: [1]
        }
        console.log(values);
        const response = await dispatch(fetchThunk(`${API_PATHS.userAdmin}/edit`, 'post', { params: [values] }));
        
        setIsLoading(false);
        if (response?.data) {
            setUserProfileDetail(response?.data);
            toast.success('Update successfully');
        } else {
            toast.error('Something went wrong');
        }
    }

    useEffect(() => {
        getUserProfileDetail();
    }, [getUserProfileDetail])

    return (
        <div>
            <Box
                mb={2}
                sx={{
                    backgroundColor: '#fff',
                    color: '#000',
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                onClick={() => history.push(`${ROUTES.user}/manage-users`)}
            >
                <ArrowBack />
            </Box>
            {isLoading ? <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
                <CircularProgress size={48} />
            </Box> : <UserDetail profileDetail={userProfileDetail as IUserProfileDetail} onUpdate={handleUpdateUser} />}
            
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