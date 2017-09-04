'use strict'
const shapeshift = require('shapeshift.io') // https://github.com/exodusmovement/shapeshift.io
const config = require('./config.js')
const fs = require('fs')
// --------------------------------------

const withdrawlCoin = fs.readFileSync('../coin.txt', 'utf8')
const withdrawalAddress = config.KEYS[withdrawlCoin].ADDRESS
const amount = Number(fs.readFileSync('../amount.txt', 'utf8'))

const shapeshiftCoin = 'EOS'

const pair = `${withdrawlCoin.toLowerCase()}_${shapeshiftCoin.toLowerCase()}`

console.log('\n\n\n')
console.log('SHAPESHIFT.js')
console.log('withdrawlCoin:', withdrawlCoin)
console.log('withdrawalAddress:', withdrawalAddress)
console.log('amount:', amount)
console.log('shapeshiftCoin', shapeshiftCoin)
console.log('pair:', pair)

// --------------------------------------

// if something fails 
var options = {
	returnAddress: '0x4A441B2d01e2b30CB9d065F641F9513091755025',
	amount: amount // <---- must set amount here 
}

shapeshift.shift(withdrawalAddress, pair, options, function (err, returnData) {
	// ShapeShift owned BTC address that you send your BTC to 
	console.log(returnData)
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

	console.log(`\n\n Send ${withdrawlCoin} to ${returnData.deposit}`)

	// later, you can then check the deposit status 
	shapeshift.status(returnData.deposit, function (err, status, data) {
		console.log('status:', status) // => should be 'received' or 'complete' 
	})
})





