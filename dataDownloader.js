const axios = require('axios');
const fs = require('fs-extra');
const moment = require('moment');

const downloadCSV = async () => {
    const url = 'https://query1.finance.yahoo.com/v7/finance/download/SOL-USD?period1=1586476800&period2=1715289411&interval=1d&events=history&includeAdjustedClose=true';
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    });

    const date = moment().format('YYYY-MM-DD');
    const path = `./sol_historical_data/SOL-USD-${date}.csv`;

    // Ensure the directory exists
    await fs.ensureDir('./sol_historical_data');

    // Save the file with the current date appended
    const writer = fs.createWriteStream(path);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
};

downloadCSV().then(() => {
    console.log('File downloaded and renamed successfully.');
}).catch(err => {
    console.error('Failed to download and rename file:', err);
});
