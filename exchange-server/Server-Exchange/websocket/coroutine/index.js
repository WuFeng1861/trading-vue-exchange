// 模拟协程
const funcList = [];

// 向任务队列中添加任务
export const addTask = (func) => {
    funcList.push(func);
};

// 运行任务队列中的任务
const run = async () => {
    // console.log("run", funcList.length);
    if (funcList.length > 0) {
        const func = funcList.shift();
        await func();
        addTask(func);
    }
    // console.log('finish', funcList.length);
    setTimeout(run, 10);
};

// 启动协程
run();
