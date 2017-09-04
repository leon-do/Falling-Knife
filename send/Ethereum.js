'use strict'
const config = require('./config.js')
const fs = require('fs')
const Tx = require('ethereumjs-tx');
const Web3 = require('web3')

const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/2HSUZ74pwuqqG9FGfpCg'))
// --------------------------------------

const coin = 'ETH'
const sendAddress = config.KEYS[coin].ADDRESS
const sendPrivKey = new Buffer(config.KEYS[coin].PRIVKEY, 'hex')
const sendAmount = Number(fs.readFileSync('../amount.txt', 'utf8'))
const shapeShiftAddress = '0xAd8dDd8942BC85A403737C5c406701c1357f4A54'

console.log('sendAddress:', sendAddress)
console.log('sendPrivKey:', sendPrivKey)
console.log('sendAmount:', sendAmount)
console.log('shapeShiftAddress:', shapeShiftAddress)
// --------------------------------------

/*
const sendAddress = '0xc70103eddcA6cDf02952365bFbcf9A4A76Cd2066'
const sendPrivKey = 'bd31efa81ffe64275d1641fb4e1dddcdc53eaf390390a4a42e571c999e708f94'
const shapeShiftAddress = '0x5873E7b7F909B4F76ce4B7B3338DB674F1aC3a02'
const privateKey = new Buffer(sendPrivKey, 'hex')
const sendAmount = 0.1
*/


var rawTx = {
    nonce: web3.toHex(web3.eth.getTransactionCount(sendAddress)),
    gasPrice: web3.toHex(20000000000),
    gasLimit: web3.toHex(100000),
    to: shapeShiftAddress,
    value: web3.toHex(web3.toWei(sendAmount, "ether")),
    data: 'ldo'
}

var tx = new Tx(rawTx);
tx.sign(sendPrivKey);

var serializedTx = tx.serialize()

web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
  if (err)
  {
      console.log(err)
  } else {
      console.log('\n\n txHash:', hash) // "0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385"
  }
});