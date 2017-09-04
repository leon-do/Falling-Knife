/*
	input: coin1, coin2 --> some magic --> output: send coin1 to this address or false
*/
// --------------------------------------
'use strict'
const shapeshift = require('shapeshift.io') // https://github.com/exodusmovement/shapeshift.io
const config = require('./config.js')		// contains pub and pri keys
const fs = require('fs')					// read from txt files
// --------------------------------------

// shapeshiftCoin = 'EOS'
exports.getDepositAddress = (shapeshiftCoin) => {

	return new Promise((resolve, reject) => {

		// ----------Prep the variables----------------------------


		const withdrawlCoin = fs.readFileSync('./coin.txt', 'utf8')
		const withdrawalAddress = config.KEYS[withdrawlCoin].ADDRESS
		const amount = Number(fs.readFileSync('./amount.txt', 'utf8'))
		const pair = `${withdrawlCoin.toLowerCase()}_${shapeshiftCoin.toLowerCase()}`

		console.log('shapeshift.js :: constants = ', {
			'withdrawlCoin': withdrawlCoin,
			'withdrawalAddress': withdrawalAddress,
			'amount': amount,
			'shapeshiftCoin': shapeshiftCoin,
			'pair': pair
		})

		// --------------------------------------


		// if something fails 
		var options = {
			returnAddress: '0x4A441B2d01e2b30CB9d065F641F9513091755025',
			amount: amount // <---- must set amount here 
		}

		shapeshift.shift(withdrawalAddress, pair, options, function (err, returnData) {
			// ShapeShift owned BTC address that you send your BTC to 

			/*
			returnData = { 
				orderId: '5ebb666a-2cde-4abe-bfb3-cd770b900487',
				pair: 'eth_eos',
				withdrawal: '0x4a441b2d01e2b30cb9d065f641f9513091755025',
				withdrawalAmount: '1',
				deposit: '0x3180b59cb06be407e673bfa7e6d86c078ba16ab0',
				depositAmount: '0.00343938',
				expiration: 1504555988461,
				quotedRate: '302.38042976',
				maxLimit: 16.4705551,
				returnAddress: '0x4A441B2d01e2b30CB9d065F641F9513091755025',
				apiPubKey: 'shapeshift',
				minerFee: '0.04' 
			}
			*/

			if (err){
				resolve(false)
			} else {
				resolve(returnData.deposit)
			}

		})//shapeshift.shift

	})// promise

}// exports












