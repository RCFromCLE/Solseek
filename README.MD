# RC's Solana Trading Bot

Welcome to RC's Solana Trading Bot! This project allows you to manage Solana wallets, view current SOL prices, and interact with the Solana blockchain using a user-friendly desktop application built with Electron.

## Features

- **Wallet Management:** Add, delete, or view information about your Solana wallets.
- **Network Selection:** Choose between Production and Development networks.
- **Price Monitoring:** See the live price of SOL with frequent automatic updates.
- **Balance Check:** Quickly view the current balance of selected wallets.
- **Devnet Faucet:** Request up to 5 SOL from the Devnet faucet for testing purposes.

## Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/solana-trading-bot.git
    ```

2. **Navigate to the project directory:**

    ```bash
    cd solana-trading-bot
    ```

3. **Install dependencies:**

    ```bash
    npm install
    ```

4. **Start the application:**

    ```bash
    npm start
    ```

## Usage

- **Add a Wallet:** Select "+ Add New Account" from the dropdown, enter the necessary information, and click "Save Account."
- **Select an Account:** Use the dropdown to switch between wallets. Network type (Production or Development) is indicated next to the wallet name.
- **Check Balance:** Click "Get Balance" to refresh the selected wallet's balance.
- **Request Devnet SOL:** For Development wallets only, click "Request SOL" to receive up to 5 SOL via an airdrop.
- **Delete Wallet:** Select the wallet you wish to remove, then click "Delete Wallet Info."

## Technical Details

- **Backend:** Utilizes Electron's `ipcMain` to handle inter-process communication and manage wallet data in `config.json`.
- **UI:** Basic HTML and JavaScript combined with the `TradingView` widget for visualizing price data.
- **Blockchain Integration:** Interacts with the Solana blockchain via the `@solana/web3.js` library.

## Contributions

Contributions are welcome! If you'd like to add features or fix bugs, feel free to fork the repository, make your changes, and submit a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

**Enjoy trading on Solana!**
