import tradeTableDao from "../../Mysql/Dao/tradeTable.js";
import dayjs from "dayjs";
import fs from "fs";
// 假设我们使用一个简单的内存对象作为缓存
let cache = {
    'MERC-USDT': {
        lastId: 0,
        kLines: {}
    }
};

// 定义从数据库获取数据的函数
async function fetchDataFromDB(currencyPair, lastId, intervals) {
    const formatStrings = {
        '1s': 'YYYY-MM-DD HH:mm:ss',
        '1m': 'YYYY-MM-DD HH:mm',
        '1h': 'YYYY-MM-DD HH:00',
        '1d': 'YYYY-MM-DD',
        '1M': 'YYYY-MM-01',
        '1y': 'YYYY-01-01'
    };

    const data = await tradeTableDao.getTradeListByPairAndLastId(currencyPair, lastId);

    let results = [];
    for (let i = 0; i < intervals.length; i++) {
        results.push({
            data,
            formatString: formatStrings[intervals[i]],
            interval: intervals[i]
        });
    }
    return results;
}

function addZeroKLineData(formatString, kLines, timeUnit) {
    // 添加0交易量的K线数据
    const now = dayjs().format(formatString);
    if(!kLines[0]) {
        console.log(kLines);
    }
    let lastKLineTime = kLines[0].time;
    let nextKLineIndex = 1;
    for (let i = nextKLineIndex; i < kLines.length; i++) {
        const currentKLineTime = kLines[i].time;
        const timeDiff = dayjs(currentKLineTime).diff(dayjs(lastKLineTime), timeUnit);
        if (timeDiff > 1) {
            for (let j = 1; j < timeDiff; j++) {
                const newKLineTime = dayjs(lastKLineTime).add(j, timeUnit).format(formatString);
                kLines.splice(i + j - 1, 0, {
                    time: newKLineTime,
                    open: kLines[i - 1].close,
                    high: kLines[i - 1].close,
                    low: kLines[i - 1].close,
                    close: kLines[i - 1].close,
                    volume: 0
                });
            }
        }
        lastKLineTime = currentKLineTime;
        nextKLineIndex = i + timeDiff - 1;
    }

    // 添加直到当前时间的0交易量K线数据
    const nowMoment = dayjs(now);
    const lastKLineTimeMoment = dayjs(kLines[kLines.length - 1].time);
    const timeDiffToEnd = nowMoment.diff(lastKLineTimeMoment, timeUnit);
    if (timeDiffToEnd > 0) {
        for (let j = 1; j <= timeDiffToEnd; j++) {
            const newKLineTime = lastKLineTimeMoment.add(j, timeUnit).format(formatString);
            kLines.push({
                time: newKLineTime,
                open: kLines[kLines.length - 1].close,
                high: kLines[kLines.length - 1].close,
                low: kLines[kLines.length - 1].close,
                close: kLines[kLines.length - 1].close,
                volume: 0
            });
        }
    }
}

// 定义计算K线图数据的函数
function calculateKLines(oldKLines, newData, interval) {
    const timeUnit = {
        '1s': 'second',
        '1m': 'minute',
        '1h': 'hour',
        '1d': 'day',
        '1M': 'month',
        '1y': 'year'
    }[interval];

    const formatString = {
        '1s': 'YYYY-MM-DD HH:mm:ss',
        '1m': 'YYYY-MM-DD HH:mm',
        '1h': 'YYYY-MM-DD HH:00',
        '1d': 'YYYY-MM-DD',
        '1M': 'YYYY-MM-01',
        '1y': 'YYYY-01-01'
    }[interval];

    let kLines = oldKLines.map(kLine => ({ ...kLine }));
    let currentKLine = null;
    if (kLines.length > 0) {
        // 找到最后一个K线的时间, 并将其作为当前K线的起始时间, 后面反正会加入进去
        currentKLine = kLines.pop();
    }

    newData.forEach((row) => {
        const timeKey = dayjs(Number(row.trade_time)).format(formatString);
        const price = row.trade_price;
        const amount = Number(row.trade_amount);

        if (!currentKLine || timeKey !== currentKLine.time) {
            if (currentKLine) {
                kLines.push(currentKLine);
            }
            currentKLine = {
                time: timeKey,
                open: price,
                high: price,
                low: price,
                close: price,
                volume: amount
            };
        } else {
            currentKLine.high = Math.max(currentKLine.high, price);
            currentKLine.low = Math.min(currentKLine.low, price);
            currentKLine.close = price;
            currentKLine.volume += amount;
        }
    });

    // 检查是否有新的K线需要添加
    if (currentKLine) {
        kLines.push(currentKLine);
    }

    // console.log(kLines);
    // 添加0交易量的K线数据
    addZeroKLineData(formatString, kLines, timeUnit);
    return kLines;
}

// 更新缓存的函数
function updateCache(newData, newKLines, interval, pairName) {
    cache[pairName].lastId = newData.length > 0 ? newData[newData.length - 1].id : cache[pairName]?.lastId || 0;
    cache[pairName].kLines[interval] = newKLines.slice(-300);
}

// 保存K线数据到文件
function saveToFile(kLines, formatString, interval, pairName) {
    const fileName = `${pairName}_${interval}.txt`;
    const fileContent = kLines.map(kLine => `time=${kLine.time},open=${kLine.open},high=${kLine.high},low=${kLine.low},close=${kLine.close},volume=${kLine.volume}`).join('\n');
    const filePath = `./Data/${fileName}`;

    if (!fs.existsSync('./Data')) fs.mkdirSync('Data');

    console.log(`Saving K lines to file: ${filePath}`);
    console.log(`K lines count: ${kLines.length}`);

    try {
        const fileStream = fs.createWriteStream(filePath);
        fileStream.write(fileContent);
        fileStream.end();
    } catch (error) {
        console.error('Error saving K lines to file:', error);
    }

    console.log(`K lines saved to file: ${filePath}`);
}

// 使用函数计算K线图数据并更新缓存
export async function generateKLines(currencyPair, intervals) {
    if (!cache[currencyPair]) {
        cache[currencyPair] = {
            lastId: 0,
            kLines: {}
        };
    }
    const results = await fetchDataFromDB(currencyPair, cache[currencyPair]?.lastId || 0, intervals);
    for (let i = 0; i < results.length; i++) {
        const item = results[i];
        const data = item.data;
        const interval = item.interval;
        const formatString = item.formatString;

        let oldKLines = cache[currencyPair]?.kLines[interval] || [];
        const newKLines = calculateKLines(oldKLines, data, interval);
        updateCache(data, newKLines, interval, currencyPair);
        // saveToFile(newKLines, formatString, interval, currencyPair);
        // console.log(`${i} finished.`, results.length, intervals.length);
    }
}

// 获取缓存的K线图数据
export const getPairKLines = (pairName, interval) => {
    return cache[pairName]?.kLines[interval] || [];
};