import {sendBindAddressEmail} from "@/api/email/api.js";

export const useSendBindWalletCodeEmail = async () => {
  let id = localStorage['id'];
  if (!id) {
    return;
  }
  // 发起api请求
  await sendBindAddressEmail(id);
};
