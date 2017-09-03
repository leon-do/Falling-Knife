const fs = require('fs')
require('es6-promise').polyfill()
require('isomorphic-fetch')

// ===========================

// stores the previous data
let previousData = {}


const fallingKnife = () => {

	// get bittrex data
	fetch('https://bittrex.com/api/v1.1/public/getmarketsummaries')

		// convert to json
	    .then(response => {
	        if (response.status >= 400) {
	            throw new Error("Bad response from server")
	        }
	        return response.json()
	    })

	   	// find the falling knife 
	    .then(currentData => {

	    	// get the data
	    	currentData = currentData.result

	    	// the starting point
	    	if (Object.keys(previousData).length === 0){
	    		previousData = currentData
	    	}

	    	// this stores the greatest change
	    	let greatestChange = 0

	    	// compare currentData to previousData
	        for (let i in currentData){

	        	/*
	        	 The magicical logic
	        	 - if the current 'change' is more than the 'greatest change' and
	        	 - the base coin is BTC and
	        	 - the 'exchange coin' is in the 'shapeshift coin' list
	        	 - then update greatestChange
	        	*/	        	
	        	const currentChange = (Number(currentData[i].Last) - Number(previousData[i].Last)) / Number(previousData[i].Last)
	    		const baseCoin = currentData[i].MarketName.split('-')[0]
	    		const exchangeCoin = currentData[i].MarketName.split('-')[1]
	    		const shapeShiftCoins = ['BTC', '1ST', 'ANT', 'BAT', 'BNT', 'BCH', 'BCY', 'BLK', 'BTCD', 'BTS', 'CVC', 'CLAM', 'DASH', 'DCR', 'DGB', 'DGD', 'DNT', 'DOGE', 'EMC', 'EDG', 'EOS', 'ETH', 'ETC', 'FCT', 'FUN', 'GAME', 'GNO', 'GNT', 'GUP', 'ICN', 'KMD', 'LBC', 'LSK', 'LTC', 'MAID', 'MLN', 'MTL', 'MONA', 'MSC', 'NBT', 'NMC', 'NMR', 'NVC', 'NXT', 'OMG', 'PAY', 'POT', 'PPC', 'QTUM', 'REP', 'RDD', 'RLC', 'SC', 'SNT', 'SJCX', 'START', 'STEEM', 'SNGLS', 'SWT', 'TKN', 'TRST', 'USDT', 'VOX', 'VRC', 'VTC', 'WAVES', 'WINGS', 'XCP', 'XMR', 'XRP', 'ZEC', 'ZRX']
	        	
	        	if (currentChange < greatestChange && 
	        		shapeShiftCoins.indexOf(exchangeCoin) != -1 &&
	        		baseCoin === 'BTC'){
		        		greatestChange = currentData[i]
		        		greatestChange.knife = currentChange
		        		greatestChange.coin = exchangeCoin
	        	}

	        	// update value of BTC-coin.txt
	        	if (fs.readFileSync('coin.txt', 'utf8') === exchangeCoin &&
	        		baseCoin === 'BTC'){
	        			fs.writeFileSync('last.txt', currentData[i].Last, 'utf8')
	        	}

	        }

	        // update previousData
	        previousData = currentData

	        // return greatestChange
	        return greatestChange
	    })

	   	// trade here
	    .then(recieveAccount => {

			/*
			recieveAccount = { 
				MarketName: 'BTC-DOGE',
				High: 5.1e-7,
				Low: 4.7e-7,
				Volume: 488940233.94318575,
				Last: 4.7e-7,
				BaseVolume: 238.90044034,
				TimeStamp: '2017-09-03T15:12:05.79',
				Bid: 4.7e-7,
				Ask: 4.8e-7,
				OpenBuyOrders: 1449,
				OpenSellOrders: 8299,
				PrevDay: 4.7e-7,
				Created: '2014-02-13T00:00:00',
				knife: -0.020833333333333245,
				coin: 'DOGE' 
			}
			*/

	    	// if there is not change, then skip the trade logic
	    	if (recieveAccount === 0) {
	    		return "not trading..."
	    	}
	    	
	    	// figure out where my money is
	    	let sendAccount = {
				coin: 	fs.readFileSync('coin.txt', 'utf8'),
				amount: fs.readFileSync('amount.txt', 'utf8'),
				last : 	fs.readFileSync('last.txt', 'utf8'),
			}

			// new balance (Fancy math here)
			const recieveAmount = Number(sendAccount.amount) * Number(sendAccount.last) / Number(recieveAccount.Last)

			// transfer my money to the new coin
			fs.writeFileSync('coin.txt', recieveAccount.coin, 'utf8')
			fs.writeFileSync('amount.txt', recieveAmount, 'utf8')

			// display message
			return {}


	    })

	    // display message
	    .then((message) => {

	    	message.coin = fs.readFileSync('coin.txt', 'utf8')
	    	message.amount = fs.readFileSync('amount.txt', 'utf8')
	    	
	    	console.log(message)

	    	// set timeout then start over again
	    	setTimeout(() => {
	    		fallingKnife() 
	    	}, 5000);
	    })


}// fallingKnife()


fallingKnife()






