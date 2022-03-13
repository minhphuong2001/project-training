import { IUserDataList } from './../../../models/user';
import { createCustomAction, ActionType, getType } from 'typesafe-actions';

export interface UserState {
    users: IUserDataList;
}

export const setUserData = createCustomAction('users/setUserData', (data: IUserDataList[]) => ({
    data
}))

const actions = { setUserData };

type Action = ActionType<typeof actions>;

export default function reducer(state: UserState = {
    users: {
        user: { profile_id: '', login: '' },
        data: [],
        recordsTotal: 0,
        recordsFiltered: 0
    }
}, action: Action) {
    switch (action.type) {
        case getType(setUserData):
            return {
                ...state,
                users: action.data
            }
        default:
            return state;
    }
}