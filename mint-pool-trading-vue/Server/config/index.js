export const config = {
  HTTP_PORT: 51000,
  EMAIL_API: "http://124.222.220.135:52100",
  // USER_API: "http://124.222.220.135:52001",
  USER_API: "http://127.0.0.1:52001",
  // COIN_PRICE_API: "http://127.0.0.1:52000/blockchain",
  COIN_PRICE_API: "http://124.222.220.135:52000/blockchain",
  GROUP_MINT_RATIO: 0.1,
  PER_MINT_TIME: 24, // 每次用户挖矿的时间/小时
  OPEN_BOX_TIMES: 1000000000, // 每天开盲盒次数
  OPEN_BOX_FEE: 0.002, // 开盲盒的费用
  // 2秒间隔
  TIMER_INTERVAL_TRAN: 2,
  // 链的providerUrl
  PROVIDER_URL: 'https://rpc.ankr.com/bsc',
  // PROVIDER_URL: 'https://mainnet.optimism.io',
  // 链的起始高度
  CHAIN_START_BLOCK: 37585729,
  // 合约地址
  CONTRACT_ADDRESS: "0x47eFD83ceB4eacB14A156F7c9F522C22DeD83A86",
  SIGN_WORD: "Mercury: Start mining",
  BIND_ADDRESS_SIGN_WORD: "Mercury: Bind address",
  EMAIL_SEND_TIMES_LIMIT: 3, // 单账号单功能发送邮件次数限制
};
