export interface IInsertOneUserInput {
  username: string;
  password: string;
}

export interface IUpdateOneUserRefreshTokenInput {
  id: string;
  refreshToken: string;
}
