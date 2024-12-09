import {addRechargeAddress, getRechargeAddress, getRechargeRecords} from "@/api/exchange/recharge-withdraw/recharge.js";

const rechargeAddress = ref([]); // 充值地址列表 ['xxx']

export const useRechargeAddressRef = () => {
  return rechargeAddress;
};

export const useInitRechargeAddress = async () => {
  const id = localStorage.getItem('id');
  if (!id) {
    return;
  }
  const response = await getRechargeAddress(id);
  let addressListTemp = [];
  response.userRechargeAddress.forEach(item => {
    addressListTemp.push(item.address);
  });
  rechargeAddress.value = addressListTemp;
};

// 添加一个充值的地址
export const useAddNewRechargeAddress = async () => {
  const id = localStorage.getItem('id');
  if (!id) {
    return;
  }
  const response = await addRechargeAddress(id);
  console.log('添加充值地址', response);
  // 这里需要将新的地址添加到地址列表中
  // 判断是否已经存在该地址
  let addressListTemp = rechargeAddress.value;
  if (addressListTemp.includes(response.address)) {
    throw new Error('该地址已存在');
  }
  addressListTemp.push(response.address);
  rechargeAddress.value = addressListTemp;
  console.log('添加充值地址成功', response.address, rechargeAddress.value);
  return response.address;
};

// 获取币种的充值记录
export const useGetRechargeRecord = async (coinName) => {
  const id = localStorage.getItem('id');
  if (!id) {
    return;
  }
  let response = await getRechargeRecords(id, coinName);
  return response.userRechargeRecords;
};

