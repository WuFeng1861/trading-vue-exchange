import amqp from "amqplib";
import {getNow} from "../../utils/utils.js";

// 默认不开启confirm模式
// todo：增加confirm模式的配置可选
export class MQUtil {
  constructor(config) {
    this.config = config;
    this.connectTimeout = config.connectTimeout || 2000;
    this.reconnectCount = config.reconnectCount || 0;
    this.reconnectInterval = config.reconnectInterval || 2000;
    this.reconnectMaxAttempts = config.reconnectMaxAttempts || 3;
    this.publishConfirmLimit = config.publishConfirmLimit || 10000;
    this.lastReconnectTime = 0;
    this.overMaxReconnectTime = config.overMaxReconnectTime || 10 * 1000;
  }

  async connect() {
    try {
      const connection = await amqp.connect(this.config);
      // 创建通道、建立连接
      const channel = await connection.createChannel();
      if(this.config.prefetchCount) {
        await channel.prefetch(this.config.prefetchCount);
      }
      this.channel = channel;
      this.connection = connection;
    } catch (error) {
      console.error(error.message);
      return false;
    }
    await this.OnClose();
    await this.onError();
    return true;
  }

  async #reconnect() {
    if (this.reconnectCount >= this.reconnectMaxAttempts && getNow() - this.lastReconnectTime < this.overMaxReconnectTime) {
      console.log("MQ channel reconnect max attempts reached, giving up.");
      return false;
    }
    console.log("MQ channel reconnecting...");
    this.reconnectCount++;
    let result = await this.connect();
    if (!result) {
      console.log("MQ channel reconnect failed, retrying in " + this.reconnectInterval + "ms");
      setTimeout(() => {
        this.#reconnect();
      });
      return false;
    }
    console.log("MQ channel reconnected.");
    this.reconnectCount = 0;
    return true;
  }

  async OnClose() {
    // 监听关闭
    this.connection.once("close", () => {
      // 通道关闭时，重试连接
      setTimeout(() => {
        this.#reconnect();
      }, this.reconnectInterval);

    });
  }

  async onError() {
    // 监听错误
    this.connection.once("error", (err) => {
      console.error("MQ channel error: " + err.message);
      // 重试连接
      this.#reconnect();
    });
  }

  async createExchange(exchangeName, exchangeType, durable = true) {
    await this.channel.assertExchange(exchangeName, exchangeType, {durable});
  }

  async createQueue(queueName, durable = true) {
    await this.channel.assertQueue(queueName, {durable});
  }

  async bindQueue(queueName, exchangeName, routingKey) {
    await this.channel.bindQueue(queueName, exchangeName, routingKey ?? '');
  }

  // 发送字符串消息到交换机
  async sendMessageToExchange(exchangeName, msg, routingKey = '', properties = {persistent: true}) {
    if (!this.channel) {
      console.log('MQ channel not connected.');
      return false;
    }
    try {
      // 检查msg是否为字符串
      if (typeof msg !== "string") {
        // 若不是字符串，则转为字符串
        msg = JSON.stringify(msg);
      }
      return await this.channel.publish(exchangeName, routingKey, Buffer.from(msg), properties);
    } catch (error) {
      console.error(error.message);
      return false;
    }

  }

  // 发送消息到队列
  async sendMessageToQueue(queueName, msg, properties = {persistent: true}) {
    if (!this.channel) {
      console.log('MQ channel not connected.');
      return false;
    }
    try {
      // 检查msg是否为字符串
      if (typeof msg !== "string") {
        // 若不是字符串，则转为字符串
        msg = JSON.stringify(msg);
      }
      return await this.channel.sendToQueue(queueName, Buffer.from(msg), properties);
    } catch (error) {
      console.error(error.message);
      return false;
    }
  }

  // 订阅队列消息
  subscribeQueue(queueName, consumer, options = {noAck: false}) {
    if (!this.channel) {
      console.log('MQ channel not connected.');
      return false;
    }
    try {
      this.channel.consume(queueName, consumer, options);
    } catch (error) {
      console.error(error.message);
      return false;
    }
  }

  // 完成消息处理
  async ack(message) {
    if (!this.channel) {
      console.log('MQ channel not connected.');
      return false;
    }
    try {
      return await this.channel.ack(message);
    } catch (error) {
      console.error(error.message);
      return false;
    }
  }

  // 消息处理出错
  async nack(message, requeue = true) {
    if (!this.channel) {
      console.log('MQ channel not connected.');
      return false;
    }
    try {
      return await this.channel.nack(message, false, requeue);
    } catch (error) {
      console.error(error.message);
      return false;
    }
  }
}

