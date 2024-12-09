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

  // 进一法保留指定位数小数
  static ceil(num, fixNumber = 2) {
    return new BigNumber(num).decimalPlaces(fixNumber, BigNumber.ROUND_CEIL);
  }

  static formatMoney(num, fixNumber = 2) {
    return new BigNumber(num).toFormat(fixNumber);
  }
  // 比较大小
  // 返回-1:小于，0:等于，1:大于
  static compare(num1, num2) {
    return new BigNumber(num1).comparedTo(num2).toString();
  }
}
