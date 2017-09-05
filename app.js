const Shapeshift = require('./lib/Shapeshift.js')
const Bittrex = require('./lib/Bittrex.js')
const fs = require('fs')
// ===========================

// reset txt file
let previousData = {}

const fallingKnife = async () => {

	// https://bittrex.com/api/v1.1/public/getmarketsummaries
	const currentData = await Bittrex.fetchJSON()
	if (currentData === false){
		return fallingKnife()
	}

	// if there is no previous data, then set them =
	if (Object.keys(previousData).length === 0){
		previousData = currentData
	}

	// loop through to find the greatest change
    let greatestChange = 0
    // set the best coin as shapeshiftCoin
    let shapeshiftCoin = {trade: false}
    for (let i = 0; i < currentData.result.length; i++){


    	/*
    	 The magicical logic
    	 - if the current 'change' is more than the 'greatest change' and
    	 - current change is greater than ___% and
    	 - the base coin is BTC and
    	 - the 'exchange coin' is in the 'shapeshift coin' list then
    	 - update the best coin to shapeshiftCoin
    	*/	   
    	let currentChange = (Number(currentData.result[i].Last) - Number(previousData.result[i].Last)) / Number(previousData.result[i].Last)
		let baseCoin = currentData.result[i].MarketName.split('-')[0]
		let exchangeCoin = currentData.result[i].MarketName.split('-')[1]
		let shapeShiftCoins = ['1ST', 'ANT', 'REP', 'BAT', 'BNT', 'CVC', 'DGD', 'DNT', 'EOS', 'ETH', 'FUN', 'GNO', 'GNT', 'MTL', 'OMG', 'QTUM', 'SNT', 'WINGS', 'ZRX']
    	
    	// this stores the greatest change
    	if (currentChange < greatestChange && 
    		currentChange < -0.001 &&
    		shapeShiftCoins.indexOf(exchangeCoin) != -1 &&
    		baseCoin === 'BTC'){
    			// update the greatestChange
    			greatestChange = currentChange
        		// update the best coin
        		shapeshiftCoin = {
        			trade: true,
        			exchangeCoin: exchangeCoin,
        			percent_change: greatestChange,
        		}
        }

    }// for loop

    
    console.log(`\n\n`, shapeshiftCoin)


    // set timeout then start over again
	setTimeout(() => {
		return fallingKnife() 
	}, 15 * 60 * 1000);

}
fallingKnife()