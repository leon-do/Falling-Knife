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
const sendAmount = Number(fs.readFileSync('amount.txt', 'utf8'))

const shapeShiftAddress = '17Gz8ae2V4Ytfs6wftWJLMmcNtR2ad9EDt'



// get txID
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

		// Add the input (who is paying):
		// [previous transaction hash, index of the output to use]
		var balance = 0;
        var inputCount = 0;
		data.unspent_outputs.forEach(function(uo) {
			tx.addInput(uo.tx_hash_big_endian, uo.tx_output_n);
			balance += uo.value;
        	inputCount++;
		});

		// Calculate Transaction Fee
        var txfee = txfeemin = 1000;
        //Estimate transaction size in bytes
        var txSize = inputCount * 180 + 2 * 34 + 10 + inputCount;
        //Blockchain: Minimum fee is 1.5 satoshi / Byte
        if (txSize * 2 > txfeemin){
        	txfee = txSize * 2
        }

		// Add the output (who to pay to):
		// [payee's address, amount in satoshis]
		tx.addOutput(shapeShiftAddress, sendAmount * 100000000 - txfee)
		
        // Initialize a private key using WIF
		var keyPair = bitcoin.ECPair.fromWIF(sendPrivKey)
		
		// Sign the first input with the new key
		tx.sign(0, keyPair)

		// Print transaction serialized as hex
		return tx.build().toHex()
    })

    // send hex to blockchain
    .then(txHex =>{

    	console.log(txHex)

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
