export default {
  MINT_POOL_URL: import.meta.env.VITE_MINT_URL,
  EXCHANGE_URL: import.meta.env.VITE_EXCHANGE_URL,
  EXCHANGE_RECHARGE_WITHDRAW_URL: import.meta.env.VITE_EXCHANGE_RECHARGE_WITHDRAW_URL,
  USER_URL: import.meta.env.VITE_USER_URL,
  WEBSOCKET_URL: import.meta.env.VITE_WEBSOCKET_URL,
  // MINT_POOL_URL: "http://127.0.0.1:51000",
  // USER_URL: "http://127.0.0.1:52001",
  RETRY_TIMES: 4,
  RETRY_DELAY: 1000,
  TIME_OUT: 6*1000,
  FAQ_URL: 'https://mercurytoken.gitbook.io/mercury-fqa/',
  // 开盲盒费用
  OPEN_BOX_FEE: 0.002,
  // 合约地址
  CONTRACT_ADDRESS: "0x47eFD83ceB4eacB14A156F7c9F522C22DeD83A86",
  SIGN_WORD: "Mercury: Start mining",
  BIND_ADDRESS_SIGN_WORD: "Mercury: Bind address",

  // 订单id展示前缀
  ORDER_ID_PREFIX: "MERCURY-2024185940",
};
