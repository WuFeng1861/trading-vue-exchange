import {getTotalData} from "@/api/mintPool/mint.js";

const totalDataTef = ref({});

export const useTotalDataTef = () => {
  return totalDataTef;
}

export const updateTotalDataTef = async () => {
  await initTotalDataTef();
}

const initTotalDataTef = async () => {
  let result = (await getTotalData()).data;
  totalDataTef.value = result;
}

initTotalDataTef();
