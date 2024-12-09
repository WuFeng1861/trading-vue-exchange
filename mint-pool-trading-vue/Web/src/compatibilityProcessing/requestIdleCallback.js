// 计算出当前帧 结束时间点
let deadlineTime
// 保存任务
let callback = [];

// 建立通信
let channel = new MessageChannel()
let port1 = channel.port1;
let port2 = channel.port2;

// 接收并执行宏任务
port2.onmessage = () => {
  // 判断当前帧是否还有空闲，即返回的是剩下的时间
  const timeRemaining = () => deadlineTime - performance.now();
  const _timeRemain = timeRemaining();
  // 有空闲时间 且 有回调任务
  if (_timeRemain > 0 && callback.length) {
    const deadline = {
      timeRemaining, // 计算剩余时间
      didTimeout: _timeRemain < 0 // 当前帧是否完成
    }
    // 执行回调
    let callbackList = [...callback];
    callback = [];
    callbackList.forEach(cb => cb(deadline));
  }
  requestAnimationFrame(rafTime => {
    // 结束时间点 = 开始时间点 + 一帧用时16.667ms
    deadlineTime = rafTime + 16.667
    // 发送个宏任务
    port1.postMessage(null);
  })
}
// if(!window.requestIdleCallback) {
//   console.log('requestIdleCallbacknot support')
//   requestAnimationFrame(rafTime => {
//     // 结束时间点 = 开始时间点 + 一帧用时16.667ms
//     deadlineTime = rafTime + 16.667
//     // 发送个宏任务
//     port1.postMessage(null);
//   })
//   window.requestIdleCallback = function (cb) {
//     // 保存任务
//     callback.push(cb);
//   }
// }
console.log('requestIdleCallbacknot support')
requestAnimationFrame(rafTime => {
  // 结束时间点 = 开始时间点 + 一帧用时16.667ms
  deadlineTime = rafTime + 16.667
  // 发送个宏任务
  port1.postMessage(null);
})
window.requestIdleCallback = function (cb) {
  // 保存任务
  callback.push(cb);
}
