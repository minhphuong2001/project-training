import React, { useCallback, useEffect, useState } from 'react'
import { Box, Button, CircularProgress, Typography } from '@mui/material'
import ProductSearch from '../components/ProductSearch'
import ProductTable from '../components/ProductTable'
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from '../../../redux/reducer';
import { Action } from 'typesafe-actions';
import { fetchThunk } from '../../common/redux/thunk';
import { API_PATHS } from '../../../configs/api';
import { IProductData } from '../../../models/product';
import { setProductData } from '../redux/productReducer';
import { useHistory } from 'react-router';
import { setCategoryData } from '../redux/categoryReducer';

export default function ProductPage() {
    const history = useHistory();
    const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
    const { products } = useSelector((state: AppState) => state.product);
    const [productList, setProductList] = useState<IProductData[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const getProductList = useCallback(async () => {
        setIsLoading(true);
        const response = await dispatch(fetchThunk(API_PATHS.productList, 'get'));
        
        setIsLoading(false);
        dispatch(setProductData(response?.data));
    }, [dispatch])

    useEffect(() => {
        getProductList();
    }, [getProductList])

    useEffect(() => {
        setProductList([...products]);
    }, [products])

    const getCategoryList = useCallback(async () => {
        const response = await dispatch(fetchThunk(API_PATHS.category, 'get'));
        
        if (response?.success === true) {
            dispatch(setCategoryData(response?.data));
        }
    }, [dispatch])

    useEffect(() => {
        getCategoryList();
    }, [getCategoryList])

    return (
        <Box>
            <Typography mb={2} variant='h5' sx={{ color: '#fff' }} >
                Products
            </Typography>
            {/* search product */}
            <ProductSearch />
            <Button
                variant='contained'
                color='secondary'
                sx={{ margin: '24px 0' }}
                onClick={() => history.push('/pages/products/new-product')}
            >
                add product
            </Button>
            {/* product table */}
            {
                isLoading ? <Box style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '70vh'
                }}>
                    <CircularProgress size={48} />
                </Box> :
                <>
                    <ProductTable products={productList} />
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
                        <Button variant='contained' color='warning'>
                            save changes
                        </Button>
                        <Button variant='contained' color='warning' sx={{ marginLeft: '20px' }}>
                            export all: csv
                        </Button>
                    </Box>
                </>
            }
        </Box>
    )
}