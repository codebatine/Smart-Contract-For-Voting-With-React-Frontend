# Voting DApp Frontend

This is a DApp that allows users to create polls, vote on movies and determine the winning movie.

## Features

- **Create Polls**: Create a poll with multiple movie options and set a voting duration.
- **Vote**: Users can connect their wallet and vote on a movie once the poll starts.
- **End Voting**: End the poll and announce the winning movie.
- **Wallet Integration**: Use MetaMask or other wallets for connection.

## Prerequisites

- **Node.js**
- **Wallet extension**
- **Smart Contract** 0x4D616D7c038c192fC7BCAFA1a1d037B2540F199e

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/codebatine/Smart-Contract-For-Voting-With-React-Frontend.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Update `.env` with:

   - **Alchemy API Key** (`REACT_APP_ALCHEMY_KEY`)
   - **Contract Address** (`REACT_APP_CONTRACT_ADDRESS`)

4. Run the app:
   ```bash
   npm start
   ```
