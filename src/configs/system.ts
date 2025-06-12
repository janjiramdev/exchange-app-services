export default () => ({
  jwt: {
    accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
    accessTokenExpireTime: process.env.JWT_ACCESS_TOKEN_EXPIRE_TIME,
    refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
    refreshTokenExpireTime: process.env.JWT_REFRESH_TOKEN_EXPIRE_TIME,
  },
  sales: {
    exchangeRateUSDtoTHB: process.env.EXCHANGE_RATE_USD_TO_THB,
    exchangeRateTHBtoUSD: process.env.EXCHANGE_RATE_THB_TO_USD,
  },
});
