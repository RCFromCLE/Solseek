const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    
    loadAccounts: () => ipcRenderer.invoke('get-saved-accounts'),
    saveAccount: (accountData) => ipcRenderer.invoke('save-account', accountData),
    deleteAccount: (address) => ipcRenderer.invoke('delete-account', address),
    placeTrade: (tradeDetails) => ipcRenderer.invoke('place-trade', tradeDetails),
    getBalance: (isProduction, address) => ipcRenderer.invoke('get-balance', isProduction, address),
    requestDevSol: (address) => ipcRenderer.invoke('request-dev-sol', address),
    performBacktest: () => ipcRenderer.invoke('perform-backtest'),
    startLiveTest: () => ipcRenderer.invoke('start-live-test'),

    loadBots: () => ipcRenderer.invoke('get-saved-bots'),
    saveBot: (botData) => ipcRenderer.invoke('save-bot', botData),
    deleteBot: (botId) => ipcRenderer.invoke('delete-bot', botId)
});
