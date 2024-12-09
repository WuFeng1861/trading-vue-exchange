import {getMyGroup} from "@/api/mintPool/mint.js";

// 我的邀请人列表
const myGroupRef = ref([]);
let pageNumber = 1;
let totalRef = ref(0);
let onlineNumberRef = ref(0);
const initMyGroup = async () => {
  let id = localStorage['id'];
  let {count, rows, onlineNumber} = (await getMyGroup(id, 1)).list;
  pageNumber++;
  totalRef.value = count;
  onlineNumberRef.value = onlineNumber;
  // 按照nexttime 从大到小排序
  rows.sort((a, b) => Number(b.nexttime) - Number(a.nexttime));
  myGroupRef.value = rows;
}

// 获取下一页我的邀请人
export const getNextMyGroup = async () => {
  console.log('getNextMyGroup')
  if(totalRef.value <= myGroupRef.value.length) {
    return;
  }
  let id = localStorage['id'];
  let {count, rows, onlineNumber} = (await getMyGroup(id, pageNumber)).list;
  pageNumber++;
  totalRef.value = count;
  onlineNumberRef.value = onlineNumber;
  let newRes = rows.filter(item => !myGroupRef.value.find(i => i.id === item.id));
  // 合并数组
  rows = [...newRes, ...myGroupRef.value];
  // 按照nexttime 从大到小排序
  rows.sort((a, b) => Number(b.nexttime) - Number(a.nexttime));
  // 更新数据
  myGroupRef.value = rows;
  console.log(pageNumber, myGroupRef.value.length, totalRef.value)
}

export const useMyGroupRef = () => {
  return myGroupRef;
}

// 我的邀请总数
export const useMyGroupTotalRef = () => {
  return totalRef;
}

// 我的在线人数
export const useMyGroupOnlineNumberRef = () => {
  return onlineNumberRef;
}

export const refreshMyGroup = () => {
  initMyGroup();
}


initMyGroup();
