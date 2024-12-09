import {ethers, verifyMessage, zeroPadValue} from "ethers";
import SafeCalc from "./bignumberjs.js";

export class EthersHelper {
  static OptimismUrl = ['https://mainnet.optimism.io', 'https://optimism-rpc.publicnode.com', 'https://optimism-rpc.publicnode.com', 'https://api.zan.top/node/v1/opt/mainnet/public', 'https://optimism.meowrpc.com', 'https://optimism.llamarpc.com'];
  static ArbitrumUrl = ['https://arb1.arbitrum.io/rpc', 'https://rpc.arb1.arbitrum.gateway.fm', 'https://api.zan.top/node/v1/arb/one/public'];
  static BinanceUrl = [
    'https://1rpc.io/bnb',
    'https://rpc.ankr.com/bsc'
  ];
  static BinanceTestUrl = [
    'https://bsc-testnet-rpc.publicnode.com',
    'https://data-seed-prebsc-2-s1.binance.org:8545'
  ];
  blockInterval = 1000 * 3; // 区块间隔时间，单位为毫秒
  latestBlock = 41883571;
  lastBlockTimes = 0;
  lastBlockTimeLimit = 5;

  constructor(providerUrl, providerUrlList) {
    this.providerUrlList = providerUrlList;
    this.providerIndex = -1;
    this.providerUrl = providerUrl;
    this.provider = new ethers.JsonRpcProvider(this.providerUrl);
    this.updateLatestBlock();
    // this.updateProvider();
  }

  // 关闭连接
  async close() {
    if (this.provider) {
      await this.provider.disconnect();
    }
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

  // 创建新的钱包 返回钱包的私钥和地址和余额
  async createNewWalletWithBalance() {
    const wallet = ethers.Wallet.createRandom();
    const privateKey = wallet.privateKey;
    const address = wallet.address;
    const balance = await this.provider.getBalance(address);
    return {
      privateKey,
      address,
      balance
    };
  }

  // 监听链上的所有完成交易
  async watchAllTransactions(callback) {
    try {
      this.provider.on('block', (blockNumber) => {
        console.log(`接收到新块：`, blockNumber);
        this.provider.getBlock(blockNumber).then((block) => {
          callback(block.transactions);
        });
      });
    } catch (error) {
      console.error('Error:', error);
      throw new Error('Failed to watch all transactions');
    }
  }

  // 监听一个地址的eth交易
  async watchAddressTransactions(address, callback) {
    try {
     this.provider.on(address, (tx) => {
       // console.log('Transaction:', tx.hash);
       callback(tx);
     });
    } catch (error) {
      console.error('监听交易时出错:', error);
    }
  }

  // 获取地址的代币交易记录
  async getAddressTokenTransactions(fromAddress, toAddress, tokenAddress, fromBlock, toBlock) {
    console.log('获取地址的代币交易记录', fromAddress, toAddress, tokenAddress, fromBlock, toBlock);
    this.checkProvider();
    const filter = {
      address: tokenAddress,
      fromBlock: Number(fromBlock),
      toBlock: Number(toBlock),
      topics: [
        ethers.id("Transfer(address,address,uint256)"), // '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', // 这个字符串代表ERC中的Transfer事件
        fromAddress ? zeroPadValue(toAddress, 32) : null, // 这个是from的地址 要zeroPadValue(address, 32)
        toAddress ? zeroPadValue(toAddress, 32) : null // 这个是to的地址 要zeroPadValue(address, 32)
      ]
    };
    const logs = await this.provider.getLogs(filter);
    return logs.map(log => {
      console.log('log:', log);
      return {
        fromAddress : fromAddress || ethers.getAddress(log.topics[1].slice(26)),
        toAddress : toAddress || ethers.getAddress(log.topics[2].slice(26)),
        height: log.blockNumber,
        transactionHash: log.transactionHash,
        data: log.data
      };
    });
  }

  // 查询eth余额 转成eth单位
  async getBalance(address) {
    const balance = await this.provider.getBalance(address);
    return ethers.formatEther(balance);
  }

  // 查询地址token余额
  async getTokenBalance(address, tokenAddress) {
    const contract = new ethers.Contract(tokenAddress, [
      'function balanceOf(address) view returns (uint256)'
    ], this.provider);
    const balance = await contract.balanceOf(address);
    return balance.toString();
  }

  // 创建随机eth钱包
  static createNewWallet() {
    const wallet = ethers.Wallet.createRandom();
    return {
      privateKey: wallet.privateKey,
      address: wallet.address
    };
  }

  // 获取代币转账的gas费 amount传入的单位是ether
  async estimateGasForTokenTransfer(fromAddress, toAddress, tokenAddress, amount) {
    this.checkProvider();
    // 创建一个新的钱包，并用这个钱包的私钥签名交易
    // const balance = await this.provider.getBalance(wallet.address);
    // console.log('Balance:', ethers.formatEther(balance.toString()));
    let gasPrice = (await this.provider.getFeeData()).gasPrice;
    console.log('Gas price:', gasPrice, typeof gasPrice);
    const contract = new ethers.Contract(tokenAddress, [
      "function transfer(address,uint256) returns (bool)"
    ], this.provider);
    // 构造交易请求对象
    const txRequest = {
      to: tokenAddress, // 代币合约地址
      // 其他交易参数...
      from: fromAddress, // 发送方地址
      gasPrice: gasPrice,
      // gasLimit: 200000, // 限制gas消耗
      // 如果是调用智能合约函数，data 需要包含函数选择器和参数编码
      data: contract.interface.encodeFunctionData('transfer', [toAddress, ethers.parseEther(amount.toString())])
    };
    // 获取gas费用
    try {
      const gasEstimate = await this.provider.estimateGas(txRequest);
      // 如果gasPrice小于3gwei,则设置gasPrice为3gwei
      if (SafeCalc.compare(gasPrice, ethers.parseUnits('3', 'gwei')) === '-1') {
        console.log('Gas price is too low, set to 3gwei', gasPrice, ethers.parseUnits('3', 'gwei'));
        gasPrice = ethers.parseUnits('3', 'gwei');
      }
      console.log('Gas info:', gasEstimate, gasPrice, gasEstimate * gasPrice, ethers.formatUnits(gasEstimate * gasPrice));
      return ethers.formatUnits(gasEstimate * gasPrice);
    } catch (error) {
      console.log(error?.info, 'estimateGasForTokenTransfer error');
      // if(error?.info?.error?.message.indexOf('insufficient funds') > -1) {
      //
      // }
      errorTip('获取gas费用失败，请稍后重试');
      // throw new Error('获取gas费用失败，请稍后重试');
    }
  }

  // 转账eth的gas费 amount传入的单位是ether
  async estimateGasForEthTransfer(fromAddress, toAddress, amount) {
    this.checkProvider();
    let gasPrice = (await this.provider.getFeeData()).gasPrice;
    console.log('Gas price:', gasPrice);
    const txRequest = {
      to: toAddress, // 接收方地址
      // 其他交易参数...
      from: fromAddress, // 发送方地址
      gasPrice: gasPrice,
      // gasLimit: 21000, // 限制gas消耗
      value: ethers.parseEther(amount.toString()) // 转账金额，单位是ether
    };
    try {
      // 获取gas费用
      const gasEstimate = await this.provider.estimateGas(txRequest);
      if (SafeCalc.compare(gasPrice, ethers.parseUnits('3', 'gwei')) === '-1') {
        console.log('Gas price is too low, set to 3gwei', gasPrice, ethers.parseUnits('3', 'gwei'));
        gasPrice = ethers.parseUnits('3', 'gwei');
      }
      console.log('Gas info:', gasEstimate, gasPrice, gasEstimate * gasPrice, ethers.formatUnits(gasEstimate * gasPrice));
      return ethers.formatUnits(gasEstimate * gasPrice);
    } catch (error) {
      console.log(error?.info, 'estimateGasForEthTransfer error');
      // if(error?.info?.error?.message.indexOf('insufficient funds') > -1) {
      //
      // }
      errorTip('获取gas费用失败，请稍后重试');
      // throw new Error('获取gas费用失败，请稍后重试');
    }
  }
}


