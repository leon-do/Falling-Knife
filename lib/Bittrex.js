// gets bittrex data in JSON form

require('es6-promise').polyfill()
require('isomorphic-fetch')

exports.fetchJSON = () => {
	return new Promise((resolve, reject) => {
		fetch('https://bittrex.com/api/v1.1/public/getmarketsummaries')
	    .then(response => {
	        if (response.status >= 400) {
	            return false
	        }
	        return response
	    })
	    .then(response => {
	    	if (response === false){
	    		resolve(false)
	    	}
	    	resolve(response.json())
	    })
	})
} 
