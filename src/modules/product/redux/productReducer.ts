import { createCustomAction, ActionType, getType } from 'typesafe-actions';
import { IProductData } from './../../../models/product';

export interface ProductState {
    products: IProductData[];
}

export const setProductData = createCustomAction('products/setProductData', (data: IProductData[]) => ({
    data
}))

const actions = { setProductData };

type Action = ActionType<typeof actions>;

export default function reducer(state: ProductState = { products: [] }, action: Action) {
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