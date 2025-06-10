export interface IUserInterface {
  _id: string;
  username: string;
}

export interface IInsertOneUserInput {
  username: string;
  password: string;
}

export interface IUpdateOneUserRefreshTokenInput {
  _id: string;
  refreshToken: string;
}
