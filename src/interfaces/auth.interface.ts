export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface IAuthTokenDetail {
  sub: string;
  username: string;
  iat?: number;
  exp?: number;
}
