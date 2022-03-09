import { valuesIn } from "lodash";
import { StringLocale } from "yup/lib/locale";

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
