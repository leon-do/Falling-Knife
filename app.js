const fs = require('fs')
require('es6-promise').polyfill()
require('isomorphic-fetch')

// ===========================

let previousData = {}
let myBalance = {
	coin: 	fs.readFileSync('coin.txt', 'utf8'),
	amount: fs.readFileSync('amount.txt', 'utf8')
}
const shapeShiftCoins = ['BTC', '1ST', 'ANT', 'BAT', 'BNT', 'BCH', 'BCY', 'BLK', 'BTCD', 'BTS', 'CVC', 'CLAM', 'DASH', 'DCR', 'DGB', 'DGD', 'DNT', 'DOGE', 'EMC', 'EDG', 'EOS', 'ETH', 'ETC', 'FCT', 'FUN', 'GAME', 'GNO', 'GNT', 'GUP', 'ICN', 'KMD', 'LBC', 'LSK', 'LTC', 'MAID', 'MLN', 'MTL', 'MONA', 'MSC', 'NBT', 'NMC', 'NMR', 'NVC', 'NXT', 'OMG', 'PAY', 'POT', 'PPC', 'QTUM', 'REP', 'RDD', 'RLC', 'SC', 'SNT', 'SJCX', 'START', 'STEEM', 'SNGLS', 'SWT', 'TKN', 'TRST', 'USDT', 'VOX', 'VRC', 'VTC', 'WAVES', 'WINGS', 'XCP', 'XMR', 'XRP', 'ZEC', 'ZRX']


const fallingKnife = () => {

	// get bittrex data
	fetch('https://bittrex.com/api/v1.1/public/getmarketsummaries')
	    .then(response => {
	    	// then convert to json
	        if (response.status >= 400) {
	            throw new Error("Bad response from server")
	        }
	        return response.result.json()
	    })
	    .then(currentData => {
	    	// then find the falling knife

	    	// the starting point
	    	if (Object.keys(previousData).length === 0){
	    		previousData = currentData
	    	}

	    	// this stores the greatest change
	    	let greatestChange = 0

	    	// compare to currentData to previousData=
	        for (let i in currentData){

	        	// find the largest change (this is the meat and potatoes)
	        	let change = (Number(currentData[i].last_price) - Number(previousData[i].last_price)) / Number(previousData[i].last_price)

	        	// save the greatest negative change
	        	if (change < greatestChange){
	        		greatestChange = currentData[i]
	        		greatestChange.knife = change
	        	}

	        }

	        // update previousData
	        previousData = currentData

	        // return greatestChange
	        return greatestChange
	    })
	    .then(greatestChange => {
	    	// do trade logic here
	    	console.log(greatestChange)

	    })
	    .then(() => {
	    	// set timeout then start over again
	    	setTimeout(() => {
	    		fallingKnife() 
	    	}, 5000);
	    })

}// fallingKnife()


fallingKnife()






