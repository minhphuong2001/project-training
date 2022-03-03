import React from 'react'
import {
    MenuSharp,
    NotificationsNoneSharp,
    PersonOutlineSharp
} from '@mui/icons-material'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import './topnav.scss'

export default function Topnav() {
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
                    <MenuSharp sx={{ fontSize: 24 }} />
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        marginLeft: 2
                    }}>
                        <Typography variant='h4' sx={{ textTransform: 'capitalize'}}>gear focus admin</Typography>
                        <NotificationsNoneSharp sx={{ fontSize: 20, marginLeft: '3px' }}/>
                    </Box> 
                </Box>
                <div className='icon-person'>
                    <PersonOutlineSharp sx={{ fontSize: 26 }} />
                    <div className='sub'> 
                        <Typography>My profile</Typography>
                        <Typography>abcAgmail.com</Typography>
                        <Typography>Logout</Typography>
                    </div>
                </div>
            </Box> 
        </div>
        
    )
}