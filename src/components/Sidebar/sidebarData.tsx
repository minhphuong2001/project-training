import React from 'react'
import {
    Print,
    PersonOutline,
    Language
} from '@mui/icons-material'

const sidebar_item = [
    {
        displayName: 'Orders',
        route: '/orders/manage-orders',
        icon: <Print />,
        listItem: [
            {
                name: 'Orders list',
                routeItem: '/order-list'
            }
        ]
    },
    {
        displayName: 'Catalog',
        route: '/pages/products/manage-products',
        icon: <PersonOutline />,
        listItem: [
            {
                name: 'Products',
                routeItem: '/manage-products'
            }
        ]
    },
    {
        displayName: 'Users',
        route: '/pages/users/manage-users',
        icon: <PersonOutline />,
        listItem: [
            {
                name: 'User List',
                routeItem: '/manage-users'
            }
        ]
    },
    {
        displayName: 'Sales channels',
        route: '/sales-channels',
        icon: <Language />
    },
]

export default sidebar_item;