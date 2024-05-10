const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { Connection, PublicKey, Keypair } = require('@solana/web3.js');
const { performBacktest, startLiveTest } = require('./tradeLogic');
const downloadCSV = require('./dataDownloader');
const { simulateTradingFrom } = require('./simulateTrades');

const CONFIG_PATH = path.join(__dirname, 'config.json');
const botsFilePath = path.join(__dirname, 'bots.json');  // Path for bot configurations

function loadConfig() {
    if (fs.existsSync(CONFIG_PATH)) {
        return JSON.parse(fs.readFileSync(CONFIG_PATH));
    } else {
        return { accounts: [] };
    }
}

function saveConfig(config) {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 4));
}

function findAccountIndex(accounts, address) {
    return accounts.findIndex(acc => acc.address === address);
}

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false,
        }
    });
    mainWindow.loadFile('index.html');
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('load-accounts');
    });
}

app.whenReady().then(createWindow);

// Ensure bots.json exists
function initializeBotsFile() {
    if (!fs.existsSync(botsFilePath)) {
        fs.writeFileSync(botsFilePath, JSON.stringify([]), 'utf8');
    }
}

initializeBotsFile();

function readBotsConfig() {
    if (fs.existsSync(botsFilePath)) {
        return JSON.parse(fs.readFileSync(botsFilePath, 'utf8'));
    }
    return [];
}

function writeBotsConfig(bots) {
    fs.writeFileSync(botsFilePath, JSON.stringify(bots, null, 2), 'utf8');
}

const SOL_ADDRESS_REGEX = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

ipcMain.handle('save-account', async (event, accountData) => {
    if (!accountData || !accountData.address) {
        return { status: 'error', message: 'Solana address cannot be empty.' };
    }
    if (!SOL_ADDRESS_REGEX.test(accountData.address)) {
        return { status: 'error', message: 'Invalid Solana address provided.' };
    }
    let config = loadConfig();
    const index = findAccountIndex(config.accounts, accountData.address);
    if (index === -1) {
        config.accounts.push(accountData);
        saveConfig(config);
        return { status: 'success', message: 'Account added successfully' };
    } else {
        return { status: 'error', message: 'Account already exists' };
    }
});

ipcMain.handle('get-saved-accounts', async (event) => {
    let config = loadConfig();
    return config.accounts;
});

ipcMain.handle('delete-account', async (event, address) => {
    let config = loadConfig();
    const index = config.accounts.findIndex(acc => acc.address === address);
    if (index !== -1) {
        config.accounts.splice(index, 1);
        saveConfig(config);
        return { status: 'success', message: 'Account deleted successfully' };
    } else {
        return { status: 'error', message: 'Account not found' };
    }
});

ipcMain.handle('get-balance', async (event, { isProduction, address }) => {
    const networkUrl = isProduction ? 'https://api.mainnet-beta.solana.com' : 'https://api.devnet.solana.com';
    const connection = new Connection(networkUrl);
    const publicKey = new PublicKey(address);
    const balance = await connection.getBalance(publicKey);
    return { balance: balance / 1e9 };  // Convert lamports to SOL
});

ipcMain.handle('request-dev-sol', async (event, address) => {
    const networkUrl = 'https://api.devnet.solana.com';
    const connection = new Connection(networkUrl);
    const airdropSignature = await connection.requestAirdrop(
        new PublicKey(address),
        5 * 1000000000 // 5 SOL in lamports
    );
    await connection.confirmTransaction(airdropSignature);
    return { status: 'success', message: 'Attempted to Airdrop 5 SOL successfully. Please refresh balance to confirm. ' + address };
});

ipcMain.handle('perform-backtest', async (event) => {
    const result = await performBacktest();
    return result;
});

ipcMain.handle('start-live-test', async (event) => {
    const result = await startLiveTest();
    return result;
});

ipcMain.handle('download-csv', async () => {
    try {
        await downloadCSV();
        return { status: 'success', message: 'File downloaded and renamed successfully.' };
    } catch (error) {
        return { status: 'error', message: 'Failed to download and rename file.', error };
    }
});

ipcMain.handle('simulate-trading', async (event, startDate) => {
    const results = await simulateTradingFrom(startDate);
    return results;
});

ipcMain.handle('get-saved-bots', async (event) => {
    return readBotsConfig();
});

ipcMain.handle('save-bot', async (event, botData) => {
    const bots = readBotsConfig();
    botData.id = Date.now();
    bots.push(botData);
    writeBotsConfig(bots);
    return { status: 'success', message: 'Bot saved successfully', id: botData.id };
});

ipcMain.handle('delete-bot', async (event, botId) => {
    let bots = readBotsConfig();
    bots = bots.filter(bot => bot.id !== botId);
    writeBotsConfig(bots);
    return { status: 'success', message: 'Bot deleted successfully' };
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
