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
import { IProductData, IProductFilter } from '../../../models/product';
import { setProductData } from '../redux/productReducer';
import { useHistory } from 'react-router';
import { setCategoryData } from '../redux/categoryReducer';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import { ACCESS_TOKEN_KEY } from '../../../utils/constants';
import { setBrandData } from '../redux/brandReducer';
import { setShippingData } from '../redux/shippingReducer';
import axios from 'axios';
import { setVendors } from '../../user/redux/vendorReducer';
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

export default function ProductPage() {
    const history = useHistory();
    const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
    const { products } = useSelector((state: AppState) => state.product);
    const [productList, setProductList] = useState<IProductData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const getProductList = useCallback(async () => {
        setIsLoading(true);
        const response = await dispatch(fetchThunk(API_PATHS.productList, 'post'));
        
        setIsLoading(false);
        dispatch(setProductData(response));
    }, [dispatch])

    const getCategoryList = useCallback(async () => {
        const response = await dispatch(fetchThunk(API_PATHS.category, 'get'));
        
        if (response?.success === true) {
            dispatch(setCategoryData(response?.data));
        }
    }, [dispatch])

    const getBrandList = useCallback(async () => {
        const response = await dispatch(fetchThunk(`${API_PATHS.brand}/list`, 'get'));

        if (response?.success === true) {
            dispatch(setBrandData(response?.data));
        }
    }, [dispatch]);

    const getShippingList = useCallback(async () => {
        const response = await dispatch(fetchThunk(API_PATHS.shipping, 'get'));
        
        if (response?.success === true) {
          dispatch(setShippingData(response?.data));
        }
      }, [dispatch])
    
    const getVendorList = useCallback(async () => {
        const response = await dispatch(fetchThunk(API_PATHS.vendors, 'get'));
        
        if (response?.success === true) {
          dispatch(setVendors(response?.data));
        }
      }, [dispatch])
    
    useEffect(() => {
        getProductList();
    }, [getProductList])

    useEffect(() => {
        getCategoryList();
    }, [getCategoryList])

    useEffect(() => {
        getBrandList();
    }, [getBrandList])
    
    useEffect(() => {
        getVendorList();
    }, [getVendorList])

    useEffect(() => {
        getShippingList();
    }, [getShippingList])

    const onSearch = async (data: any) => {
        const values = {
            search: data.search,
            category: data.category,
            availability: data.availability,
            vendor: data.vendor.value,
            stock_status: data.stock_status,
            search_type: data.search_type?.search_type,
            sort: 'name',
            order_by: 'ASC',
            page: 1,
            count: 25
        }
        try {
            setIsLoading(true);
            const response = await dispatch(fetchThunk(API_PATHS.productList, 'post', values));

            setIsLoading(false);
            if (response?.data === false) {
                setProductList([]);
            } else {
                dispatch(setProductData(response));
            }
        } catch (error: any) {
            console.log(error.message);
        }
    }

    const handleRemove = useCallback(async (id: any) => {
        try {
            setIsLoading(true);
            await dispatch(fetchThunk(`${API_PATHS.productAdmin}/edit`, 'post', { params: [{ id: id, delete: 1 }] }));

            setIsLoading(false);
            // setProductList([...products.data.filter(a => a.id !== id)]);
            getProductList();
            toast.success('Delete successfully');
        } catch (error: any) {
            console.log(error.message);
        }
    }, [dispatch, getProductList])

    const handleUpdate = async (index: number, values: any) => {
        try {
            setIsLoading(true);
            const formData = new FormData();
            formData.append('productDetail', `${JSON.stringify({
                // id: values.id,
                vendor_id: values.vendorID,
                name: values.name,
                quantity: values.amount,
                price: values.price,
            })}`);

            const response = await axios.post(`${API_PATHS.productAdmin}/create`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: Cookies.get(ACCESS_TOKEN_KEY) || '',
                }
            })
            getProductList();

            setIsLoading(false);
            if (response.data?.success === true) {
                toast.success('Update successfully');
            }
        } catch (error: any) {
            console.log(error?.message);
        }
    }   
    
    const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";

    const handleExportFileCSV = (dataApi: any, fileName: string) => {
        const ws = XLSX.utils.json_to_sheet(dataApi);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    }
        
    useEffect(() => {
        setProductList([...products?.data]);
    }, [products])

    return (
        <Box>
            <Typography mb={2} variant='h5' sx={{ color: '#fff' }}>
                Products
            </Typography>
            {/* search product */}
            <ProductSearch onSearch={onSearch} />
            
            <Button
                variant='contained'
                color='secondary'
                sx={{ margin: '24px 0' }}
                onClick={() => history.push('/pages/products/new-product')}
            >
                add product
            </Button>

            {/* product table */}
            {isLoading ?
                <Box style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '70vh'
                }}>
                    <CircularProgress size={48} />
                </Box> :
                <>
                    <ProductTable
                        products={productList}
                        onDelete={handleRemove}
                        onUpdate={handleUpdate}
                        onExportFile={handleExportFileCSV}
                    />
                    <ToastContainer
                        position="top-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    />
                </>
            }
        </Box>
    )
}