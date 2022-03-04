export interface ICategoryData {
    id: string | number;
    parentId: string | number;
    name: string;
    path: string;
    pos: string | number;
}

export interface IShippingData {
    id: string | number;
    name: string;
}

export interface IFilterParams {
    page: number;
    count: number;
    search: string;
    category: number;
    stock_status: string;
    availability: 'all';
    vendor: '';
    sort: 'name';
    order_by: 'ASC' | 'DSC';
    search_type: '';
}