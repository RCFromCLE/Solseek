const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { Connection, PublicKey, Keypair } = require('@solana/web3.js');
const fetch = require('cross-fetch');

const CONFIG_PATH = path.join(__dirname, 'config.json');

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
        height: 1600,
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

ipcMain.handle('save-account', async (event, accountData) => {
    if (!accountData || !accountData.address){
        return {
            status: 'error',
            message: 'Account cannot be added without a valid address.'
        };
    }
    let config = loadConfig();
    const index = findAccountIndex(config.accounts, accountData.address);
    if (index === -1) {
        config.accounts.push(accountData);
        saveConfig(config);
        event.sender.send('account-saved', 'Account saved successfully');
        return { status: 'success', message: 'Account saved successfully' };
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
        config.accounts.splice(index, 1);  // Remove the account
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
        5 * 1000000000 // 5 SOL in lamports (The most you can request at once is 5 SOL)
    );
    await connection.confirmTransaction(airdropSignature);
    return { status: 'success', message: 'Attempted to Airdrop 5 SOL successfully. Please refresh balance to confirm. ' + address  };
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