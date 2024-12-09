import BigNumber from "bignumber.js";

export default class SafeCalc {
  static add(num1, num2, fixnumber) {
    if(fixnumber !== undefined) {
      return (new BigNumber(num1).plus(num2)).toFixed(fixnumber);
    }
    return (new BigNumber(num1).plus(num2)).toFixed();
  }

  static sub(num1, num2, fixnumber) {
    if(fixnumber !== undefined) {
      return (new BigNumber(num1).minus(num2)).toFixed(fixnumber);
    }
    return (new BigNumber(num1).minus(num2)).toFixed();
  }

  static mul(num1, num2, fixnumber) {
    if(fixnumber !== undefined) {
      return (new BigNumber(num1).multipliedBy(num2)).toFixed(fixnumber);
    }
    return (new BigNumber(num1).multipliedBy(num2)).toFixed();
  }

  static div(num1, num2, fixnumber) {
    if(fixnumber !== undefined) {
      return (new BigNumber(num1).dividedBy(num2)).toFixed(fixnumber);
    }
    return (new BigNumber(num1).dividedBy(num2)).toFixed();
  }
  static formatMoney(num, fixNumber = 2) {
    return new BigNumber(num).toFormat(fixNumber);
  }
  // 比较大小
  // 返回-1:小于，0:等于，1:大于
  static compare(num1, num2) {
    return new BigNumber(num1).comparedTo(num2).toString();
  }

  // 获取两个数中小的
  static min(numList) {
    return BigNumber.min(...numList).toString();
  }
  // 获取两个数中大的
  static max(numList) {
    return BigNumber.max(...numList).toString();
  }

  // 四舍五入
  static round(num, fixNumber = 2) {
    return new BigNumber(num).toFixed(fixNumber);
  }
}
