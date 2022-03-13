export interface IProductData {
    id: number | string;
    sku: string;
    price: number|string,
    enabled: number,
    weight: number,
    arrivalDate: number,
    name: string;
    description: string;
    created: number,
    vendor: string;
    vendorID: number;
    amount: number|string;
    participateSale: number;
    category: string;
    condition: string;
}

export interface IProductList {
    user: boolean;
    recordsTotal: number;
    recordsFiltered: number;
    data: IProductData[];
}

export interface IProductDetail {
    id: number | string;
    vendor_id: string;
    name: string;
    sku: string;
    sort_description: string;
    description: string;
    enabled: number;
    quantity: number;
    price: number;
    participate_sale: number;
    sale_price: number;
    tax_exempt: number;
    arrivalDate: Date | string;
    facebook_marketing_enabled: boolean;
    google_feed_enabled: boolean;
    og_tags_type: number;
    meta_desc_type: string;
    meta_keywords: string;
    meta_description: string;
    product_page_title: string;
    code: string;
    weight: number;
    inventory_tracking: number;
    og_tags: string;
    sale_price_type: string;
    cleanURL: string;
    brand_id: string;
    condition_id: string;
    shipping: IShipping[];
    categories: ICategory[];
    images: IImage[];
    memberships: [];
}

export interface IShipping {
    id: number | string;
    zone_name: string;
    price: number;
}

export interface ICategory {
    category_id: string;
    name: string;
}

export interface IImage {
    id: string;
    file: string;
    thumbs: Array<string>;
}