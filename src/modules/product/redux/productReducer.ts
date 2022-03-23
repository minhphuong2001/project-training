import { createCustomAction, ActionType, getType } from 'typesafe-actions';
import { IProductFilter, IProductList } from './../../../models/product';

export interface ProductState {
    products: IProductList;
    filter?: IProductFilter;
}

export const setProductData = createCustomAction('products/setProductData', (data: IProductList) => ({ data }));

export const setProductFilter = createCustomAction('product/setProductFilter', (data: IProductFilter) => ({ data }));
 
const actions = { setProductData, setProductFilter };

type Action = ActionType<typeof actions>;

export default function reducer(state: ProductState = {
    products: {
        user: { login: '', profile_id: '' },
        recordsTotal: 0,
        recordsFiltered: 0,
        data: []
    },
}, action: Action) {
    switch (action.type) {
        case getType(setProductData):
            return {
                ...state,
                products: action.data
            }
        case getType(setProductFilter):
            return {
                ...state,
                filter: action.data
            }
        default:
            return state;
    }
}