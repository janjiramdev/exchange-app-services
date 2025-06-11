export interface IUserInterface {
  _id: string;
  username: string;
}

export interface ICreateOneUserInput {
  username: string;
  password: string;
}

export interface IUpdateOneUserRefreshTokenInput {
  _id: string;
  refreshToken: string;
}
