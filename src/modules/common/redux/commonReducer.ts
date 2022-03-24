import { ActionType, createCustomAction, getType } from 'typesafe-actions';
import { ICountryData, IStateData } from '../../../models/commonData';

export interface CommonState {
    countries: ICountryData[];
    states: IStateData[];
}

export const setCountries = createCustomAction('auth/setCountries', (data: ICountryData) => ({
    data,
}));

export const setStates = createCustomAction('auth/setStates', (data: ICountryData) => ({
    data,
}));


const actions = { setCountries, setStates };

type Action = ActionType<typeof actions>;

export default function reducer(state: CommonState = { countries: [], states: [] }, action: Action) {
    switch (action.type) {
        case getType(setCountries):
            return { ...state, countries: action.data };
        case getType(setStates):
            return { ...state, states: action.data };
        default:
            return state;
    }
}
