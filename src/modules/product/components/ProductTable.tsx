import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {
    Checkbox,
    IconButton,
    Pagination,
    Select,
    MenuItem,
    FormControl,
    Typography,
    Button,
    Backdrop,
    CircularProgress,
} from '@mui/material';
import { Box } from '@mui/system';
import { IProductData } from '../../../models/product';
import { DeleteOutline, PowerSettingsNew } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import './product.scss'
import { CustomDialog } from '../../../components/Dialog/CustomDialog';
import { ROUTES } from '../../../configs/routes';
import { AppState } from '../../../redux/reducer';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'typesafe-actions';
import { fetchThunk } from '../../common/redux/thunk';
import { API_PATHS } from '../../../configs/api';
import EditForm from './EditForm';
import moment from 'moment';

interface ProductTableProps {
    products: IProductData[];
    onDelete: (id: any) => void;
    onUpdate: (index: number, values: IProductData) => void;
}

const useSortTableData = (items: any, config = null) => {
    const [sortConfig, setSortConfig] = useState<any>(config);

    const sortedItem = useMemo(() => {
        const sortableItems = [...items];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig?.key] < b[sortConfig?.key]) {
                    return sortConfig?.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig?.key] > b[sortConfig?.key]) {
                    return sortConfig?.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            })
        }

        return sortableItems;
    }, [items, sortConfig]);

    const requestSort = (key: string) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig?.key === key && sortConfig?.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    }

    return { items: sortedItem, requestSort, sortConfig };
}

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

function ProductTable({ products, onDelete, onUpdate }: ProductTableProps) {
    const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
    const [rowsPerPage, setRowsPerPage] = useState('25');
    const [showUpdateDialog, setShowUpdateDialog] = useState(false);
    const { items, requestSort, sortConfig } = useSortTableData(products);
    const { recordsTotal } = useSelector((state: AppState) => state.product.products);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(10);
    const [limitProductData, setLimitProductData] = useState<IProductData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckAll, setIsCheckAll] = useState(false);
    const [selected, setSelected] = useState<any[]>([]);
    const [isOpacity, setIsOpacity] = useState(false);
    const [productItem, setProductItem] = useState<IProductData>();
    
    const [isExported, setIsExported] = useState(false);
    const [isRemove, setIsRemove] = useState(false);
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [showRemoveDialog, setShowRemoveDialog] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number>(0);

    useEffect(() => {
        setLimitProductData([...items]);
    }, [items])

    const getClassName = (name: string) => {
        if (!sortConfig) {
            return;
        } else {
            return sortConfig?.key === name ? sortConfig?.direction : undefined;
        }
    }

    useEffect(() => {
        const totalPages = Math.ceil(recordsTotal / Number(rowsPerPage));
        setTotalPage(totalPages)
    }, [recordsTotal, rowsPerPage])

    const handleChangePage = async (e: any, value: any) => {
        setIsLoading(true);
        const response = await dispatch(fetchThunk(API_PATHS.productList, 'post', { page: value, count: +rowsPerPage }));

        setIsLoading(false);
        setPage(value);
        setLimitProductData(response?.data);
    }

    // select all checkbox
    const handleSelectAll = (e: any) => {
        setIsCheckAll(!isCheckAll);
        setSelected(limitProductData.map(a => a.id));
        if (isCheckAll) {
            setSelected([]);
        }
    };

    const handleClickCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, checked } = e.target;
        setSelected([...selected, id]);
        if (!checked) {
            setSelected(selected.filter(item => item !== id));
        }
    };

    const handleClickRemove = (item: any) => {
        setProductItem(item);
        setIsOpacity(!isOpacity);
        setIsRemove(!isRemove);
    }

    const handleSetPrice = (index: number, value: string) => {
        setLimitProductData((prev) => {
            const prevValue = [...prev]
            const newValue = { ...prevValue[index], price: value }
            prevValue[index] = newValue;
            return prevValue;
        })
    }

    const handleSetAmount = (index: number, value: string) => {
        setLimitProductData((prev) => {
            const prevValue = [...prev]
            const newValue = { ...prevValue[index], amount: value }
            prevValue[index] = newValue;
            return prevValue;
        })
    }

    return (
        <>
            {
                isLoading ?
                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={isLoading}
                    >
                        <CircularProgress color="inherit" size={50}/>
                    </Backdrop> : 
                    <div>
                        <Box sx={{ width: '100%', overflow: 'hidden', marginBottom: '30px' }}>
                            <TableContainer sx={{ backgroundColor: '#323259' }}>
                                <Table aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 600, width: '80px' }}>
                                                <Checkbox
                                                    {...label}
                                                    size='small'
                                                    checked={isCheckAll}
                                                    onChange={handleSelectAll}
                                                    onClick={() => setIsExported(!isExported)}
                                                />
                                            </TableCell>
                                            <TableCell
                                                align='left'
                                                sx={{ fontWeight: 600, cursor: 'pointer', width: '80px' }}
                                                onClick={() => requestSort('sku')}
                                                className={getClassName('sku')}
                                            >
                                                SKU
                                            </TableCell>
                                            <TableCell
                                                align='left'
                                                sx={{ fontWeight: 600, minWidth: '350px' }}
                                                onClick={() => requestSort('name')}
                                                className={getClassName('name')}
                                            >
                                                Name
                                            </TableCell>
                                            <TableCell align='left' sx={{ fontWeight: 600, minWidth: '200px'  }}>Category</TableCell>
                                            <TableCell
                                                align='left'
                                                sx={{ fontWeight: 600, cursor: 'pointer', minWidth: '100px' }}
                                                onClick={() => requestSort('price')}
                                                className={getClassName('price')}
                                            >
                                                Price
                                            </TableCell>
                                            <TableCell
                                                align='left'
                                                sx={{ fontWeight: 600, minWidth: '100px' }}
                                                onClick={() => requestSort('amount')}
                                                className={getClassName('amount')}
                                            >
                                                In stock
                                            </TableCell>
                                            <TableCell
                                                align='left'
                                                sx={{ fontWeight: 600, width: '120px' }}
                                                onClick={() => requestSort('vendor')}
                                                className={getClassName('vendor')}
                                            >
                                                Vendor
                                            </TableCell>
                                            <TableCell
                                                align='left'
                                                sx={{ fontWeight: 600, minWidth: '100px' }}
                                                onClick={() => requestSort('arrivalDate')}
                                                className={getClassName('arrivalDate')}
                                            >
                                                Arrival date</TableCell>
                                            <TableCell align='right' sx={{width: '150px', fontWeight: 600 }}></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {limitProductData.slice(0, +rowsPerPage).map((item: IProductData, index: number) => {
                                            return (
                                                <TableRow
                                                    key={index}
                                                    sx={{
                                                        '&:last-child td, &:last-child th': { border: 0 },
                                                        opacity: item.id == productItem?.id && isOpacity ? 0.6 : 1
                                                    }}
                                                >
                                                    <TableCell
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}
                                                    >
                                                        <Checkbox
                                                            {...label}
                                                            size='small'
                                                            id={item.id as string}
                                                            checked={selected.includes(item.id)}
                                                            onChange={handleClickCheckbox}
                                                            onClick={() => {
                                                                setActiveIndex(index);
                                                                setIsExported(!isExported)
                                                            }}
                                                        />
                                                        |
                                                        <IconButton
                                                            color='success'
                                                            onClick={() => {
                                                                setProductItem(item);
                                                                setActiveIndex(index);
                                                                setShowUpdateDialog(true)
                                                            }}>
                                                            <PowerSettingsNew/>
                                                        </IconButton>
                                                    </TableCell>
                                                    <TableCell align='left'>{item.sku}</TableCell>
                                                    <TableCell align='left'
                                                        sx={{
                                                            cursor: 'pointer',
                                                            '&:hover': {
                                                                textDecoration: 'underline'
                                                            }
                                                        }}
                                                    >
                                                        <Link to={`${ROUTES.product}/product-detail/${item.id}`} style={{ color: '#007bff' }}>
                                                            {item.name}
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell align='left'>{item.category}</TableCell>
                                                    <TableCell
                                                        align='left'
                                                        sx={{ fontWeight: 600 }}
                                                        onClick={() => setProductItem(item)}
                                                    >
                                                        {/* edit form  */}
                                                        <EditForm
                                                            index={index}
                                                            name='price'
                                                            money='$'
                                                            value={String(item.price)}
                                                            setValue={handleSetPrice}
                                                        />
                                                    </TableCell>
                                                    <TableCell align='left' onClick={() => setProductItem(item)}>
                                                        {/* edit form  */}
                                                        <EditForm
                                                            index={index}
                                                            name='amount'
                                                            value={String(item.amount)}
                                                            setValue={handleSetAmount}
                                                        />
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
                                                    <TableCell align='left'>
                                                        {moment(new Date(Number(item.arrivalDate * 1000)).getTime()).format('ll')}
                                                    </TableCell>
                                                    <TableCell align='right' sx={{ display: 'flex', alignItems: 'center'}}>
                                                        <IconButton
                                                            color='inherit'
                                                            onClick={() => handleClickRemove(item)}
                                                        >
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
                                        page={page}
                                        count={totalPage}
                                        onChange={(e, value) => handleChangePage(e, value)}
                                        variant="outlined"
                                        shape="rounded"
                                        color='primary'
                                    />
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '20px'}}>
                                        <span style={{ color: '#fff' }}>{recordsTotal} items</span>
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
                                                    onUpdate(activeIndex, productItem as IProductData);
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
                            </TableContainer>
                        </Box>
                        <Box
                            sx={{
                                backgroundColor: '#323259',
                                padding: '10px 30px',
                                position: 'sticky',
                                bottom: '0px',
                                boxShadow: '0 0 13px 0 #b18aff',
                                borderStyle: 'solid',
                                borderColor:'#323259',
                                borderImage: 'initial',
                                zIndex: 2,
                                width: '100%', 
                            }}
                        >
                            <Button
                                variant='contained'
                                color='warning'
                                onClick={() => {
                                    !isRemove ? setShowSaveDialog(true) : setShowRemoveDialog(true)
                                }}
                            >
                                {!isRemove ? 'save changes' : 'remove selected'}
                            </Button>
                            <Button variant='contained' color='warning' sx={{ marginLeft: '20px' }}>
                                {!isExported ? 'export all: csv' : 'export selected: csv'}
                            </Button>
                        </Box>
                        {!isRemove ?
                            <CustomDialog
                                open={showSaveDialog}
                                title='Confirm Update'
                                content={<Typography variant='body1'>Do you want to update this product?</Typography>}
                                actions={
                                    <Box width='100%' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Button
                                            variant='contained'
                                            sx={{ marginRight: '1rem' }}
                                            onClick={() => {
                                                onUpdate(activeIndex, productItem as IProductData);
                                                setShowSaveDialog(false)
                                            }}
                                        >
                                            yes
                                        </Button>
                                        <Button variant='outlined' onClick={() => setShowSaveDialog(false)}>no</Button>
                                    </Box>
                                }
                            /> :
                            <CustomDialog
                                open={showRemoveDialog}
                                title='Confirm Delete Product'
                                content={<Typography variant='body1'>Do you want to delete this product?</Typography>}
                                actions={
                                    <Box width='100%' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Button
                                            variant='contained'
                                            sx={{ marginRight: '1rem' }}
                                            onClick={() => {
                                                onDelete(productItem?.id);
                                                setShowRemoveDialog(false);
                                                setIsRemove(false);
                                            }}
                                        >
                                            yes
                                        </Button>
                                        <Button variant='outlined' onClick={() => setShowRemoveDialog(false)}>no</Button>
                                    </Box>
                                }
                            />
                        }
                </div>
            }
        </>
    );
}

export default React.memo(ProductTable);