class Bus {
  constructor() {
    this.callback = {};
  }
  /**
   * @description: 发布事件
   * @param {String} name 名称
   * @param {Function} fn 方法
   */
  $on(name, fn) {
    this.callback[name] = this.callback[name] || [];
    this.callback[name].push(fn);
  }
  /**
   * @description: 订阅器-接收器
   * @param {String} name 方法的名称
   * @param {*} args 入参
   */
  $emit(name, args) {
    if (this.callback[name]) {
      this.callback[name].forEach((cb) => {
        cb(args);
      });
    }
  }

  /**
   * @description: 取消订阅
   * @param {String} name
   * @param {Function} fn
   */
  $off(name, fn) {
    // 如果没有指定，则取消该事件的所有监听
    if(!fn) {
      this.callback[name] = [];
      return;
    }
    // 指定函数的取消监听，找出这个函数剔除出去
    if(this.callback[name]) {
      this.callback[name] = this.callback[name].filter((cb) => cb !== fn);
    }
  }
}

const bus = new Bus();
export default bus;
