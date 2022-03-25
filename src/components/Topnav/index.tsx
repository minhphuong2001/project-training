import React, { useState } from 'react'
import {
    MenuSharp,
    NotificationsNoneSharp,
    PersonOutlineSharp
} from '@mui/icons-material'
import { Button, Typography } from '@mui/material'
import { Box } from '@mui/system'
import './topnav.scss'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../configs/routes'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from '../../redux/reducer'
import { removeUserInfo } from '../../modules/auth/redux/authReducer'
import Cookies from 'js-cookie'
import { Action } from 'typesafe-actions'
import { ACCESS_TOKEN_KEY } from '../../utils/constants'
import { ThunkDispatch } from 'redux-thunk'
import { CustomDialog } from '../Dialog/CustomDialog'
import { replace } from 'connected-react-router'

export interface TopnavProps {
    toggle: () => void;
}

export default function Topnav({ toggle }: TopnavProps) {
    const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
    const { user } = useSelector((state: AppState) => state.product.products);
    const [showDialog, setShowDialog] = useState(false);

    const handleLogout = async () => {
        Cookies.remove(ACCESS_TOKEN_KEY);
        dispatch(removeUserInfo());
        dispatch(replace(ROUTES.login));
        setShowDialog(false);
    }

    return (
        <div>
            <Box sx={{
                backgroundColor: '#323259',
                boxShadow: '#1a1f33 0px 8px 16px 0px',
                color: '#fff',
                width: '100%',
                padding: '15px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'fixed',
                zIndex: 100
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <MenuSharp
                        sx={{ fontSize: 24 }}
                        onClick={toggle}
                    />
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        marginLeft: 2
                    }}>
                        <Link to={`${ROUTES.product}/manage-products`} style={{ color: '#fff'}} >
                            <Typography variant='h4' sx={{ textTransform: 'capitalize'}}>gear focus admin</Typography>
                        </Link>
                        <NotificationsNoneSharp sx={{ fontSize: 20, marginLeft: '3px' }}/>
                    </Box> 
                </Box>
                <div className='icon-person'>
                    <PersonOutlineSharp sx={{ fontSize: 26 }} />
                    <div className='sub'> 
                        <Link to={`${ROUTES.user}/user-detail/${user.profile_id}`}>
                            <Typography sx={{
                                color: '#000',
                                cursor: 'pointer',
                                '&:hover': {
                                    color: '#007bff'
                                }
                            }}>My profile</Typography>
                        </Link>
                        <Typography sx={{ color: '#cacaca' }}>{user.login}</Typography>
                        <p className='logout' onClick={() => setShowDialog(true)}>Logout</p>
                    </div>
                </div>
            </Box> 
            <CustomDialog
                open={showDialog}
                title='Logout'
                content={<Typography variant='body1'>Are you sure want to log out?</Typography>}
                actions={
                    <Box width='100%' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Button
                            variant='contained'
                            sx={{ marginRight: '1rem' }}
                            onClick={handleLogout}
                        >
                            yes
                        </Button>
                        <Button variant='outlined' onClick={() => setShowDialog(false)}>no</Button>
                    </Box>
                }
            /> 
        </div>
        
    )
}