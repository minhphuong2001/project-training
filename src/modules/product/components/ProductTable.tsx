import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import moment from 'moment';
import {
    Checkbox,
    IconButton,
    Pagination,
    Select,
    MenuItem,
    FormControl,
    Typography,
    Button,
} from '@mui/material';
import { Box } from '@mui/system';
import { numberFormat } from '../../../utils/common'
import { IProductData } from '../../../models/product';
import { DeleteOutline, PowerSettingsNew } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import './product.scss'
import { CustomDialog } from '../../../components/Dialog/CustomDialog';
import { ROUTES } from '../../../configs/routes';
// export interface UpdateProps {
//     fees?: any;
//     volume_input_in_input_currency?: any;
// }
interface ProductTableProps {
    products: IProductData[];
}

// const useSortTable = (items: any) => {
//     const [sortConfig, setSortConfig] = useState<any>(null);

//     const sortedItem = useMemo(() => {
//         const sortableItems = [...items];
//         if (sortConfig !== null) {
//             sortableItems.sort((a, b) => {
//                 if (a[sortConfig?.key] < b[sortConfig?.key]) {
//                     return sortConfig?.direction === 'ascending' ? -1 : 1;
//                 }
//                 if (a[sortConfig?.key] > b[sortConfig?.key]) {
//                     return sortConfig?.direction === 'ascending' ? 1 : -1;
//                 }
//                 return 0;
//             })
//         }
//         return sortableItems;
//     }, [items, sortConfig]);

//     const requestSort = (key: string) => {
//         let direction = 'ascending';
//         if (sortConfig && sortConfig?.key === key && sortConfig?.direction === 'ascending') {
//             direction = 'descending';
//         }
//         setSortConfig({ key, direction });
//     }

//     return { items: sortedItem, requestSort, sortConfig };
// }

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

export default function PayrollTable({ products }: ProductTableProps) {
    const [rowsPerPage, setRowsPerPage] = useState('10');
    const [isLabel, setIsLabel] = useState(true);
    const [showUpdateDialog, setShowUpdateDialog] = useState(false);

    const handleOnChange = (e: any) => {
        console.log(e.target.value);
    };

    return (
        <Box sx={{ width: '100%', overflow: 'hidden', marginBottom: '30px'}}>
            <TableContainer sx={{ backgroundColor: '#323259' }}>
                <Table aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 600, width: '80px' }}>
                                <Checkbox {...label} size='small' />
                            </TableCell>
                            <TableCell
                                align='left'
                                sx={{ fontWeight: 600, cursor: 'pointer', width: '80px' }}
                            >
                                SKU
                            </TableCell>
                            <TableCell align='left' sx={{ fontWeight: 600, minWidth: '350px' }}>Name</TableCell>
                            <TableCell align='left' sx={{ fontWeight: 600, minWidth: '200px'  }}>Category</TableCell>
                            <TableCell
                                align='left'
                                sx={{ fontWeight: 600, cursor: 'pointer', minWidth: '100px'  }}
                            >
                                Price
                            </TableCell>
                            <TableCell align='left' sx={{ fontWeight: 600, minWidth: '100px' }}>In stock</TableCell>
                            <TableCell align='left' sx={{ fontWeight: 600, width: '120px' }}>Vendor</TableCell>
                            <TableCell align='left' sx={{ fontWeight: 600, width: '130px' }}>Arrival date</TableCell>
                            <TableCell align='right' sx={{width: '150px', fontWeight: 600 }}></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.slice(0, +rowsPerPage).map((item: IProductData, index: number) => {
                            return (
                                <TableRow
                                    key={index}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Checkbox {...label} size='small' />
                                        |
                                        <IconButton color='success' onClick={() => setShowUpdateDialog(true)}>
                                            <PowerSettingsNew/>
                                        </IconButton>
                                    </TableCell>
                                    <TableCell align='left'>{item.sku}</TableCell>
                                    <TableCell align='left'
                                        sx={{
                                            '&:hover': {
                                                textDecoration: 'underline'
                                            }
                                        }}>
                                        <Link to={`${ROUTES.product}/product-detail/${item.id}`} style={{ color: '#007bff' }}>
                                            {item.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell align='left'>{item.category}</TableCell>
                                    <TableCell
                                        align='left'
                                        sx={{ fontWeight: 600 }}
                                    >
                                    {
                                        isLabel ? (
                                            <label
                                                className='label'
                                                onClick={() => setIsLabel(false)}
                                            >
                                                {numberFormat(Number(item.price))}
                                            </label>) :
                                            (<input
                                                name='text'
                                                value={numberFormat(Number(item.price))}
                                                onChange={handleOnChange}
                                                onBlur={() => setIsLabel(true)}
                                                className='input'
                                        />)
                                    }
                                    </TableCell>
                                    <TableCell align='left'>
                                    {
                                        isLabel ? (
                                            <label
                                                className='label'
                                                onClick={() => setIsLabel(false)}
                                            >
                                                {item.enabled}
                                            </label>) :
                                            (<input
                                                name='text'
                                                value={item.enabled}
                                                onChange={handleOnChange}
                                                onBlur={() => setIsLabel(true)}
                                                className='input'
                                        />)
                                    }
                                    </TableCell>
                                    <TableCell align='left'
                                        sx={{
                                            '&:hover': {
                                                textDecoration: 'underline'
                                            }
                                        }}>
                                        <Link to='#' style={{ color: '#007bff' }}>
                                           {item.vendor}
                                        </Link>
                                    </TableCell>
                                    <TableCell align='left'>{item.arrivalDate}</TableCell>
                                    <TableCell align='right' sx={{ display: 'flex', alignItems: 'center'}}>
                                        <IconButton color='inherit' >
                                            <DeleteOutline />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '20px 16px'
                }}>
                    {/* <Typography>Show <span style={{ fontWeight: 600 }}></span> data from <span style={{ fontWeight: 600 }}>{payrolls.length}</span></Typography> */}
                    <Pagination
                        count={10}
                        variant="outlined"
                        shape="rounded"
                        color='primary'
                    />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '20px'}}>
                        <span style={{ color: '#fff' }}>{products.length} items</span>
                        <FormControl sx={{ m: 1, width: '80px'}} size='small'>
                            <Select
                                defaultValue='10'
                                value={rowsPerPage}
                                onChange={(e) => setRowsPerPage(e.target.value)}
                                sx={{color: '#fff'}}
                            >
                                <MenuItem value={10}>10</MenuItem>
                                <MenuItem value={25}>25</MenuItem>
                                <MenuItem value={50}>50</MenuItem>
                                <MenuItem value={75}>75</MenuItem>
                                <MenuItem value={100}>100</MenuItem>
                            </Select>
                        </FormControl>
                        <span style={{ color: '#fff' }}>per page</span>
                    </div>
                    
                </Box>
                {/* show dialog when user wants to update */}
                <CustomDialog
                    open={showUpdateDialog}
                    title='Confirm Update'
                    content={<Typography variant='body1'>Do you want to update this product?</Typography>}
                    actions={
                        <Box width='100%' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Button
                                variant='contained'
                                sx={{ marginRight: '1rem' }}
                                onClick={() => {
                                    setShowUpdateDialog(false)
                                }}
                            >
                                yes
                            </Button>
                            <Button
                                variant='outlined'
                                onClick={() => setShowUpdateDialog(false)}
                            >
                                no
                            </Button>
                        </Box>
                    }
                /> 
                {/* show dialog when user wants to delete? */}
                {/* <CustomDialog
                    open={showDeleteItem}
                    title='Do you sure want to delete?'
                    actions={
                        <Box width='100%' sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                variant='contained'
                                sx={{ marginRight: '1rem' }}
                                onClick={() => {onDelete(item?.payroll_id), setShowDeleteItem(false)}}
                                size='small'
                            >
                                delete
                            </Button>
                            <Button
                                variant='outlined'
                                onClick={hanldeCloseDelete}
                                size='small'
                            >
                                cancel
                            </Button>
                        </Box>
                    } */}
                {/* /> */}
            </TableContainer>
        </Box>
        
    );
}

