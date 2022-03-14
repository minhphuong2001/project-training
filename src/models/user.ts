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
export interface IUserProfileDetail {
  info: {
    income: number;
    expense: number;
    earning: number;
    order_as_buyer: number;
    order_as_buyer_total: number;
    products_total: number;
    profile_id: number | string;
    default_card_id: number | string;
    taxExempt: number | string;
    paymentRailsType: string;
    paymentRailsId: string;
    firstName: string;
    lastName: string;
    email: string;
    access_level: string;
    joined: number;
    first_login: number;
    last_login: number;
    status: string;
    membership_id: string;
    pending_membership_id: string;
    language: string;
    forceChangePassword: number;
    referer: string;
    statusComment: string;
    roles: string[];
    companyName: string;
    vendor_id: number | string;

  },
  account_status: {
    "E": "Enabled",
    "D": "Disabled",
    "U": "Unapproved vendor"
  },
  account_role: AccountRole[];
}

interface AccountRole {
  id: number | string;
  name: string;
}