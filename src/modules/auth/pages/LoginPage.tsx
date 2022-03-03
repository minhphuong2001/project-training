import React from 'react'
import { Box } from '@mui/system'
import { Typography } from '@mui/material'
import LoginForm from '../components/LoginForm'

export default function LoginPage() {

  return (
    <Box sx={{
      width: '500px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '25vh auto',
      backgroundColor: '#dfe4ea'
    }}>
      <Box my={3} mx={2} sx={{ width: '100%'}}>
        <Typography mb={3} sx={{
          textAlign: 'center',
          fontSize: 32
        }}>
          Sign In
        </Typography>
        <LoginForm />
      </Box>
    </Box>
  )
}