import {md5} from 'js-md5';
import router from "@/route/index.js";
import dayjs from "dayjs";

// 去除对象的null或者undefined属性
export const clearObject = (obj) => {
  for (const key in obj) {
    if (obj[key] === undefined || obj[key] === null) {
      delete obj[key];
    }
  }
  return obj;
};

// 获取32位Md5
export const getMd5 = (str) => {
  return md5(str);
};

// 验证邮箱是否合法
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 验证手机号是否合法
export const validatePhone = (phone) => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
};

// 找好返回用户名和邮箱
export const explainAccount = (account) => {
  let username;
  let email;
  let mobile;
  let isEmail = validateEmail(account);
  let isMobile = validatePhone(account);
  if (isEmail) {
    return {username, email: account, mobile};
  }
  if (isMobile) {
    return {username, email, mobile: account};
  }
  return {username: account, email, mobile};
};

// 验证密码强度 最少需要数字和大小写字母同时存在
export const validatePassword = (password) => {
  // 正则表达式，匹配包含数字和大小写字母的密码，最少长度为6位
  let regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
  if (regex.test(password)) {
    return true;
  } else {
    return false;
  }
};

// 弹窗提示
export const elTip = (message, type = "success", showClose = true) => {
  ElMessage({
    message,
    showClose,
    type
  });
};

// 弹窗提示即将到来
export const elTipComingSoon = () => {
  ElMessage({
    message: "Coming soon...",
    showClose: true,
    type: "warning"
  });
};

// 路由跳转到指定name的路由
export const routerTo = (name, index) => {
  if (!name) {
    return;
  }
  router.push({name});
};
// 路由跳转到指定name的路由
export const routerToQuery = (name, params) => {
  console.log(name, params, 'routerToQuery')
  if (!name) {
    return;
  }
  router.push({name, query: params});
};
// 路由跳转到指定name的路由
export const routerToParams = (name, params) => {
  console.log(name, params, 'routerToParams')
  if (!name) {
    return;
  }
  router.push({name, params: params});
};
// 路由跳转到指定name的路由
export const routerToParamsQuery = (name, params, query) => {
  console.log(name, params, 'routerToParams')
  if (!name) {
    return;
  }
  router.push({name, params: params, query: query});
};

// 路由返回上级
export const routerBack = () => {
  router.go(-1);
}

// 获取url的query参数
export const getUrlQuery = () => {
  let url = window.location.href;
  // 通过 ? 分割获取后面的参数字符串
  let urlStr = url.split('?')[1]
  // 创建空对象存储参数
  let obj = {};
  // 判断是否有参数
  if (!urlStr) {
    return obj;
  }
  // 再通过 & 将每一个参数单独分割出来
  let paramsArr = urlStr.split('&')
  for (let i = 0, len = paramsArr.length; i < len; i++) {
    // 再通过 = 将每一个参数分割为 key:value 的形式
    let arr = paramsArr[i].split('=')
    obj[arr[0]] = arr[1];
  }
  return obj
};

// 刷新当前组件
export const refreshComponent = () => {
  router.go(0);
};

// 获取svg文件路径
export const getSvgPath = (name) => {
  return new URL(`../assets/svg/${name}.svg`, import.meta.url).href;
};
export const getSvgGreenPath = (name) => {
  return new URL(`../assets/svg/green/${name}.svg`, import.meta.url).href;
};
export const getSvgYellowPath = (name) => {
  return new URL(`../assets/svg/yellow/${name}.svg`, import.meta.url).href;
};

// 获取img文件路径
export const getImagePath = (assetPath) => {
  return new URL(`../assets/image/${assetPath}`, import.meta.url).href;
};
export const getImageYellowPath = (assetPath) => {
  return new URL(`../assets/image/yellow/${assetPath}`, import.meta.url).href;
};
export const getImageGreenPath = (assetPath) => {
  return new URL(`../assets/image/green/${assetPath}`, import.meta.url).href;
};
// 获取Layout图片路径
export const getLayoutPath = (assetPath) => {
  return new URL(`../assets/layout/${assetPath}`, import.meta.url).href;
};

// 预加载图片
export const preloadImage = (imageUrl) => {
  let images = new Image()
  images.src = imageUrl;
}

// 处理名称为6位之内
export const handleName = (name) => {
  if (name.length > 6) {
    return name.slice(0, 3) + "..." + name.slice(-3);
  }
  return name;
};

// 处理eth地址显示
export const handleAddress = (address) => {
  if (!address) {
    return "";
  }
  if (address.length > 10) {
    return address.slice(0, 6) + "..." + address.slice(-4);
  }
  return address;
};

// 处理eth地址在指定长度显示
export const handleAddressLength = (address, length) => {
  if (!address) {
    return "";
  }
  if (address.length > length) {
    return address.slice(0, 2 + Math.floor(length / 2)) + "..." + address.slice(Math.floor(length / 2) * -1);
  }
  return address;
};

// 获取今天0点和昨天0点的微秒时间戳 考虑跨月的时间点
export const getTodayAndYesterdayZeroTime = () => {
  let now = new Date();
  let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return {
    today: today.getTime(),
    yesterday: today.getTime() - 1000 * 60 * 60 * 24
  };
};

// 获取今天0点和本月1号0点的微秒时间戳
export const getTodayAndMonthZeroTime = () => {
  let now = new Date();
  let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let month = new Date(now.getFullYear(), now.getMonth(), 1);
  return {
    today: today.getTime(),
    month: month.getTime()
  };
};

// copy
export const copyToClipboard = (text) => {
  if (!text) {
    return elTip('复制内容不能为空！');
  }
  let textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
  elTip('复制成功！');
};

// copy OriginLink for register
export const copyOriginLink = (text) => {
  let textarea = document.createElement("textarea");
  textarea.value = `${window.location.origin}/register?inviter=${text}`;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
  elTip('复制成功！');
};

// 获取现在的时间戳
export const getNowTimeStamp = () => {
  return new Date().getTime();
};

// 获取历史七天的日期字符串，包括今天 格式为2024-03-09
export const getLastSevenDays = () => {
  let now = new Date();
  let days = [];
  for (let i = 0; i < 7; i++) {
    let date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    days.push(dayjs(date).format("YYYY-MM-DD"));
  }
  // console.log(days)
  return days.reverse();
};

// 获取今天的0点的时间戳
export const getTodayZero = () => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return today.getTime();
};

// sleep
export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// eth 黑洞地址
export const ethBlackHoleAddress = "0x0000000000000000000000000000000000000000";

// 限制el-input只能输入指定小数位数的数字
export const limitDecimal = (value, decimal) => {
  // 正则限制小数点后只能有decimal位, 并限制输入的字符只能是数字和小数点
  const regex = new RegExp(`^\\d+(\\.\\d{1,${decimal}})?$`);
  // 如果输入的字符不符合正则，则将最后一个字符删除
  if (!regex.test(value)) {
    return value.slice(0, value.length - 1);
  }
  return ('' + value) // 第一步：转成字符串
    .replace(/[^\d^\.]+/g, '') // 第二步：把不是数字，不是小数点的过滤掉
    .replace(/^0+(\d)/, '$1') // 第三步：第一位0开头，0后面为数字，则过滤掉，取后面的数字
    .replace(/^\./, '0.') // 第四步：如果输入的第一位为小数点，则替换成 0. 实现自动补全
};
// 限制el-input只能输入指定位数小数的数字
export const limitDecimalNumber = (dataRef, value, decimal, key = null) => {
  if (!decimal) {
    throw new Error('decimal is required');
  }
  if (typeof decimal !== 'number' || decimal < 0) {
    throw new Error('decimal must be a positive number');
  }
  let newValue = limitDecimal(value, decimal);
  if (newValue.indexOf('.') !== -1) {
    let arr = newValue.split('.');
    let len = arr[1].length;
    if (len > decimal) {
      newValue = arr[0] + '.' + arr[1].slice(0, decimal);
    }
  }
  if (key) {
    dataRef[key] = newValue;
    dataRef.value && (dataRef.value[key] = newValue);
  } else {
    dataRef.value = newValue;
  }
};

// 限制el-input只能输入8位小数的数字
export const limitDecimal8 = (dataRef, value, key = null) => {
  console.log('limitDecimal8', dataRef, value, key)
  if (key) {
    dataRef[key] = limitDecimal(value, 8);
    dataRef.value && (dataRef.value[key] = limitDecimal(value, 8));
  } else {
    dataRef.value = limitDecimal(value, 8);
  }
};

// 限制el-input只能输入4位小数的数字
export const limitDecimal4 = (dataRef, value, key = null) => {
  if (key) {
    dataRef[key] = limitDecimal(value, 4);
    dataRef.value && (dataRef.value[key] = limitDecimal(value, 4));
  } else {
    dataRef.value = limitDecimal(value, 4);
  }
};

// 限制el-input只能输入2位小数的数字
export const limitDecimal2 = (dataRef, value, key = null) => {
  if (key) {
    dataRef[key] = limitDecimal(value, 2);
    dataRef.value && (dataRef.value[key] = limitDecimal(value, 2));
  } else {
    dataRef.value = limitDecimal(value, 2);
  }
};

// 生成一个独一无二的id
export const generateUniqueId = () => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

// 获取对象数组中某个属性的最大值
export const getListPropertyMax = (arr, key, compare = (a, b) => a - b) => {
  let max = 0;
  arr.forEach((item) => {
    if (compare(item[key], max) > 0) {
      max = item[key];
    }
  });
  return max;
};

// 将一个函数防抖
export const useDebounceFn = (func, wait) => {
  let timeout;
  return function () {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, arguments);
    }, wait);
  };
};
