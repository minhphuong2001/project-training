import React from 'react'
import { Route, Switch } from 'react-router'
import { ROUTES } from '../../../configs/routes'
import AddProductPage from '../../product/pages/AddProductPage'
import ProductDetailPage from '../../product/pages/ProductDetailPage'
import ProductPage from '../../product/pages/ProductPage'
import UserPage from '../../user/pages/UserPage'

export default function HomeRoute() {
    return (
        <Switch>
            <Route path={`${ROUTES.product}/manage-products`} component={ProductPage} />
            <Route path={`${ROUTES.user}/manage-users`} component={UserPage} />
            <Route path={`${ROUTES.product}/new-product`} component={AddProductPage} />
            <Route path={`${ROUTES.product}/product-detail/:id`} component={ProductDetailPage} />
        </Switch>
    )
}