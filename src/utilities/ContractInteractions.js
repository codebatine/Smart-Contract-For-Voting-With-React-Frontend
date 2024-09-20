import { createAlchemyWeb3 } from '@alch/alchemy-web3';

const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

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
        status: 'Wallet connected',
      };
    } catch (err) {
      return {
        address: '',
        status: 'Error: ' + err.message,
      };
    }
  } else {
    return {
      address: '',
      status: 'Please install MetaMask.',
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
        return { address: accounts[0], status: 'Wallet connected' };
      } else {
        return { address: '', status: 'Please connect your wallet.' };
      }
    } catch (err) {
      return { address: '', status: 'Error: ' + err.message };
    }
  } else {
    return { address: '', status: 'MetaMask is not installed' };
  }
};

export const createPoll = async (movies, duration) => {
  const accounts = await web3.eth.getAccounts();
  const creator = accounts[0];

  const pollCreation = await votingContract.methods
    .createPoll(movies, duration)
    .send({ from: creator });
  return pollCreation.events.PollCreated.returnValues.pollId;
};

export const startVoting = async (pollId) => {
  const accounts = await web3.eth.getAccounts();
  const creator = accounts[0];
  await votingContract.methods.startVoting(pollId).send({ from: creator });
};

export const vote = async (pollId, movie) => {
  const accounts = await web3.eth.getAccounts();
  const voter = accounts[0];
  await votingContract.methods.vote(pollId, movie).send({ from: voter });
};

export const endVoting = async (pollId) => {
  const accounts = await web3.eth.getAccounts();
  const creator = accounts[0];
  await votingContract.methods.endVoting(pollId).send({ from: creator });
};

export const checkIfVoted = async (pollId, address) => {
  const voted = await votingContract.methods
    .pollHasVoted(pollId, address)
    .call();
  return voted;
};

export const getWinningMovie = async (pollId) => {
  const winningMovie = await votingContract.methods
    .getWinningMovie(pollId)
    .call();
  return winningMovie;
};

export const getPollEndTime = async (pollId) => {
  const endTime = await votingContract.methods.getPollEndTime(pollId).call();
  return endTime;
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
        setHasVoted(voted);
        setStatus('Wallet connected');
      } else {
        setWalletAddress('');
        setHasVoted(false);
        setStatus('Please connect your wallet.');
      }
    });
  }
};
