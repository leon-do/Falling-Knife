var shapeshift = require('shapeshift.io')

var pair = 'btc_ltc'

shapeshift.depositLimit(pair, function (err, limit) {
  console.log('limit', limit) // => '4.41101872'
})



shapeshift.exchangeRate(pair, function (err, rate) {
  console.log('rate', rate) // => '158.71815287'
})


shapeshift.isDown(function (err, isDown) {
  console.log(isDown) // => true or false
})