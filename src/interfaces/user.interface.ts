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

export interface IUpdateOneUserBalanceInput {
  _id: string;
  balanceUSD: number;
  balanceTHB: number;
}
