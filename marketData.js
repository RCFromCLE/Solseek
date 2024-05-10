const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

async function fetchHistoricalData() {
    const directoryPath = path.join(__dirname, 'sol_historical_data');
    const files = fs.readdirSync(directoryPath);

    const latestFile = files.filter(file => file.startsWith('SOL-USD')).sort().reverse()[0];

    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(path.join(directoryPath, latestFile))
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                resolve(results);
            })
            .on('error', (error) => {
                console.error('Error reading historical data:', error);
                reject([]);
            });
    });
}

async function fetchLiveData() {
    // Placeholder for live data fetching logic
    return { price: "Current market price" };
}

module.exports = { fetchHistoricalData, fetchLiveData };
