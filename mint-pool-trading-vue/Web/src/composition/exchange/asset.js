import {getUserAssets} from "@/api/exchange/asset.js";

const userAssets = ref({});
const userAssetsList = ref([]);
export const useUserAssetsRef = () => {
  return userAssets;
};

export const useUserAssetsList = () => {
  return userAssetsList;
};

export const useInitUserAssets = async () => {
  let id = localStorage.getItem("id");
  if (!id) {
    requestIdleCallback(useInitUserAssets);
  }
  let result = await getUserAssets(id);
  let userAssetsTemp = {};
  let userAssetsListTemp = [];
  for (let i = 0; i < result.userAssets.length; i++) {
    userAssetsTemp[result.userAssets[i].currency] = result.userAssets[i].balance;
    const nowPair = ['USDT', 'MERC'];
    if(!nowPair.includes(result.userAssets[i].currency)) {
      continue;
    }
    userAssetsListTemp.push({
      currency: result.userAssets[i].currency,
      balance: Number(result.userAssets[i].balance)
    });
  }
  userAssets.value = userAssetsTemp;
  userAssetsList.value = userAssetsListTemp;
  console.log(userAssetsListTemp, 'useInitUserAssets');
};

useInitUserAssets();
