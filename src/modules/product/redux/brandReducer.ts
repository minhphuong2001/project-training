import { createCustomAction, ActionType, getType } from 'typesafe-actions';
import { IBrandData } from '../../../models/brand';

export interface BrandState {
    brands: IBrandData[];
}

export const setBrandData = createCustomAction('brands/setBrandData', (data: IBrandData[]) => ({
    data
}))

const actions = { setBrandData };

type Action = ActionType<typeof actions>;

export default function reducer(state: BrandState = { brands: [] }, action: Action) {
    switch (action.type) {
        case getType(setBrandData):
            return {
                ...state,
                brands: action.data
            }
        default:
            return state;
    }
}