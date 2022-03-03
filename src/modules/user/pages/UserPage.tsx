import React from 'react'
import { Box, Button, Typography } from '@mui/material'
import UserSearch from '../components/UserSearch'
import UserTable from '../components/UserTable'

export default function UserPage() {
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
            <UserSearch />
            <Button
                variant='contained'
                color='secondary'
                sx={{ margin: '24px 0' }}
            >
                add user
            </Button>
            {/* product table */}
            <UserTable />
        </Box>
    )
}