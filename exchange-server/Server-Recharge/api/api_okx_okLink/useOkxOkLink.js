import {get_token_transfer_list} from "./okx_okLink_api.js";
import {useResult} from "../utils.js";

export const useOkxOkLinkGetTokenTranListData = async (chainShortName, tokenContractAddress, maxAmount, minAmount, page, limit = 100) => {
  try {
    let result = await get_token_transfer_list(chainShortName, tokenContractAddress, maxAmount, minAmount, page, limit);
    let data = result.data;
    if(Number(data.code) !== 0) {
      console.log('获取交易列表失败，code：' + data.code + ', msg：' + data.msg);
      return useResult.error(data.msg);
    }
    return useResult.success(data.data[0]);
  } catch (e) {
    console.log(e.message, 'useOkxOkLinkGetTokenTranList Error');
    return useResult.error(e.message);
  }
};
