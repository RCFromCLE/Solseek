const { RSI, MACD, BollingerBands } = require('technicalindicators');

function calculateIndicators(data) {
    const inputRSI = {
        values: data,
        period: 14
    };
    const rsi = RSI.calculate(inputRSI);

    const inputMACD = {
        values: data,
        fastPeriod: 12,
        slowPeriod: 26,
        signalPeriod: 9,
        SimpleMAOscillator: false,
        SimpleMASignal: false
    };
    const macd = MACD.calculate(inputMACD);

    const inputBB = {
        values: data,
        period: 20,
        stdDev: 2
    };
    const bb = BollingerBands.calculate(inputBB);

    return { rsi, macd, bb };
}

module.exports = { calculateIndicators };
