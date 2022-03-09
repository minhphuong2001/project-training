import { createCustomAction, ActionType, getType } from 'typesafe-actions';
import { IVendorData } from '../../../models/user';

export interface VendorState {
    vendors: IVendorData[];
}

export const setVendors = createCustomAction('vendors/setVendors', (data: IVendorData[]) => ({
    data
}))

const actions = { setVendors };

type Action = ActionType<typeof actions>;

export default function reducer(state: VendorState = { vendors: [] }, action: Action) {
    switch (action.type) {
        case getType(setVendors):
            return {
                ...state,
                vendors: action.data
            }
        default:
            return state;
    }
}