import { createCustomAction, ActionType, getType } from 'typesafe-actions';
import { IProductData, IProductList } from './../../../models/product';

export interface ProductState {
    products: IProductList;
}

export const setProductData = createCustomAction('products/setProductData', (data: IProductList) => ({
    data
}))

const actions = { setProductData };

type Action = ActionType<typeof actions>;

export default function reducer(state: ProductState = { products: {user: false, recordsTotal: 0, recordsFiltered: 0, data: []} }, action: Action) {
    switch (action.type) {
        case getType(setProductData):
            return {
                ...state,
                products: action.data
            }
        default:
            return state;
    }
}