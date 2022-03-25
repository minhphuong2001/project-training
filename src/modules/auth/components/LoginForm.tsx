import React, { useCallback, useState } from 'react'
import { TextField, Button, FormHelperText, CircularProgress } from '@mui/material'
import { Login } from '@mui/icons-material';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { ILoginParams } from '../../../models/auth';
import { useDispatch } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { AppState } from '../../../redux/reducer'
import { Action } from 'redux'
import { API_PATHS } from '../../../configs/api'
import { fetchThunk } from '../../common/redux/thunk'
import { setUserInfo } from '../redux/authReducer';
import Cookies from 'js-cookie';
import { ACCESS_TOKEN_KEY } from '../../../utils/constants';
import { replace } from 'connected-react-router';
import { ROUTES } from '../../../configs/routes';

export default function LoginForm() {
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required('Email is required.')
      .matches(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "This is not email."
      ),
    password: Yup.string()
      .required('Password is required.')
      .min(6, 'Mininum of 6 characters.')
  });
  
  const { register, handleSubmit, formState: { errors, isValid } } = useForm<ILoginParams>(
    {
      mode: 'all',
      resolver: yupResolver(validationSchema)
    });

  const onSubmit: SubmitHandler<ILoginParams> = useCallback(async (values) => {
    setIsLoading(true);
    const response = await dispatch(fetchThunk(API_PATHS.login, 'post', { email: values.email, password: values.password }));
    
    setIsLoading(false);
    console.log(values)
    if (response?.success === true) {
      dispatch(setUserInfo(response.user));
      Cookies.set(ACCESS_TOKEN_KEY, response.user_cookie, { expires: 5 });
      dispatch(replace(`${ROUTES.product}/manage-products`))
    }

    setErrorMessage(response?.errors.email);
  }, [dispatch])

  return (
    <>
      <TextField
        id="outlined-basic"
        variant="outlined"
        label='Email'
        type='email'
        fullWidth
        {...register('email')}
        helperText={errors.email ? <FormHelperText error sx={{margin: '8px 0'}}>{errors.email.message}</FormHelperText> : null}
      />
      <TextField
        id="outlined-basic"
        variant="outlined"
        type='password'
        label='Password'
        fullWidth
        sx={{ marginTop: 2 }}
        {...register('password')}
        helperText={errors.password ? <FormHelperText error sx={{margin: '8px 0'}}>{errors.password.message}</FormHelperText> : null}
      />
      {errorMessage ? <FormHelperText error sx={{ margin: '8px 0' }}>{errorMessage}</FormHelperText> : null}
      <Button
        disabled={!isValid}
        variant='contained'
        startIcon={<Login />}
        fullWidth
        color='success'
        size='large'
        sx={{ marginTop: 2 }}
        onClick={handleSubmit(onSubmit)}
      >
        {isLoading ? <CircularProgress size={24} color='inherit' /> : 'Login'}
      </Button>
    </>
  )
}