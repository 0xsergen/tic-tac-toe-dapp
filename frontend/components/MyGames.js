// import { useEffect, useState } from "react";
// import { useAccount, useContract, useProvider, useSigner } from "wagmi";

import styles from "../styles/Mygames.module.css";
import { formatEther, parseEther } from "ethers/lib/utils";
import Link from "next/link";
import { EMPTY_ADDRESS } from "../constants";

// to show addresses like 0xabcdef...abcd
function shortAddress(_address) {
  return _address.substring(0, 6) + "..." + _address.slice(-4);
}

export default function MyGames(props) {
  // const [loading, setLoading] = useState(false);
  const gameList = props.data;
  const address = props.address;

  function getNextMove(game) {
    if (game.playerTwo == EMPTY_ADDRESS) return "Waiting for P2";
    let resultAddress =
      address == game.nextMove ? "Your Turn" : shortAddress(game.nextMove);
    return resultAddress;
  }

  function getWinner(game) {
    if (game.winner == 1) {
      if (game.playerOne == address) {
        return "You 🎉";
      } else {
        return shortAddress(game.playerOne);
      }
    } else if (game.winner == 2) {
      if (game.playerTwo == address) {
        return "You 🎉";
      } else {
        return shortAddress(game.playerTwo);
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
              // to show latest ended games only.
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
