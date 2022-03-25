import React, { useEffect, useMemo, useState } from 'react';
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
import { DeleteOutline } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { CustomDialog } from '../../../components/Dialog/CustomDialog';
import { ROUTES } from '../../../configs/routes';
import { AppState } from '../../../redux/reducer';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'typesafe-actions';
import { fetchThunk } from '../../common/redux/thunk';
import { API_PATHS } from '../../../configs/api';
import { IUserData } from '../../../models/user';
import moment from 'moment'

export interface UserTableProps {
    users: IUserData[];
    onDelete: (id: string) => void;
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

function UserTable({ users, onDelete }: UserTableProps) {
    const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
    const [rowsPerPage, setRowsPerPage] = useState('25');
    const { items, requestSort, sortConfig } = useSortTableData(users);
    const { recordsTotal } = useSelector((state: AppState) => state.user.users);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(10);
    const [limitUserData, setLimitUserData] = useState<IUserData[]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const [isCheckAll, setIsCheckAll] = useState(false);
    const [selected, setSelected] = useState<any[]>([]);
    const [isOpacity, setIsOpacity] = useState(false);
    const [userItem, setUserItem] = useState<IUserData>();
    const [isRemove, setIsRemove] = useState(false);
    const [showRemoveDialog, setShowRemoveDialog] = useState(false);

    useEffect(() => {
        setLimitUserData([...items]);
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
        const response = await dispatch(fetchThunk(`${API_PATHS.userAdmin}/list`, 'post', { page: value, count: +rowsPerPage, search: '' }));

        setIsLoading(false);
        setPage(value);
        setLimitUserData(response?.data);
    }

    // select all checkbox
    const handleSelectAll = (e: any) => {
        setIsCheckAll(!isCheckAll);
        setSelected(limitUserData.map(a => a.profile_id));
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
        setUserItem(item);
        setIsOpacity(!isOpacity);
        setIsRemove(!isRemove);
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
                                                    onClick={() => {
                                                        setIsRemove(!isRemove);
                                                        setIsOpacity(!isOpacity);
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell
                                                align='left'
                                                sx={{ fontWeight: 600, cursor: 'pointer', minWidth: '300px' }}
                                                onClick={() => requestSort('vendor')}
                                                className={getClassName('vendor')}
                                            >
                                                Login/Email
                                            </TableCell>
                                            <TableCell
                                                align='left'
                                                sx={{ fontWeight: 600, cursor: 'pointer', minWidth: '250px' }}
                                                onClick={() => requestSort('fistName')}
                                                className={getClassName('fistName')}
                                            >
                                                Name
                                            </TableCell>
                                            <TableCell
                                                align='left'
                                                sx={{ fontWeight: 600, cursor: 'pointer', minWidth: '150px' }}
                                                onClick={() => requestSort('access_level')}
                                                className={getClassName('access_level')}
                                            >
                                                Access Level
                                            </TableCell>
                                            <TableCell
                                                align='left'
                                                sx={{ fontWeight: 600, minWidth: '100px' }}
                                            >
                                                Product
                                            </TableCell>
                                            <TableCell
                                                align='left'
                                                sx={{ fontWeight: 600, width: '100px' }}
                                            >
                                                Order
                                            </TableCell>
                                            <TableCell
                                                align='left'
                                                sx={{ fontWeight: 600, width: '100px' }}
                                            >
                                                Wishlist
                                            </TableCell>
                                            <TableCell
                                                align='left'
                                                sx={{ fontWeight: 600, minWidth: '170px' }}
                                                onClick={() => requestSort('created')}
                                                className={getClassName('created')}
                                            >
                                                Created
                                            </TableCell>
                                            <TableCell
                                                align='left'
                                                sx={{ fontWeight: 600, minWidth: '170px' }}
                                                onClick={() => requestSort('last_login')}
                                                className={getClassName('last_login')}
                                            >
                                                Last Login
                                            </TableCell>
                                            <TableCell align='right'></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {limitUserData.slice(0, +rowsPerPage).map((item, index: number) => {
                                            return (
                                                <TableRow
                                                    key={index}
                                                    sx={{
                                                        '&:last-child td, &:last-child th': { border: 0 },
                                                        opacity: (item.profile_id == userItem?.profile_id && isOpacity) ? 0.6 : 1
                                                    }}
                                                >
                                                    <TableCell sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                                        <Checkbox
                                                            {...label}
                                                            size='small'
                                                            id={item.profile_id}
                                                            checked={selected.includes(item.profile_id)}
                                                            onChange={handleClickCheckbox}
                                                            onClick={() => handleClickRemove(item)}
                                                        />
                                                        <span>|</span>
                                                    </TableCell>
                                                    <TableCell align='left'>
                                                        <Link to={`${ROUTES.user}/user-detail/${item.profile_id}`}>
                                                            <Typography variant='body2' sx={{ color: '#007bff!important', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                                                                {item.vendor}
                                                            </Typography>
                                                        </Link>
                                                        <span>{item.storeName}</span>
                                                    </TableCell>
                                                    <TableCell align='left'
                                                        sx={{
                                                            color: '#007bff!important',
                                                            cursor: 'pointer',
                                                            '&:hover': {
                                                                textDecoration: 'underline'
                                                            }
                                                        }}>
                                                        {item.fistName} {item.lastName}
                                                    </TableCell>
                                                    <TableCell align='left'>{item.access_level}</TableCell>
                                                    <TableCell
                                                        align='left'
                                                        sx={{ fontWeight: 600 }}
                                                    >
                                                        {item.product}
                                                    </TableCell>
                                                    <TableCell align='left'>{item.order.order_as_buyer}</TableCell>
                                                    <TableCell align='left'>{item.wishlist}</TableCell>
                                                    <TableCell align='left'>{moment(new Date(Number(item.created * 1000)).getTime()).format('lll')}</TableCell>
                                                    <TableCell align='left'>{moment(new Date(Number(item.last_login * 1000)).getTime()).format('lll')}</TableCell>
                                                    <TableCell align='right' sx={{ display: 'flex', alignItems: 'center' }}>
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
                                sx={{ opacity: isRemove ? 1 : 0.6 }}
                                onClick={() => {
                                    isRemove ? setShowRemoveDialog(true) : null
                                }}
                            >
                                remove selected
                            </Button>
                        </Box>
                        {isRemove ?
                            <CustomDialog
                                open={showRemoveDialog}
                                title='Confirm Delete User'
                                content={<Typography variant='body1'>Do you want to delete this user?</Typography>}
                                actions={
                                    <Box width='100%' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Button
                                            variant='contained'
                                            sx={{ marginRight: '1rem' }}
                                            onClick={() => {
                                                onDelete(userItem?.profile_id as string);
                                                setShowRemoveDialog(false);
                                                setIsRemove(false);
                                            }}
                                        >
                                            yes
                                        </Button>
                                        <Button variant='outlined' onClick={() => setShowRemoveDialog(false)}>no</Button>
                                    </Box>
                                }
                            /> : null
                        }
                </div>
            }
        </>
    );
}

export default React.memo(UserTable);