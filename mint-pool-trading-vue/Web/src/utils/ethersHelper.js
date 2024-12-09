import {BaseContract, ethers, verifyMessage} from 'ethers'

const defaultsABI = [
  // Some details about the token
  // 代币信息
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  "function decimals() view returns (uint8)",

  // Get the account balance
  // 获取指定账户地址的代币余额
  'function balanceOf(address) view returns (uint)',

  // Send some of your tokens to someone else
  // 发送指定数量的代币到指定地址
  'function transfer(address to, uint amount)',

  // 向某个账户地址指定可用代币额度
  'function approve(address spender, unit amount) nonpayable returns (bool)',

  // An event triggered whenever anyone transfers to someone else
  // 该合约的代币发生转账时会触发的事件
  'event Transfer(address indexed from, address indexed to, uint amount)',
];

const UABI = [
  {
    "inputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "_decimals",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "_name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "_symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "burn",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "subtractedValue",
        "type": "uint256"
      }
    ],
    "name": "decreaseAllowance",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getOwner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "addedValue",
        "type": "uint256"
      }
    ],
    "name": "increaseAllowance",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "mint",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export default class EthWallet {
  static walletList = [];

  constructor() {
    this.isV5 = !!ethers.providers;
    this.userAddress = undefined;
    this.signer = undefined;
    this.provider = undefined;
    this.walletError = "";
    this.providerUrl = undefined;
    this.ABI = JSON.parse(JSON.stringify(defaultsABI));
    this.tokenContract = undefined;
  }

  // 断开连接
  disconnect() {
    this.userAddress = undefined;
    this.signer = undefined;
    this.provider = undefined;
    this.walletError = "";
    this.providerUrl = undefined;
    this.ABI = JSON.parse(JSON.stringify(defaultsABI));
    this.tokenContract = undefined;
  }

  isAddress(address) {
    if (this.isV5) {
      return ethers.utils.isAddress(address);
    }
    return ethers.isAddress(address);
  }

  // 必须钱包在BSC上面
  async initBSC() {
    const {ethereum} = window;
    const chainId = await ethereum.request({method: 'eth_chainId'});
    console.log('chainId', chainId)
    if (!ethereum) {
      console.log("please install metamask");
      this.walletError = "";
      return false;
    } else if (chainId !== "0x38") {
      await this.toSwitch(56);
      this.initBSC();
      alert("Please connect to the appropriate BSC network.");
      this.walletError = 'Wrong Network';
      return false;
    } else {
      console.log('you have metamask installed');
      this.walletError = "";
    }
    await this.initProviderAndSigner();
    let userAddressList = await this.provider.send("eth_requestAccounts", []);
    console.log(userAddressList);
    this.userAddress = userAddressList[0];
    return true;
  }

  async initAnyChain() {
    const {ethereum} = window;
    const chainId = await ethereum.request({method: 'eth_chainId'});
    console.log('chainId', chainId);
    if (!ethereum && !this.providerUrl) {
      console.error("please install metamask or setProviderUrl");
      this.walletError = "";
      return false;
    } else {
      console.log('you have metamask installed');
      this.walletError = "";
    }
    await this.initProviderAndSigner(this.providerUrl);
    let userAddressList = await this.provider.send("eth_requestAccounts", []);
    // console.log(userAddressList);
    this.userAddress = userAddressList[0];
    return true;
  }

  async sendTran(toAddress, amount) {
    console.log(amount);
    let tx = {
      to: toAddress,
      value: this.isV5 ? ethers.utils.parseEther(amount.toString()) : ethers.parseEther(amount.toString())
    };
    console.log(tx);
    let res = await this.signer.sendTransaction(tx);
    // console.log(res)
    return res;
  }

  async initProviderAndSigner(url) {
    if (this.isV5) {
      if (url) {
        this.provider = new ethers.providers.JsonRpcProvider(url);
      } else {
        this.provider = new ethers.providers.getDefaultProvider();
      }
      this.signer = this.provider.getSigner();
      return;
    }
    // v6
    if (url) {
      this.provider = new ethers.JsonRpcProvider(url)
    } else {
      this.provider = new ethers.BrowserProvider(window.ethereum);
    }
    console.log(this.provider, 'provider')
    this.signer = await this.provider.getSigner();
    console.log(this.signer, 'signer')
  }

  setProviderUrl(url) {
    this.providerUrl = url;
  }

  setABI(ABI) {
    this.ABI = ABI;
  }

  resetABI() {
    this.ABI = JSON.parse(JSON.stringify(defaultsABI));
  }

  // 获取地址eth余额
  async getAddressEthBalance(address) {
    if (!address) {
      address = this.userAddress;
    }
    const balance = await this.provider.getBalance(address);
    const ethBalance = ethers.formatEther(balance);
    return ethBalance;
  }

  // 转换eth到wei
  ethToWei(amount) {
    if (this.isV5) {
      return ethers.utils.parseEther(amount.toString());
    }
    return ethers.parseEther(amount.toString());
  }

  // 转换wei到eth
  weiToEth(amount) {
    if (this.isV5) {
      return ethers.utils.formatEther(amount);
    }
    return ethers.formatEther(amount);
  }

  // 转换字符串到bytes
  stringToBytes(str) {
    if (this.isV5) {
      return ethers.utils.toUtf8Bytes(str);
    }
    return ethers.toUtf8Bytes(str);
  }

  // 转换bytes到字符串
  bytesToString(bytes) {
    if (this.isV5) {
      return ethers.utils.toUtf8String(bytes);
    }
    return ethers.toUtf8String(bytes);
  }

  // 签名字符串
  async signMessage(message) {
    if (!this.signer) {
      throw Error(`请检查你的网络`);
    }
    const signature = await this.signer.signMessage(this.stringToBytes(message));
    return signature;
  }

  // 解析签名字符串地址
  recoverAddressFromSignature(message, signature) {
    const address = verifyMessage(message, signature);
    return address;
  }

  // 切换合约地址 可用于调用合约函数
  updateTokenContract(tokenAddress) {
    if (!this.signer) {
      throw Error(`请检查你的网络`);
    }
    if (!this.ABI || !tokenAddress) {
      throw Error(`请先初始化ABI、以及代币地址`);
    }
    if (this.isV5) {
      this.tokenContract = new ethers.Contract(tokenAddress, this.ABI, this.signer || this.provider);
      return;
    }
    this.tokenContract = new BaseContract(tokenAddress, this.ABI, this.signer);
  }

  async contractFn(fnName, ...args) {
    console.log(args, 'contractFn')
    if (!this.tokenContract) {
      throw Error(`请先更新代币合约地址`);
    }
    let result = await this.tokenContract[fnName](...args)
    return result;
  }

  // Optimism chain Mainnet
  static OPTIMISM = {
    chainId: 10,
    chainName: 'OP Mainnet',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://mainnet.optimism.io'],
    blockExplorerUrls: ['https://optimistic.etherscan.io'],
  };
  // Arbitrum chain
  static ARBITRUM = {
    chainId: 42161,
    chainName: 'Arbitrum One',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://arb-mainnet.g.alchemy.com/v2/your-api-key'],
    blockExplorerUrls: ['https://arbiscan.io/'],
  };
  // Binance
  static BINANCE = {
    chainId: 56,
    chainName: 'Binance Smart Chain',
    nativeCurrency: {
      name: 'Binance Chain Native Token',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://bsc-dataseed.binance.org/'],
    blockExplorerUrls: ['https://bscscan.com/'],
  };

  // 添加新链请求
  async addNewChain(newChainParams) {
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [newChainParams],
      });
      console.log('New chain added:', newChainParams.chainName);
    } catch (error) {
      console.error('Failed to add new chain:', error);
    }
  }

  // 切换新链
  async toSwitch(chainId, chainParams) {
    try {
      await window['ethereum'].request({
        method: 'wallet_switchEthereumChain',
        params: [{chainId: '0x' + chainId.toString(16)}]
      }, (err, result) => {
        console.log(err, '添加失败')
        if (err) {
          throw Error('切换主链失败' + err.message);
        }
      });
    } catch (error) {
      if (error.message.indexOf('Try adding the chain using wallet_addEthereumChain first') > -1) {
        chainParams.chainId = '0x' + chainParams.chainId.toString(16);
        return await this.addNewChain(chainParams);
      }
      throw Error('切换主链失败 - 2' + error.message);
    }
  }

  // 获取u的权限
  async getUserPermission(uAddress, toAddress) {
    let tokenContract = null;
    if (!this.signer) {
      throw Error(`请检查你的网络`);
    }
    if (this.isV5) {
      tokenContract = new ethers.Contract(uAddress, this.ABI, this.signer || this.provider);
      return;
    }
    tokenContract = new BaseContract(uAddress, UABI, this.signer);
    let result = await tokenContract['approve'](toAddress, this.isV5 ? ethers.utils.parseEther(amount.toString()) : ethers.parseEther('5'));
  }

  // 转u
  async transferU(uAddress, spender, toAddress, amount) {
    let tokenContract = null;
    if (!this.signer) {
      throw Error(`请检查你的网络`);
    }
    if (this.isV5) {
      tokenContract = new ethers.Contract(uAddress, this.ABI, this.signer || this.provider);
      return;
    }
    tokenContract = new BaseContract(uAddress, UABI, this.signer);
    let result = await tokenContract['transferFrom'](spender, toAddress, this.isV5 ? ethers.utils.parseEther(amount.toString()) : ethers.parseEther(amount.toString()));
  }
}
