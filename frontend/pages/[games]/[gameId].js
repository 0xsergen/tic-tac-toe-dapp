import { useEffect, useState } from "react";
import { useAccount, useContract, useProvider, useSigner } from "wagmi";
import { useRouter } from "next/router";
import styles from "../../styles/TicTacToe.module.css";
import contractJson from "../../abis/TicTacToe.json";
import { Signer } from "ethers";
import { CONTRACT_ADDRESS, EMPTY_ADDRESS } from "../../constants";
import { formatEther, parseEther } from "ethers/lib/utils";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import CreateGame from "../../components/CreateGame";
import Link from "next/link";
import Head from "next/head";
// import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";
import { SpinnerInfinity } from "spinners-react";

// TicTacToe Module
export default function TicTacToe(props) {
  const [loading, setLoading] = useState(false);
  const [playerOne, setPlayerOne] = useState("");
  const [playerTwo, setPlayerTwo] = useState("");
  const [nextMove, setNextMove] = useState("");
  const [rewardPool, setRewardPool] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [winner, setWinner] = useState({ ID: 0, address: "" });
  const [error, setError] = useState("");
  const [commission, setCommission] = useState(0);
  const [board, setBoard] = useState([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);

  // const { width, height } = useWindowSize();

  const router = useRouter();
  const gameId = router.query.gameId;

  // To connect to contract
  const { isConnected } = useAccount();
  const contractAbi = contractJson.abi;

  const { data: signer } = useSigner();
  const provider = useProvider();
  const { address } = useAccount();

  const gameContract = useContract({
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: contractAbi,
    signerOrProvider: signer,
  });

  // To fetch game details
  async function fetchGame() {
    setLoading(true);
    let gameInfo = await gameContract.games(gameId);
    let gameBoard = await gameContract.getGameBoard(gameId);
    let comm = await gameContract.commission();

    // to change 0, 1, 2 from SC for UI. X-O-X
    gameBoard = gameBoard.map((x) =>
      x.map((y) => {
        if (y == 0) {
          return "";
        } else if (y == 1) {
          return "X";
        } else if (y == 2) {
          return "O";
        } else return "";
      })
    );

    setCommission(comm.toNumber());
    setPlayerOne(gameInfo.playerOne);
    setPlayerTwo(gameInfo.playerTwo);
    setNextMove(gameInfo.nextMove);
    setRewardPool(formatEther(gameInfo.rewardPool.toString()));
    setIsStarted(gameInfo.isStarted);
    if (gameInfo.winner == 1)
      setWinner({ ID: gameInfo.winner, address: gameInfo.playerOne });
    else if (gameInfo.winner == 2)
      setWinner({ ID: gameInfo.winner, address: gameInfo.playerTwo });
    else if (gameInfo.winner == 3)
      setWinner({ ID: gameInfo.winner, address: "" });

    setBoard(gameBoard);
    setLoading(false);
  }

  async function makeMove(_x, _y, _gameId) {
    try {
      setLoading(true);
      if (address != nextMove) setError("Not your turn!");
      if (board[_x][_y] != "") setError("Not empty cell!");
      if (winner.ID != 0) setError("Game is finished!");
      if (!isStarted) setError("Not started yet!");

      const makeMoveTx = await gameContract.makeMove(_x, _y, _gameId);
      await makeMoveTx.wait();
      console.log(makeMoveTx);
      fetchGame();
    } catch (error) {
      //   console.error(error);
    }
  }

  function displayTurn() {
    if (nextMove == address) {
      return "Your turn";
    } else {
      return shortAddress(nextMove);
    }
  }

  function shortAddress(_address) {
    return _address.substring(0, 6) + "..." + _address.slice(-4);
  }

  function displayWinner() {
    let reward = calculateReward();
    if (winner.ID == 3) {
      return `It's a draw! Each players earn ${reward} AVAX! `;
    } else if (winner.ID != 0) {
      console.log(winner);
      if (winner.address == address) return "You";
      // return `You won and earned ${reward} AVAX!`;
      //   return `Player ${winner.ID} won and earned ${reward} AVAX!`;
      return `Player ${winner.ID}`;
    }
  }

  function calculateReward() {
    let reward = "";
    if (winner == 3) {
      reward = (rewardPool / 2).toPrecision(3);
    } else if (winner != 0) {
      reward = ((rewardPool * (100 - commission)) / 100).toPrecision(3);
    }
    return reward;
  }

  // Join Game
  async function joinGame(_gameId, _entryFee) {
    try {
      setLoading(true);
      const joinGameTx = await gameContract.joinGame(_gameId, {
        value: parseEther(_entryFee),
      });
      await joinGameTx.wait();
      fetchGame();
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    // console.log(board);
    setError("");
  }, [board]);

  useEffect(() => {
    if (gameId && signer) {
      Promise.all([fetchGame()]).finally(() => setLoading(false));
    }
    setError("");
  }, [router, signer]);

  return (
    <div>
      <Head>
        <title>{`Game ${gameId} | Tic Tac Toe`}</title>
        <meta name="description" content={`Tic Tac Toe | Game ${gameId}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.spinner}>
          {
            <SpinnerInfinity
              enabled={loading}
              size={100}
              thickness={100}
              speed={100}
              color="rgba(57, 98, 172, 1)"
              secondaryColor="rgba(0, 0, 0, 0.44)"
            />
          }
        </div>
        {/* <div>{winner.ID != 0 ? <h2>{displayWinner()}</h2> : displayTurn()}</div> */}
        {isConnected != playerOne && !isStarted && (
          <button
            className={styles.button}
            onClick={() => joinGame(gameId, rewardPool)}
          >
            Join
          </button>
        )}
        <table className={styles.card}>
          <thead>
            <tr>
              <th className={styles.tableCells}>Game ID</th>
              <th className={styles.tableCells}>
                {playerTwo == EMPTY_ADDRESS ? "Entry Fee" : "Reward Pool"}
              </th>
              <th className={styles.tableCells}>
                {winner.ID != 0 ? "Winner" : "Next Move"}
              </th>
              <th className={styles.tableCells}>P1</th>
              <th className={styles.tableCells}>P2</th>
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            <tr key={gameId}>
              <td className={styles.tableCells}>{gameId}</td>

              <td className={styles.tableCells}>{rewardPool} AVAX</td>
              <td className={styles.tableCells}>
                {winner.ID != 0 ? displayWinner() : displayTurn()}
              </td>
              <td className={styles.tableCells}>{shortAddress(playerOne)}</td>
              <td className={styles.tableCells}>
                {shortAddress(playerTwo) == shortAddress(EMPTY_ADDRESS)
                  ? "Waiting for P2"
                  : shortAddress(playerTwo)}
              </td>
            </tr>
          </tbody>
        </table>

        <p>{error && error}</p>
        <div className={styles.tictactoe}>
          <div className={styles.col}>
            <span
              onClick={() => makeMove(0, 0, gameId)}
              className={styles.cell}
            >
              {board[0][0]}
            </span>
            <span
              onClick={() => makeMove(0, 1, gameId)}
              className={styles.cell}
            >
              {board[0][1]}
            </span>
            <span
              onClick={() => makeMove(0, 2, gameId)}
              className={styles.cell}
            >
              {board[0][2]}
            </span>
          </div>
          <div className={styles.col}>
            <span
              onClick={() => makeMove(1, 0, gameId)}
              className={styles.cell}
            >
              {board[1][0]}
            </span>
            <span
              onClick={() => makeMove(1, 1, gameId)}
              className={styles.cell}
            >
              {board[1][1]}
            </span>
            <span
              onClick={() => makeMove(1, 2, gameId)}
              className={styles.cell}
            >
              {board[1][2]}
            </span>
          </div>
          <div className={styles.col}>
            <span
              onClick={() => makeMove(2, 0, gameId)}
              className={styles.cell}
            >
              {board[2][0]}
            </span>
            <span
              onClick={() => makeMove(2, 1, gameId)}
              className={styles.cell}
            >
              {board[2][1]}
            </span>
            <span
              onClick={() => makeMove(2, 2, gameId)}
              className={styles.cell}
            >
              {board[2][2]}
            </span>
          </div>
        </div>
        {winner.ID != 0 && (
          <p>
            Go to{" "}
            <Link href="/claim">
              <a
                style={{
                  textDecoration: "underline",
                  color: "blue",
                }}
              >
                Claim Rewards
              </a>
            </Link>{" "}
            page to claim your whole rewards.
          </p>
        )}
      </div>
      {winner.ID != 0 && <Confetti />}
      {/* {winner.ID != 0 && <CreateGame />} */}
      <Footer />
    </div>
  );
}
