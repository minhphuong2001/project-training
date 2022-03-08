import { ArrowBack } from '@mui/icons-material';
import { Box } from '@mui/system';
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router'
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'typesafe-actions';
import { API_PATHS } from '../../../configs/api';
import { ROUTES } from '../../../configs/routes';
import { IProductDetail } from '../../../models/product';
import { AppState } from '../../../redux/reducer';
import { fetchThunk } from '../../common/redux/thunk';
import ProductDetail from '../components/ProductDetail';

export default function ProductDetailPage() {
    const { id }: any = useParams();
    const history = useHistory();
    const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
    const [productDetail, setProductDetail] = useState<IProductDetail>();
    const { brands } = useSelector((state: AppState) => state.brand);
    
    const getProductDetail = useCallback(async () => {
        const response = await dispatch(fetchThunk(`${API_PATHS.productAdmin}/detail`, 'post', { id: id }));

        if (response?.success === true) {
            setProductDetail(response?.data);
        }
    }, [dispatch, id]);

    useEffect(() => {
        getProductDetail();
    }, [getProductDetail])

    return (
        <div>
            <Box
                mb={4}
                sx={{
                    backgroundColor: '#fff',
                    color: '#000',
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                onClick={() => history.push(`${ROUTES.product}/manage-products`)}
            >
                <ArrowBack />
            </Box>
            <ProductDetail product={productDetail as IProductDetail} brand={brands}/>
        </div>
    )
}