
export interface ILoginData {
  login: string;
  password: string;
}

export interface IJwtPayload {
  expiration: number;
  studentId: number;
  refresh: boolean;
}

export interface IUser {
  studentId: number;
  userName: string;
  jwtToken: string;
}