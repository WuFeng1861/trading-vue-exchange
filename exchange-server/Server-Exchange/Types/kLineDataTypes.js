// todo: 缺少5分钟、15分钟、30分钟、一周时间粒度
export const kLineDataGranularity = {
  '1s': '1秒',
  '1m': '1分',
  '1h': '1小时',
  '1d': '1天',
  '1M': '1月',
  '1y': '1年',
};



export const useKLineIntervalList = () => {
  let result = [];
  for (let key in kLineDataGranularity) {
    result.push({
      label: kLineDataGranularity[key],
      key: key,
      value: key,
    });
  }
  return result;
};
