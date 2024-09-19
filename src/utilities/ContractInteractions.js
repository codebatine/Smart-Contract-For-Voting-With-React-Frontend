console.log('Environment Variables:', process.env);

const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

if (!alchemyKey) {
  throw new Error(
    'Alchemy API key is not defined. Please set REACT_APP_ALCHEMY_KEY in your .env file.',
  );
}

if (!contractAddress || !/^0x[a-fA-F0-9]{40}$/.test(contractAddress)) {
  throw new Error(
    'Contract address is not defined or invalid. Please set REACT_APP_CONTRACT_ADDRESS in your .env file.',
  );
}

console.log('Alchemy Key:', alchemyKey);
console.log('Contract Address:', contractAddress);

const { createAlchemyWeb3 } = require('@alch/alchemy-web3');
const web3 = createAlchemyWeb3(alchemyKey);

const contractABI = require('../contract-abi.json');
const votingContract = new web3.eth.Contract(contractABI, contractAddress);

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      return {
        address: addressArray[0],
        status: '👆🏻 Write a msg in the textbox.',
      };
    } catch (err) {
      return {
        address: '',
        status: '😥 errors...' + err.message,
      };
    }
  } else {
    return {
      address: '',
      status: (
        <span>
          <p>
            🦊 You must install{' '}
            <a
              href="https://metamask.io/download.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              MetaMask
            </a>{' '}
            or some other wallet.
          </p>
        </span>
      ),
    };
  }
};

export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_accounts',
      });
      if (accounts.length > 0) {
        return {
          address: accounts[0],
          status: '👆🏻 Write a msg in the textbox.',
        };
      } else {
        return {
          address: '',
          status: '🦊 Connect to Wallet.',
        };
      }
    } catch (err) {
      return {
        address: '',
        status: '😥 errors...' + err.message,
      };
    }
  } else {
    return {
      address: '',
      status: (
        <span>
          <p>
            🦊 You must install{' '}
            <a
              href="https://metamask.io/download.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              MetaMask
            </a>{' '}
            or some other wallet.
          </p>
        </span>
      ),
    };
  }
};

/// I had a private pollHasVoted so this won't work
export const checkIfVoted = async (address) => {
  const voted = await votingContract.methods.pollHasVoted(address).call();
  return voted;
};

export const walletListener = (
  setWalletAddress,
  checkIfVoted,
  setStatus,
  setHasVoted,
) => {
  if (window.ethereum) {
    window.ethereum.on('accountsChanged', async (accounts) => {
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        const voted = await checkIfVoted(accounts[0]);
        setHasVoted = voted;
        setStatus('👆🏻 Write a msg in the textbox.');
      } else {
        setWalletAddress('');
        setStatus('🦊 Connect to Wallet.');
        setHasVoted(false);
      }
    });
  }
};
