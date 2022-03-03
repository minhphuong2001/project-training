import { createCustomAction, ActionType, getType } from 'typesafe-actions';
import { IShippingData } from '../../../models/category';

export interface ShippingState {
    shippings: IShippingData[];
}

export const setShippingData = createCustomAction('shippings/setShippingData', (data: IShippingData[]) => ({
    data
}))

const actions = { setShippingData };

type Action = ActionType<typeof actions>;

export default function reducer(state: ShippingState = { shippings: [] }, action: Action) {
    switch (action.type) {
        case getType(setShippingData):
            return {
                ...state,
                shippings: action.data
            }
        default:
            return state;
    }
}