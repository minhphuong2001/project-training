import React, { useCallback, useEffect, useState } from 'react'
import { ArrowBack } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import { Box } from '@mui/system';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router'
import { toast, ToastContainer } from 'react-toastify';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'typesafe-actions';
import { API_PATHS } from '../../../configs/api';
import { ROUTES } from '../../../configs/routes';
import { IProductDetail } from '../../../models/product';
import { AppState } from '../../../redux/reducer';
import { ACCESS_TOKEN_KEY } from '../../../utils/constants';
import { fetchThunk } from '../../common/redux/thunk';
import ProductDetail from '../components/ProductDetail';

export default function ProductDetailPage() {
    const { id }: any = useParams();
    const history = useHistory();
    const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
    const [productDetail, setProductDetail] = useState<IProductDetail>();
    const { brands } = useSelector((state: AppState) => state.brand);
    const [isLoading, setIsLoading] = useState(false);
    
    const getProductDetail = useCallback(async () => {
        setIsLoading(true);
        const response = await dispatch(fetchThunk(`${API_PATHS.productAdmin}/detail`, 'post', { id: id }));

        setIsLoading(false);
        if (response?.success === true) {
            setProductDetail(response?.data);
        }
    }, [dispatch, id]);

    const onUploadFile = async (file: File, productId: string, order: string) => {
        const formData = new FormData();
        formData.append('images', file);
        formData.append('productId', productId);
        formData.append('order', order);

        await axios.post(API_PATHS.uploadImage, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: Cookies.get(ACCESS_TOKEN_KEY) || '',
            }
        });
    }

    const handleUpdateProduct = async (data: any, files: Array<File>) => {
        try {
            // setIsLoading(true);
            const values = {
                id: id,
                vendor_id: data.vendor_id,
                brand_id: data.brand.value,
                condition_id: data.condition,
                name: data.name,
                categories: data.categories.map((value: any) => value?.value),
                description: data.description,
                enabled: 1,
                memberships: data.memberships,
                shipping_to_zones: data.shipping.map((value: any) => {
                    return {id: value.id, price: value.price}
                }),
                tax_exempt: data.tax_exempt,
                price: data.price,
                sale_price_type: '$',
                sale_price: data.sale_price,
                arrival_date: data.arriveDate,
                inventory_tracking: 0,
                quantity: data.quantity,
                sku: data.sku,
                participate_sale: 1,
                og_tags_type: 0,
                og_tags: '',
                enableOffers: 1,
                meta_description: data.meta_description,
                meta_keywords: data.meta_keywords,
                product_page_title: data.product_page_title,
                facebook_marketing_enabled: data.facebook_marketing_enabled === false ? 0 : 1,
                google_feed_enabled: data.google_feed_enabled === false ? 0 : 1,
                imagesOrder: data.imagesOrder,
                deleted_images: []
            }
            console.log('values: ',values.imagesOrder);

            const formData = new FormData();
            formData.append('productDetail', JSON.stringify(values));

            const response = await axios.post(`${API_PATHS.productAdmin}/create`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: Cookies.get(ACCESS_TOKEN_KEY) || '',
                }
            });
            // setIsLoading(false);

            if (response.data?.success === true) {
                const productId = response.data?.data;

                await Promise.all(files.map(async (file, index) => {
                    await onUploadFile(file, productId, index.toString());
                }));

                toast.success('Update product successfully');
            } else {
                toast.error(response.data?.errors ? response.data?.errors : 'Something went wrong.');
            }
        } catch (error: any) {
            console.log(error?.message);
        }
    }

    useEffect(() => {
        getProductDetail();
    }, [getProductDetail])

    return (
        <div>
            <Box
                mb={2}
                sx={{
                    backgroundColor: '#fff',
                    color: '#000',
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                }}
                onClick={() => history.push(`${ROUTES.product}/manage-products`)}
            >
                <ArrowBack />
            </Box>
            {isLoading ?
                <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
                    <CircularProgress size={48} />
                </Box> :
                <ProductDetail
                    product={productDetail as IProductDetail}
                    brand={brands}
                    onUpdateProduct={handleUpdateProduct}
                />
            }
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
        </div>
    )
}