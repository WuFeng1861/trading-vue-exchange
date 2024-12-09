import {getEarningsList, getWeekEarnings} from "@/api/mintPool/mint.js";
import {getLastSevenDays} from "@/utils/index.js";

const myWeekEarns = ref([]);
const myWeekTax = ref([]);

const initMyWeekEarns = async () => {
  let res = (await getWeekEarnings(localStorage['id']));
  myWeekEarns.value = res.earnList;
  myWeekTax.value = res.taxList;
}

export const useMyWeekEarnsRef = () => {
  return myWeekEarns;
}

initMyWeekEarns();
//------------------------------------------------------------------------------------------------------------

const weekEarnsRef = computed(() => {
  const days = getLastSevenDays();
  return days.map((day) => {
    console.log(day, Number(myWeekEarns.value.find(item => item.date === day)?.amount || 0));
    return Number(myWeekEarns.value.find(item => item.date === day)?.amount || 0) // 如果找不到，则返回一个0
  })
})

export const useWeekEarnsRef = () => {
  console.log(weekEarnsRef)
  return weekEarnsRef;
}

//--------------------------------------------------------------------------------------------------------------

const weekTaxRef = computed(() => {
  const days = getLastSevenDays();
  return days.map((day) => {
    console.log(day, Number(myWeekTax.value.find(item => item.date === day)?.amount || 0));
    return Number(myWeekTax.value.find(item => item.date === day)?.amount || 0) // 如果找不到，则返回一个0
  })
})

export const useWeekTaxRef = () => {
  console.log(weekTaxRef)
  return weekTaxRef;
}


//--------------------------------------------------------------------------------------------------------------

const myEarnList = ref([]);
let pageIndex = 1;
const pageSize = 10;
let allEarns = 0;
const earnType = {
  1: '日常收入',
  2: '转账收入',
  3: '游戏收入',
  4: '邀请收入',
  5: '盲盒奖励',
  100: '转账支出',
}
const initMyEarnList = async () => {
  const res = await getEarningsList(localStorage['id'], pageIndex, pageSize);
  // 按照createtime 从大到小排序
  allEarns = res.earnList.count;
  myEarnList.value = res.earnList.rows.sort((a, b) => Number(b.createtime) - Number(a.createtime));
  pageIndex++;
}

export const useMoreMyEarnList = async () => {
  if ((pageIndex - 1) * pageSize >= allEarns) {
    return;
  }
  const res = await getEarningsList(localStorage['id'], pageIndex, pageSize);
  allEarns = res.earnList.count;
  let listTemp = [...myEarnList.value, ...res.earnList.rows];
  // 根据id去重
  listTemp = Array.from(new Set(listTemp.map(item => item.id))).map(id => listTemp.find(item => item.id === id));
  // 按照createtime 从大到小排序
  myEarnList.value = listTemp.sort((a, b) => Number(b.createtime) - Number(a.createtime));
  pageIndex++;
}

export const useMyEarnListRef = () => {
  return myEarnList;
}
export const useNewEarns = async () => {
  const res = await getEarningsList(localStorage['id'], 1, pageSize);
  allEarns = res.earnList.count;
  let listTemp = [...myEarnList.value, ...res.earnList.rows];
  // 根据id去重
  listTemp = Array.from(new Set(listTemp.map(item => item.id))).map(id => listTemp.find(item => item.id === id));
  // 按照createtime 从大到小排序
  myEarnList.value = listTemp.sort((a, b) => Number(b.createtime) - Number(a.createtime));
}

export const getEarnType = (type) => {
  return earnType[type];
}

initMyEarnList();

