import { useEffect, useState } from 'react';
import {
  connectWallet,
  getCurrentWalletConnected,
  walletListener,
  createPoll,
  startVoting,
  vote,
  endVoting,
  getWinningMovie,
  getPollEndTime,
} from './utilities/ContractInteractions';

const Voting = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [status, setStatus] = useState('Not connected to the blockchain');
  const [votingState, setVotingState] = useState('NotStarted');
  const [candidates, setCandidates] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [winner, setWinner] = useState(null);
  const [pollId, setPollId] = useState(null);
  const [pollEndTime, setPollEndTime] = useState(null);
  const [movieOptions, setMovieOptions] = useState(['']);
  const [votingDuration, setVotingDuration] = useState(5);

  useEffect(() => {
    const initialize = async () => {
      const { address, status } = await getCurrentWalletConnected();
      setWalletAddress(address);
      setStatus(status);

      walletListener(setWalletAddress, setStatus);
    };
    initialize();
  }, []);

  const handleConnectWallet = async () => {
    const walletResponse = await connectWallet();
    setWalletAddress(walletResponse.address);
    setStatus(walletResponse.status);
  };

  const handleMovieChange = (index, value) => {
    const newOptions = [...movieOptions];
    newOptions[index] = value;
    setMovieOptions(newOptions);
  };

  const handleAddMovieOption = () => {
    setMovieOptions([...movieOptions, '']);
  };

  const handleDurationChange = (e) => {
    setVotingDuration(e.target.value);
  };

  const handleCreatePoll = async () => {
    if (movieOptions.length < 2) {
      setStatus('Please provide at least two options to vote for.');
      return;
    }

    const durationInSeconds = votingDuration * 60;
    const newPollId = await createPoll(movieOptions, durationInSeconds);
    setPollId(newPollId);
    setCandidates(
      movieOptions.map((movie) => ({ name: movie, voteCount: '0' })),
    );
    setStatus('Poll created. Waiting to start voting...');
  };

  const handleStartVoting = async () => {
    if (!pollId) {
      setStatus('No poll created yet.');
      return;
    }
    await startVoting(pollId);
    setVotingState('Ongoing');
    setStatus('Voting started!');
    const endTime = await getPollEndTime(pollId);
    setPollEndTime(new Date(endTime * 1000));
  };

  const handleVote = async (movieName) => {
    if (!walletAddress) {
      setStatus('Please connect your wallet.');
      return;
    }
    if (hasVoted) {
      setStatus('You have already voted.');
      return;
    }

    try {
      await vote(pollId, movieName);
      setHasVoted(true);
      setStatus(`You voted for ${movieName}`);
    } catch (error) {
      setStatus(error.message);
    }
  };

  const handleEndVoting = async () => {
    if (!pollId) return;
    await endVoting(pollId);
    const winningMovie = await getWinningMovie(pollId);
    setWinner(winningMovie);
    setVotingState('Finished');
    setStatus('Voting ended. Winner has been determined.');
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
        {walletAddress && (
          <p className="walletAddress">
            Wallet:{' '}
            {`${walletAddress.substring(0, 6)}...${walletAddress.substring(
              walletAddress.length - 4,
            )}`}
          </p>
        )}
      </div>

      {!pollId && (
        <>
          <h3>Create a Poll</h3>
          {movieOptions.map((option, index) => (
            <div
              key={index}
              className="movieOptionInput"
            >
              <input
                type="text"
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => handleMovieChange(index, e.target.value)}
              />
            </div>
          ))}
          <button onClick={handleAddMovieOption}>Add another option</button>

          {/* Voting duration input */}
          <div className="durationInput">
            <label>Voting Duration (minutes):</label>
            <input
              type="number"
              value={votingDuration}
              onChange={handleDurationChange}
              min="1"
            />
          </div>

          <button
            className="createPollButton"
            onClick={handleCreatePoll}
          >
            Create Poll
          </button>
        </>
      )}

      {pollId && votingState === 'NotStarted' && (
        <button
          className="startVotingButton"
          onClick={handleStartVoting}
        >
          Start Voting
        </button>
      )}

      <h3>
        {votingState === 'NotStarted'
          ? "Voting hasn't started"
          : votingState === 'Finished'
          ? 'Voting has finished'
          : 'Voting in progress'}
      </h3>

      {pollEndTime && <p>Voting ends at: {pollEndTime.toLocaleString()}</p>}

      {votingState === 'Ongoing' && (
        <>
          <h3>Vote for:</h3>
          <div className="candidateRow">
            {candidates.map((candidate, index) => (
              <div
                key={index}
                className="candidatebox"
              >
                <button
                  className="voteButton"
                  onClick={() => handleVote(candidate.name)}
                  disabled={!walletAddress || hasVoted}
                >
                  {candidate.name}
                </button>
                <p className="voteCount">{`${candidate.voteCount} votes`}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {hasVoted && <p className="hasVotedMessage">You've voted, thank you!</p>}

      {votingState === 'Finished' && winner && (
        <h3 className="voteWinner">Winner: {winner}</h3>
      )}

      <p className="status">{status}</p>

      {votingState === 'Ongoing' && (
        <button
          className="endVotingButton"
          onClick={handleEndVoting}
        >
          End Voting
        </button>
      )}
    </div>
  );
};

export default Voting;
