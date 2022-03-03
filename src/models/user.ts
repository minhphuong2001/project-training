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

// export interface IUser {
//   id: number;
//   email: string;
//   name: string;
//   gender: string;
//   avatar: string;
//   region: number;
//   state: number;
//   description: string;
//   createdAt: string;
//   updatedAt: string;
//   token: string;
// }
