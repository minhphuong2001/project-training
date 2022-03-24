export interface ICountryData {
    code: string;
    currency_id: string;
    id: string;
    code3: string;
    enabled: number;
    active_currency?: string;
    is_fraudlent: boolean;
    country: string;
}

export interface IStateData {
    state_id: string;
    country_code: string;
    region_code: string;
    state: string;
    code: string;
}