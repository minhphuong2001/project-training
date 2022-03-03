import { CircularProgress } from '@mui/material';
import React, { lazy, Suspense } from 'react';
import { Switch, useLocation } from 'react-router-dom';
import { ROUTES } from './configs/routes';
import AuthRoute from './modules/common/components/AuthRoute';
import ProtectedRoute from './modules/common/components/ProtectedRoute';

const HomePage = lazy(() => import('./modules/home/pages/HomePage'));
const LoginPage = lazy(() => import('./modules/auth/pages/LoginPage'));

export const Routes = () => {
  const location = useLocation();

  return (
    <Suspense fallback={<div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh'
    }}>
      <CircularProgress size={50}/>
    </div>}>
      <Switch location={location}>
        <AuthRoute path={ROUTES.login} component={LoginPage} />
        <ProtectedRoute path={`${ROUTES.product}/manage-products`} component={HomePage} />

        <AuthRoute path="/" component={LoginPage} />
      </Switch>
    </Suspense>
  );
};
