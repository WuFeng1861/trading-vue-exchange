// 税收阶梯
let taxLadder = [
  {level: 0, rate: 0, output: 20},
  {level: 1, rate: 1, output: 50},
  {level: 2, rate: 2, output: 100},
  {level: 3, rate: 3, output: 200},
  {level: 4, rate: 5, output: 300},
  {level: 5, rate: 10, output: 500},
  {level: 6, rate: 15, output: 1000},
  {level: 7, rate: 20, output: '100亿'},
];
// 挖矿算力与总产量阶梯
let mintRateLadder = [
  {level: 0, mintRate: 32, output: "100万"},
  {level: 1, mintRate: 16, output: "1000万"},
  {level: 2, mintRate: 8, output:  "5000万"},
  {level: 3, mintRate: 4, output: "1亿"},
  {level: 4, mintRate: 2, output: "10亿"},
  {level: 5, mintRate: 1, output: "100亿"},
];

export const useTaxLadder = () => {
  return taxLadder;
}
export const useTaxList = () => {
  return taxLadder.map(item => item.rate);
}
export const useTaxOutputList = () => {
  return taxLadder.map(item => item.output);
}

export const useMintRateLadder = () => {
  return mintRateLadder;
}
export  const useMintRateList = () => {
  return mintRateLadder.map(item => item.mintRate);
}
export const useMintRateOutputList = () => {
  return mintRateLadder.map(item => item.output);
}
