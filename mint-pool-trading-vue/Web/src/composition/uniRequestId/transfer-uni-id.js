import {generateUniqueId} from "@/utils/index.js";

const transferUniId = ref(null);
const finishUniId = {};

// 用于生成新的转账请求ID, 发起新的转账请求时调用
export const useUpdateUniId = () => {
  transferUniId.value = generateUniqueId();
}
// 用于检查是否已经完成转账请求, 避免重复提交
export const useCheckUniId = () => {
  if(finishUniId[transferUniId.value]) {
    throw new Error("转账操作重复,请勿重复提交");
  }
}
// 用于标记转账请求已完成
export const useFinishTransferUniId = () => {
  finishUniId[transferUniId.value] = true;
}
