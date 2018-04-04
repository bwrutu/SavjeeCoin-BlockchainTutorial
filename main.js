// this gives us the sha256 encryption
const SHA256 = require('crypto-js/sha256');

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}

class Block {
  constructor(timestamp, transactions, previousHash = '') {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    // before writing this method you would install the crypto-js lib
    return SHA256(this.index + this.timestamp + JSON.stringify(this.transactions) + this.previousHash + this.nonce).toString();
  }

  mineBlock(difficulty) {
    while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
      this.nonce++;
      this.hash = this.calculateHash();
    }

    console.log("Block mined:" + this.hash);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  createGenesisBlock() {
    return new Block("01/01/2018", "Gensis Block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  // This was removed in third video, and was replaced by the method 'mine pending transactions'
  //addBlock(newBlock) {
    //newBlock.previousHash = this.getLatestBlock().hash;
    //newBlock.mineBlock(this.difficulty);
    //this.chain.push(newBlock);
  //}

  minePendingTransactions(miningRewardAddress) {
    let block = new Block(Date.now(), this.pendingTransactions);
    block.mineBlock(this.difficulty);

    console.log("Block successfully mined!");
    this.chain.push(block);

    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress,this.miningReward);
    ];
  }

  createTransaction(transaction) {
    this.pendingTransactions.push(transaction);
  }

  getBalanceOfAddress(address) {
    let balance = 0;

    for(const block of this.chain) {
      for (const trans of block.transactions) {
        if(trans.fromAddress === address)
        {
          balanace -= trans.amount;
        }

        if(trans.toAddress === address){
          balance += trans.amount;
        }
      }
    }

    return balance;
  }

  isChainValid() {
    for(let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if(currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }

      return true;
    }
  }
}

let savjeeCoin = new BlockChain();
// Console code from the first video (which is invalidated due to refactoring in the third video)
//console.log("mining block 1...")
//savjeeCoin.addBlock(new Block("26/02/2018", {amount: 4}));
//console.log("mining block 2...")
//savjeeCoin.addBlock(new Block("26/02/2018", {amount: 10}));

// Console code from the first video
//console.log('Is blockchain valid? ' + savjeeCoin.isChainValid());

// This is an attempt to demonstrate how changes in the block chain are difficult
// This is a manual change the amount that is stored in the transactions field on one of the blocks
//savjeeCoin.chain[1].transactions = {amount: 100};
// This is an attempt to recalculate the hash of the block that has the transactions changed
//savjeeCoin.chain[1].hash = savejee.chain[1].calculateHash();

//console.log('Is blockchain valid? ' + savjeeCoin.isChainValid());

//console.log(JSON.stringify(savejeeCoin, null, 4));

// Console code from the third video
// These two lines add transactions to the pending transactions array
savejeeCoin.createTransaction(new Transaction('address1', 'address2', 100));
savejeeCoin.createTransaction(new Transaction('address2', 'address1', 50));

// this mines the pending transactions array
console.log('\n Starting the miner...');
// this tells us who is mining the blockchain to give them a reward for doing so
savjeeCoin.minePendingTransactions('xaviers-address');

// this shows the balanace (should be 0) as our reward is in the next iterations of the pending transactions array
console.log('\nBalance of xavier is', savjeeCoin.getBalanceOfAddress('xaviers-address'));

// this mines the pending transactions array
console.log('\n Starting the miner again...');
// this tells us who is mining the blockchain to give them a reward for doing so
savjeeCoin.minePendingTransactions('xaviers-address');

// this shows the balanace (should be 100) as our reward is in the next iterations of the pending transactions array
console.log('\nBalance of xavier is', savjeeCoin.getBalanceOfAddress('xaviers-address'));
