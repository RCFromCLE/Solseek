const { fetchHistoricalData, fetchLiveData } = require('./marketData');
const { calculateIndicators } = require('./indicators');

function performBacktest(botId) {
    // Add logic to perform backtest based on the selected bot's configuration
}

function startLiveTest(botId) {
    // Add logic to start live test based on the selected bot's configuration
}

module.exports = { performBacktest, startLiveTest };
