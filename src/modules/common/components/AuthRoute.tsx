import Cookies from 'js-cookie'
import React from 'react'
import { useSelector } from 'react-redux';
import { Redirect, Route, RouteProps } from 'react-router'
import { AppState } from '../../../redux/reducer';
import { ACCESS_TOKEN_KEY } from '../../../utils/constants'
import { ROUTES } from '../../../configs/routes'

interface AuthRouteProps extends RouteProps {}

const AuthRoute = ({ ...rest }: AuthRouteProps) => {
    const token = Cookies.get(ACCESS_TOKEN_KEY);
    const { user } = useSelector((state: AppState) => state.profile);

    if (!token || !user) {
        return <Route {...rest}/>
    }

    return (
        <Redirect to={`${ROUTES.product}/manage-products`}/>
    )
}

export default AuthRoute