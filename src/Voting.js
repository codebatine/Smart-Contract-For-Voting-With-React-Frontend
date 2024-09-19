import { useEffect, useState } from 'react';
import {
  checkIfVoted,
  connectWallet,
  getCurrentWalletConnected,
  walletListener,
} from './utilities/ContractInteractions';

const Voting = () => {
  const hardCodedCandidates = [
    { name: 'Ismet', voteCount: '11' },
    { name: 'Pajo', voteCount: '22' },
    { name: 'Alen', voteCount: '33' },
  ];

  useEffect(() => {
    const initialize = async () => {
      try {
        const { address, status } = await getCurrentWalletConnected();
        setWalletAdrdress(address);
        setStatus(status);

        if (address) {
          const voted = await checkIfVoted(address);
          setHasVoted(voted);
        }
        walletListener(setWalletAdrdress, checkIfVoted, setStatus, setHasVoted);
      } catch (err) {
        setStatus('Failed to connect to the blockchain' + err.message);
      }
    };
    initialize();
  }, []);

  const [walletAddress, setWalletAdrdress] = useState('');
  const [status, setStatus] = useState('Failed to connect to the blockchain');
  const [votingState, setVotingState] = useState("Voting hasn't started");
  const [candidates, setCandidates] = useState(hardCodedCandidates);
  const [hasVoted, setHasVoted] = useState(false);
  const [winner, setWinner] = useState('Alen');

  const handleConnectWallet = async () => {
    const walletresponse = await connectWallet();
    setWalletAdrdress(walletresponse.address);
    setStatus(walletresponse.status);
  };

  return (
    <div className="container">
      <div className="header">
        {!walletAddress && (
          <button
            className="walletConnectButton"
            onClick={handleConnectWallet}
          >
            Connect Wallet
          </button>
        )}
        {walletAddress && walletAddress.length > 0 && (
          <p className="walletAddress">
            Wallet:{' '}
            {`${walletAddress.substring(0, 6)}...${walletAddress.substring(
              walletAddress.length - 4,
            )}`}
          </p>
        )}
      </div>
      <button className="startVotingButton">Start Voting</button>
      <h3>
        {votingState === 'NotStarted'
          ? "Voting hasn't started"
          : votingState === 'Finished'
          ? 'Voting has finished'
          : 'Voting in progress'}
      </h3>
      <h3>Vote for:</h3>
      <div className="candidateRow">
        {candidates.map((candidate, index) => (
          <div
            key={index}
            className="candidatebox"
          >
            <button
              className="voteButton"
              disabled={!walletAddress || hasVoted}
            >
              {candidate.name}
            </button>
            <p className="voteCount">
              {candidate.voteCount === '1'
                ? `${candidate.voteCount} vote`
                : `${candidate.voteCount} votes`}
            </p>
          </div>
        ))}
      </div>
      {hasVoted && <p className="hasVotedMessage">You've voted, thank you!</p>}
      {votingState === 'Finished' && (
        <h3 className="voteWinner">Winner: {winner}</h3>
      )}
      <p className="status">{status}</p>
    </div>
  );
};

export default Voting;
