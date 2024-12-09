// todo: 缺少5分钟、15分钟、30分钟、一周时间粒度
export const keyKlineDataFormat = {
  '1s': 'YYYY-MM-DD HH:mm:ss',
  '1m': 'YYYY-MM-DD HH:mm',
  '1h': 'YYYY-MM-DD HH:00',
  '1d': 'YYYY-MM-DD',
  '1M': 'YYYY-MM-01',
  '1y': 'YYYY-01-01'
};

export const valueKlineDataFormat = {
  '1秒': 'YYYY-MM-DD HH:mm:ss',
  '1分': 'YYYY-MM-DD HH:mm',
  '1小时': 'YYYY-MM-DD HH:00',
  '1天': 'YYYY-MM-DD',
  '1月': 'YYYY-MM-01',
  '1年': 'YYYY-01-01'
};


export const kLineDataGranularity = {
  '1s': '1秒',
  '1m': '1分',
  '1h': '1小时',
  '1d': '1天',
  '1M': '1月',
  '1Y': '1年',
};

export const useKLineDataList = () => {
  let result = [];
  for (let key in kLineDataGranularity) {
    result.push({
      label: kLineDataGranularity[key],
      value: key,
      key: key,
    });
  }
  return result;
};