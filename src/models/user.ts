export interface AuthToken {
  accessToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface UserParams {
  profile_id: string;
  login: string;
  firstName: string;
  lastName: string;
  dateOfLoginAttempt: string;
  countOfLoginAttempts: string;
  forceChangePassword: string
}

export interface IUser  {
  user: UserParams;
  user_cookie: string;
}

export interface IVendorData {
  id: string;
  companyName: string;
  login: string;
  name: string;
}

export interface IUserData {
  profile_id: string;
  vendor: string;
  fistName: string;
  lastName: string;
  created: number;
  last_login: number;
  access_level: string;
  vendor_id: string | number;
  storeName: string;
  product: number;
  order: {
    order_as_buyer: number;
    order_as_buyer_total: number;
  };
  wishlist: number;
}
export interface IUserDataList {
  user: {
    profile_id: string;
    login: string;
  };
  data: IUserData[];
  recordsTotal: number;
  recordsFiltered: number;
}