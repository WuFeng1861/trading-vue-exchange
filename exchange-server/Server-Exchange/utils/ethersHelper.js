import {ethers, verifyMessage} from "ethers";
import SafeCalc from "./bignumberjs.js";

export class EthersHelper {
  static OptimismUrl = ['https://mainnet.optimism.io', 'https://optimism-rpc.publicnode.com', 'https://optimism-rpc.publicnode.com', 'https://api.zan.top/node/v1/opt/mainnet/public', 'https://optimism.meowrpc.com', 'https://optimism.llamarpc.com'];
  static ArbitrumUrl = ['https://arb1.arbitrum.io/rpc', 'https://rpc.arb1.arbitrum.gateway.fm', 'https://api.zan.top/node/v1/arb/one/public'];
  static BinanceUrl = [
    // 'https://bsc.drpc.org',
    'https://1rpc.io/bnb',
    // 'https://bsc-pokt.nodies.app',
    'https://binance.llamarpc.com',
    'https://bsc-mainnet.nodereal.io/v1/64a9df0874fb4a93b9d0a3849de012d3',
    'https://api.tatum.io/v3/blockchain/node/bsc-mainnet',
    'https://rpc.ankr.com/bsc'
  ];
  blockInterval = 1000 * 3; // 区块间隔时间，单位为毫秒
  latestBlock = 37585729;
  lastBlockTimes = 0;
  lastBlockTimeLimit = 5;

  constructor(providerUrl, providerUrlList) {
    this.providerUrlList = providerUrlList;
    this.providerIndex = -1;
    this.providerUrl = providerUrl;
    this.provider = new ethers.JsonRpcProvider(this.providerUrl);
    this.updateLatestBlock();
    this.updateProvider();
  }

  // 检查provider是否初始化
  checkProvider() {
    if (!this.provider) {
      throw new Error('Provider is not initialized');
    }
  }

  // 获取指定交易数据
  async getTransaction(transactionHash) {
    this.checkProvider();
    try {
      const transaction = await this.provider.getTransaction(transactionHash);
      return transaction;
    } catch (error) {
      console.error('Error:', error);
      throw new Error('Failed to get transaction');
    }
  }

  // 判断交易是否成功
  async confirmTransaction(transactionHash) {
    this.checkProvider();
    try {
      const transaction = await this.provider.getTransactionReceipt(transactionHash);
      if (!transaction) {
        return false;
      }
      return transaction.status === 1;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };

  // 获取合约的指定高度交易
  async getContractTransactions(contractAddress, fromBlock, toBlock) {
    // 如果toBlock为空，则默认为当前块高
    if (!toBlock || toBlock > this.latestBlock) {
      toBlock = await this.provider.getBlockNumber();
    }
    if (fromBlock > toBlock) {
      return [];
    }
    if (SafeCalc.compare(SafeCalc.add(fromBlock, 5000), toBlock) !== '1') {
      toBlock = SafeCalc.add(fromBlock, 4999);
    }
    const filter = {
      address: contractAddress,
      fromBlock: Number(fromBlock),
      toBlock: Number(toBlock)
    };
    const logs = await this.provider.getLogs(filter);
    return logs.map(log => log.transactionHash);
  };

  // 更新最新区块
  async updateLatestBlock() {
    this.checkProvider();
    try {
      const blockNumber = await this.provider.getBlockNumber();
      if (this.latestBlock < blockNumber) {
        this.latestBlock = blockNumber;
        // 概率10%
        // let random = Math.random();
        // if (random < 0.1) {
        //   this.lastBlockTimes = 10;
        // }
      } else {
        this.lastBlockTimes++;
      }
      // 打印高度
      console.log('Latest block:', this.latestBlock, this.providerUrl);
    } catch (error) {
      console.error('Error:', error);
    }
    setTimeout(this.updateLatestBlock.bind(this), this.blockInterval);
  }

  // 检查provider是否可用
  async updateProvider() {
    try {
      const network = await this.provider.getNetwork();
      // 打印链的名字和url
      console.log('Connected to', network.name, this.providerUrl, this.latestBlock);
      if (this.lastBlockTimes > this.lastBlockTimeLimit) {
        await this.getNewProvider();
        this.lastBlockTimes = 0;
      }
    } catch (error) {
      await this.getNewProvider();
      console.error('Connection error:', error);
    }
    setTimeout(this.updateProvider.bind(this), 1000 * 10);
  }

  // 获取新的provider
  async getNewProvider() {
    console.log('Getting new provider...');
    try {
      this.providerIndex = (this.providerIndex + 1) % this.providerUrlList.length;
      const provider = new ethers.JsonRpcProvider(this.providerUrlList[this.providerIndex]);
      let newBlockNumber = await provider.getBlockNumber();
      if (this.latestBlock > newBlockNumber) {
        return await this.getNewProvider();
      }
      this.providerUrl = this.providerUrlList[this.providerIndex];
      this.provider = provider;
      this.lastBlockTimes = 0;
    } catch (error) {
      await this.getNewProvider();
    }
  }

  // 获取签名字符串的地址
  static getAddressFromSignature(message, signature) {
    return verifyMessage(message, signature);
  }
}


