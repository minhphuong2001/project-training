import { createCustomAction, ActionType, getType } from 'typesafe-actions';
import { ICategoryData } from '../../../models/category';

export interface CategoryState {
    categories: ICategoryData[];
}

export const setCategoryData = createCustomAction('categories/setCategoryData', (data: ICategoryData[]) => ({
    data
}))

const actions = { setCategoryData };

type Action = ActionType<typeof actions>;

export default function reducer(state: CategoryState = { categories: [] }, action: Action) {
    switch (action.type) {
        case getType(setCategoryData):
            return {
                ...state,
                categories: action.data
            }
        default:
            return state;
    }
}