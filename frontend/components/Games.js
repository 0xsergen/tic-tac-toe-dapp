import { useEffect, useState } from "react";
import { useAccount, useContract, useProvider, useSigner } from "wagmi";
import contractJson from "../abis/TicTacToe.json";

import styles from "../styles/Games.module.css";
import { formatEther, parseEther } from "ethers/lib/utils";
// import Link from "next/link";
import { CONTRACT_ADDRESS } from "../constants";

export default function Games(props) {
  const [loading, setLoading] = useState(false);
  const gameList = props.data;
  const contractAbi = contractJson.abi;
  const { data: signer } = useSigner();
  const provider = useProvider();
  const { address } = useAccount();
  const contract = useContract({
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: contractAbi,
    signerOrProvider: signer,
  });

  // Join Game
  async function joinGame(_gameId, _entryFee) {
    try {
      setLoading(true);
      const joinGameTx = await contract.joinGame(_gameId, {
        value: parseEther(_entryFee),
      });
      await joinGameTx.wait();
      props.fetch();
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={styles.games}>
      <h3>Join an Available Game</h3>
      <table className={styles.card}>
        <thead>
          <tr>
            <th>Game ID</th>
            <th>Entry Fee</th>
            <th>Player 1</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {gameList.map((game) => {
            if (game.playerOne != address)
              return (
                <tr key={game.gameId.toString()}>
                  <td>{game.gameId.toString()}</td>
                  <td>{formatEther(game.rewardPool.toString())} AVAX</td>
                  <td>
                    {game.playerOne.substring(0, 6) +
                      "..." +
                      game.playerOne.slice(-3)}
                  </td>
                  <td>
                    <button
                      className={styles.button}
                      onClick={() =>
                        joinGame(
                          game.gameId.toString(),
                          formatEther(game.rewardPool.toString())
                        )
                      }
                    >
                      Join
                    </button>
                  </td>
                </tr>
              );
          })}
        </tbody>
      </table>
    </div>
  );
}
