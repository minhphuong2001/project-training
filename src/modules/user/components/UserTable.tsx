import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { DeleteOutline } from '@mui/icons-material';

const columns: GridColDef[] = [
    { field: 'email', headerName: 'Login/Email', width: 100 },
    { field: 'name', headerName: 'Name', width: 220 },
    { field: 'level', headerName: 'Access level', width: 170 },
    {
        field: 'products',
        headerName: 'Products',
        width: 90,
        type: 'number'
    },
    {
        field: 'orders',
        headerName: 'Orders',
        width: 90,
        type: 'number',
        renderCell: (params) => {
            return (
                <input
                    value={params.value}
                    style={{ width: '100%' }}
                />
            )
        }
    },
    {
        field: 'wishlist',
        headerName: 'Wishlist',
        width: 90,
        type: 'number',
    },
    {
        field: 'created',
        headerName: 'Created',
        width: 150
    },
    {
        field: 'lastLogin',
        headerName: 'Last Login',
        width: 150
    },
    {
        field: 'action',
        headerName: 'Action',
        flex: 1,
        renderCell: () => {
            return (
                <DeleteOutline />
            )
        }
    }
];

const rows = [
    { id: 1, name: 'Jon', level: 'abc', products: 35, order: 20, wishlist: 5, created: 'jeb 2, 2021', lastLogin: 'feb 28, 2022', },
    { id: 2, name: 'Cersei', level: 'add', products: 42, order: 20, wishlist: 10, created: 'jeb 5, 2021',  lastLogin: 'feb 28, 2022', },
    { id: 3, name: 'Jaime', level: 'rff', products: 45, order: 30, wishlist: 26, created: 'mar 2, 2021', lastLogin: 'apr 28, 2022',},
    { id: 4, name: 'Jaime', level: 'abc', products: 41, order: 12, wishlist: 26, created: 'mar 2, 2021', lastLogin: 'mar 28, 2022', },
    { id: 5, name: 'Jaime', level: 'gcd', products: 450, order: 100, wishlist: 26, created: 'mar 2, 2021', lastLogin: 'feb 28, 2022', },
];

export default function UserTable() {
    return (
        <div style={{ height: 400, width: '100%', backgroundColor: '#dfe4ea' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection
            />
        </div>
    );
}