import React, { useCallback, useState, useEffect } from 'react'
import { Box, Button, Typography, CircularProgress } from '@mui/material'
import UserSearch from '../components/UserSearch'
import UserTable from '../components/UserTable'
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from '../../../redux/reducer';
import { Action } from 'typesafe-actions';
import { fetchThunk } from '../../common/redux/thunk';
import { API_PATHS } from '../../../configs/api';
import { setUserData } from '../redux/userReducer'
import { IUserData } from '../../../models/user'

export default function UserPage() {
    const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
    const { users } = useSelector((state: AppState) => state.user);
    const [isLoading, setIsLoading] = useState(false);
    const [userList, setUserList] = useState<IUserData[]>([]);
    const [userRole, setUserRole] = useState<any[]>([]);

    const getUserList = useCallback(async () => {
        setIsLoading(true);
        const response = await dispatch(fetchThunk(`${API_PATHS.userAdmin}/list`, 'post'));

        setIsLoading(false);
        dispatch(setUserData(response));
    }, [dispatch])

    useEffect(() => {
        getUserList();
    }, [getUserList])

    useEffect(() => {
        const getUserRole = async () => {
            setIsLoading(true);
            const response = await dispatch(fetchThunk(`${API_PATHS.userRole}`, 'get'));
            
            setIsLoading(false);
            setUserRole(response?.data);
        }

        getUserRole();
    }, [dispatch])

    const handleDeleteUser = (value: any) => {
        console.log(value);
    }

    useEffect(() => {
        setUserList([...users?.data]);
    }, [users])
    console.log(userRole);
    return (
        <Box>
            <Typography
                mb={2}
                variant='h5'
                sx={{ color: '#fff' }}
            >
                Search for users
            </Typography>
            
            {/* search product */}
            <UserSearch userRole={userRole}/>

            <Button
                variant='contained'
                color='secondary'
                sx={{ margin: '24px 0' }}
            >
                add user
            </Button>
            {/* product table */}
            {isLoading ?
                <Box style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '70vh'
                }}>
                    <CircularProgress size={48} />
                </Box> : <>
                    <UserTable users={userList} onDelete={handleDeleteUser}/>
                </>
            }
        </Box>
    )
}