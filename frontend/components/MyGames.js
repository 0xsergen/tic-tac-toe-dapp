import { useEffect, useState } from "react";
import { useAccount, useContract, useProvider, useSigner } from "wagmi";

import styles from "../styles/Mygames.module.css";
import { formatEther, parseEther } from "ethers/lib/utils";
import Link from "next/link";
import { EMPTY_ADDRESS } from "../constants";

export default function MyGames(props) {
  const [loading, setLoading] = useState(false);
  const gameList = props.data;
  const address = props.address;

  function getNextMove(game) {
    if (game.playerTwo == EMPTY_ADDRESS) return "Waiting for P2";
    let resultAddress =
      address == game.nextMove
        ? "Your Turn"
        : game.nextMove.substring(0, 6) + "..." + game.nextMove.slice(-3);
    return resultAddress;
  }

  function getWinner(game) {
    if (game.winner == 1) {
      if (game.playerOne == address) {
        return "You 🎉";
      } else {
        return (
          game.playerOne.substring(0, 6) + "..." + game.playerOne.slice(-3)
        );
      }
    } else if (game.winner == 2) {
      if (game.playerTwo == address) {
        return "You 🎉";
      } else {
        return (
          game.playerTwo.substring(0, 6) + "..." + game.playerTwo.slice(-3)
        );
      }
    } else if (game.winner == 3) return "Draw";
  }

  return (
    <div className={styles.games}>
      <h3>{props.isActive ? "My Active Games" : "My Latest Games"}</h3>
      <table className={styles.card}>
        <thead>
          <tr>
            <th>Game ID</th>
            <th>Reward Pool</th>
            <th>{props.isActive ? "Next Move" : "Winner"}</th>
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {gameList.map((game, i, arr) => {
            if (arr.length - 3 < i)
              return (
                <Link
                  key={game.gameId.toString()}
                  href={`/games/${game.gameId.toString()}`}
                >
                  <tr key={game.gameId.toString()}>
                    <td>{game.gameId.toString()}</td>

                    <td>{formatEther(game.rewardPool.toString())} AVAX</td>
                    <td>
                      {props.isActive ? getNextMove(game) : getWinner(game)}
                    </td>
                  </tr>
                </Link>
              );
          })}
        </tbody>
      </table>
    </div>
  );
}
