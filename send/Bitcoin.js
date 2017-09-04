// https://chatbotsmagazine.com/building-the-most-basic-bitcoin-wallet-ever-in-facebook-messenger-a71014d46258
// https://www.npmjs.com/package/bitcoinjs-lib

const config = require('./config.js')
const bitcoin = require('bitcoinjs-lib') 
const fs = require('fs')
require('es6-promise').polyfill()
require('isomorphic-fetch')

const coin = 'BTC'
const sendAddress = config.KEYS[coin].ADDRESS
const sendPrivKey = config.KEYS[coin].PRIVKEY
const sendAmount = Number(fs.readFileSync('../amount.txt', 'utf8'))

const shapeShiftAddress = '17Gz8ae2V4Ytfs6wftWJLMmcNtR2ad9EDt'


// get txID
// https://blockchain.info/unspent?active=12vSiUHtXCLYukFj3J5JF7mfFRSDgYbeBx
fetch(`https://blockchain.info/de/unspent?cors=true&active=${sendAddress}`)

	// convert to json
    .then(response => {
        if (response.status >= 400) {
            throw new Error("Bad response from server")
        }
        return response.json()
    })

   	// create transaction
    .then(data => {

        var tx = new bitcoin.TransactionBuilder()

        console.log(tx)
        var txfeemin = 1000;
        var balance = 0;
        var inputCount = 0;
        data.unspent_outputs.forEach(function(uo) {
          tx.addInput(uo.tx_hash_big_endian, uo.tx_output_n);
          balance += uo.value;
          inputCount++;
        });
        
        var txfee = txfeemin;
        //Estimate transaction size in bytes
        var txSize = inputCount * 180 + 2 * 34 + 10 + inputCount;
        //Blockchain: Minimum fee is 1.5 satoshi / Byte
        if (txSize * 2 > txfeemin)
          txfee = txSize * 2;

      	console.log('sendAmount', sendAmount * 100000000)
		console.log('txfee', txfee)
		console.log('balance', balance)

        tx.addOutput(shapeShiftAddress, sendAmount * 100000000 - txfee);

        tx.addOutput(sendAddress, balance - sendAmount * 100000000);

        // Initialize a private key using WIF
		var keyPair = bitcoin.ECPair.fromWIF(sendPrivKey)

        for (var i = 0; i < inputCount; i++){
        	tx.sign(i, keyPair)
        }

        var txHex = tx.build().toHex();

        console.log(txHex)

    })

    // send hex to blockchain
    .then(txHex =>{


		// // pushing raw transaction to Blockchain.info API
		// return fetch('https://blockchain.info/pushtx?cors=true', {
		// 	method: 'POST',
		// 	data: 'tx=' + txHex
		// })
		// .then(response => {
		// 	if (response.status >= 400) {
		// 		throw new Error("Bad response from server")
		// 	}
		// 	return response.json()
		// })

    })
