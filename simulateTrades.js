const { fetchHistoricalData } = require('./marketData');
const moment = require('moment');

async function simulateTradingFrom(startDate) {
    const historicalData = await fetchHistoricalData();
    let initialPrice = 0;
    let finalPrice = 0;
    let profitLoss = 0;

    // Filter data from start date
    const filteredData = historicalData.filter(data => {
        return moment(data.date).isSameOrAfter(moment(startDate));
    });

    if (filteredData.length > 0) {
        initialPrice = filteredData[0].price;  // Assuming price is in a 'price' property
        finalPrice = filteredData[filteredData.length - 1].price;
        profitLoss = ((finalPrice - initialPrice) / initialPrice) * 100;  // Percentage profit or loss
    }

    return { initialPrice, finalPrice, profitLoss };
}

module.exports = { simulateTradingFrom };
