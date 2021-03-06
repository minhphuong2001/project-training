import React from 'react'
import { Switch } from 'react-router'
import { ROUTES } from '../../../configs/routes'
import ProtectedRoute from '../../common/components/ProtectedRoute'
import AddProductPage from '../../product/pages/AddProductPage'
import ProductDetailPage from '../../product/pages/ProductDetailPage'
import ProductPage from '../../product/pages/ProductPage'
import AddUserPage from '../../user/pages/AddUserPage'
import UserDetailPage from '../../user/pages/UserDetailPage'
import UserPage from '../../user/pages/UserPage'

export default function HomeRoute() {
    return (
        <Switch>
            <ProtectedRoute path={`${ROUTES.product}/manage-products`} component={ProductPage} />
            <ProtectedRoute path={`${ROUTES.user}/manage-users`} component={UserPage} />
            <ProtectedRoute path={`${ROUTES.product}/new-product`} component={AddProductPage} />
            <ProtectedRoute path={`${ROUTES.product}/product-detail/:id`} component={ProductDetailPage} />
            <ProtectedRoute path={`${ROUTES.user}/user-detail/:id`} component={UserDetailPage} />
            <ProtectedRoute path={`${ROUTES.user}/new-user`} component={AddUserPage} />
        </Switch>
    )
}