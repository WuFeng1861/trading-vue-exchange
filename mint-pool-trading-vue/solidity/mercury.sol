// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.6;

import "contracts/Strings.sol";

/**
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }

    function _contextSuffixLength() internal view virtual returns (uint256) {
        return 0;
    }
}


/**
 * @dev Contract module which allows children to implement an emergency stop
 * mechanism that can be triggered by an authorized account.
 *
 * This module is used through inheritance. It will make available the
 * modifiers `whenNotPaused` and `whenPaused`, which can be applied to
 * the functions of your contract. Note that they will not be pausable by
 * simply including this module, only once the modifiers are put in place.
 */
abstract contract Pausable is Context {
    bool private _paused;

    /**
     * @dev Emitted when the pause is triggered by `account`.
     */
    event Paused(address account);

    /**
     * @dev Emitted when the pause is lifted by `account`.
     */
    event Unpaused(address account);

    /**
     * @dev The operation failed because the contract is paused.
     */
    error EnforcedPause();

    /**
     * @dev The operation failed because the contract is not paused.
     */
    error ExpectedPause();

    /**
     * @dev Initializes the contract in unpaused state.
     */
    constructor() {
        _paused = false;
    }

    /**
     * @dev Modifier to make a function callable only when the contract is not paused.
     *
     * Requirements:
     *
     * - The contract must not be paused.
     */
    modifier whenNotPaused() {
        _requireNotPaused();
        _;
    }

    /**
     * @dev Modifier to make a function callable only when the contract is paused.
     *
     * Requirements:
     *
     * - The contract must be paused.
     */
    modifier whenPaused() {
        _requirePaused();
        _;
    }

    /**
     * @dev Returns true if the contract is paused, and false otherwise.
     */
    function paused() public view virtual returns (bool) {
        return _paused;
    }

    /**
     * @dev Throws if the contract is paused.
     */
    function _requireNotPaused() internal view virtual {
        if (paused()) {
            revert EnforcedPause();
        }
    }

    /**
     * @dev Throws if the contract is not paused.
     */
    function _requirePaused() internal view virtual {
        if (!paused()) {
            revert ExpectedPause();
        }
    }

    /**
     * @dev Triggers stopped state.
     *
     * Requirements:
     *
     * - The contract must not be paused.
     */
    function _pause() internal virtual whenNotPaused {
        _paused = true;
        emit Paused(_msgSender());
    }

    /**
     * @dev Returns to normal state.
     *
     * Requirements:
     *
     * - The contract must be paused.
     */
    function _unpause() internal virtual whenPaused {
        _paused = false;
        emit Unpaused(_msgSender());
    }
}

abstract contract EthrunesProtocol {
    event ethrunes_protocol_Inscribe(
        address indexed to,
        string content
    );
}

contract MultiSigWallet {
    address[] public owners;
    uint public numConfirmationsRequired;

    struct Transaction {
        address to;
        uint value;
        bytes data;
        bool executed;
        uint numConfirmations;
        uint locktime;
    }

    Transaction[] public transactions;

    mapping(address => bool) public isOwner;
    mapping(uint => mapping(address => bool)) public isConfirmed;

    event SubmitTransaction(address indexed owner, uint indexed txIndex, address indexed to, uint value, bytes data);
    event ConfirmTransaction(address indexed owner, uint indexed txIndex);
    event ExecuteTransaction(address indexed owner, uint indexed txIndex);
    event RevokeConfirmation(address indexed owner, uint indexed txIndex);

    constructor(address[] memory _owners, uint _numConfirmationsRequired) {
        require(_owners.length > 0, "Owners required");
        require(_numConfirmationsRequired > 0 && _numConfirmationsRequired <= _owners.length, "Invalid number of required confirmations");

        for (uint i = 0; i < _owners.length; i++) {
            address owner = _owners[i];
            require(owner != address(0), "Invalid owner");
            require(!isOwner[owner], "Owner not unique");
            isOwner[owner] = true;
            owners.push(owner);
        }

        numConfirmationsRequired = _numConfirmationsRequired;
    }

    function multiSigTranLen()  public view returns (uint) {
        return transactions.length;
    }

    function multiSigSetOwner(address _oldOwner,address _newOwner) public {
        require(msg.sender==address(this));
        require(isOwner[_oldOwner], "old Not owner");
        require(!isOwner[_newOwner], "new Is owner");

        isOwner[_oldOwner] = false;
        isOwner[_newOwner] = true;
    }

    function submitTransaction(address _to, uint _value, bytes memory _data) public returns (uint) {
        require(isOwner[msg.sender], "Not owner");
        uint txIndex = transactions.length;
        transactions.push(Transaction({
            to: _to,
            value: _value,
            data: _data,
            executed: false,
            numConfirmations: 0,
            locktime: block.timestamp + 3 minutes
        }));
        emit SubmitTransaction(msg.sender, txIndex, _to, _value, _data);

        confirmTransaction(txIndex);

        return txIndex;
    }

    function confirmTransaction(uint _txIndex) public {
        require(isOwner[msg.sender], "Not owner");
        require(_txIndex < transactions.length, "Invalid transaction index");
        require(!isConfirmed[_txIndex][msg.sender], "Transaction already confirmed");

        Transaction storage transaction = transactions[_txIndex];
        transaction.numConfirmations++;
        isConfirmed[_txIndex][msg.sender] = true;

        emit ConfirmTransaction(msg.sender, _txIndex);

        if (transaction.numConfirmations >= numConfirmationsRequired) {
            executeTransaction(_txIndex);
        }
    }

    function executeTransaction(uint _txIndex) public {
        require(_txIndex < transactions.length, "Invalid transaction index");

        Transaction storage transaction = transactions[_txIndex];
        require(!transaction.executed, "Transaction already executed");
        require(transaction.numConfirmations >= numConfirmationsRequired, "Not enough confirmations");

        if(transaction.locktime>block.timestamp) return ;

        transaction.executed = true;
        (bool success, ) = transaction.to.call{value: transaction.value} (transaction.data);
        require(success, "Transaction execution failed");

        emit ExecuteTransaction(msg.sender, _txIndex);
    }

    function revokeConfirmation(uint _txIndex) public {
        require(isOwner[msg.sender], "Not owner");
        require(_txIndex < transactions.length, "Invalid transaction index");

        Transaction storage transaction = transactions[_txIndex];
        require(transaction.executed == false, "Transaction already executed");
        require(isConfirmed[_txIndex][msg.sender], "Transaction not confirmed");

        transaction.numConfirmations--;
        isConfirmed[_txIndex][msg.sender] = false;

        emit RevokeConfirmation(msg.sender, _txIndex);
    }
}

contract mercury is Pausable, EthrunesProtocol ,MultiSigWallet {
    uint256 public constant FEE = 0.00001 ether;
    uint256 public counter = 0;

    constructor (address[] memory _owners, uint _numConfirmationsRequired) MultiSigWallet(_owners,_numConfirmationsRequired) {
    }

    receive() external payable whenNotPaused {
        require(msg.value >= FEE, "Mercury: fee not enough");
        string memory str = string( Strings.toString(msg.value) );
        emit ethrunes_protocol_Inscribe(msg.sender,str); 
    }

    function withdraw(address recipient) public {
        require(msg.sender==address(this));
        payable(recipient).transfer(address(this).balance);
    }

    function withdraw(address recipient, uint256 balance) public {
        require(msg.sender==address(this));
        payable(recipient).transfer(balance);
    }

    function pause() public {
        require(msg.sender==address(this));
        _pause();
    }

    function unpause() public {
        require(msg.sender==address(this));
        _unpause();
    }

    function strConcat(string memory _a, string memory _b) public pure returns (string memory){
        bytes memory _ba = bytes(_a);
        bytes memory _bb = bytes(_b);
        string memory ret = new string(_ba.length + _bb.length);
        bytes memory bret = bytes(ret);
        uint k = 0;
        for (uint i = 0; i < _ba.length; i++) bret[k++] = _ba[i];
        for (uint i = 0; i < _bb.length; i++) bret[k++] = _bb[i];
        return string(ret);
    }



}

