import { useEffect, useState } from "react";
import {
  useAccount,
  useContract,
  useProvider,
  useSigner,
  useBalance,
} from "wagmi";
import contractJson from "../abis/TicTacToe.json";
import Router from "next/router";
import styles from "../styles/Games.module.css";
import { formatEther, parseEther, BigNumber } from "ethers/lib/utils";
import Link from "next/link";
import { CONTRACT_ADDRESS } from "../constants";

// to show addresses like 0xabcdef...abcd
function shortAddress(_address) {
  return _address.substring(0, 6) + "..." + _address.slice(-4);
}

export default function Games(props) {
  // const [loading, setLoading] = useState(false);

  // to list available games to join
  const gameList = props.data;

  // to define contract sample to interact with
  const contractAbi = contractJson.abi;
  const { data: signer } = useSigner();
  const provider = useProvider();
  const { address } = useAccount();
  const contract = useContract({
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: contractAbi,
    signerOrProvider: signer,
  });

  // fetching AVAX balance of the account
  const { data, isError, isLoading } = useBalance({
    addressOrName: address,
  });
  let mygamee = gameList[0];
  // let asd = parseEther(Number(mygamee.rewardPool._hex));
  console.log(Number(data.value._hex));

  // Join Game
  async function joinGame(_gameId, _entryFee) {
    try {
      props.loadingChanges(true);
      const joinGameTx = await contract.joinGame(_gameId, {
        value: parseEther(_entryFee),
      });
      await joinGameTx.wait();
      props.fetch();
      Router.push(`/games/${_gameId}`);
      props.loadingChanges(false);
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
            <th>Join</th>
          </tr>
        </thead>
        <tbody>
          {gameList.map((game) => {
            if (game.playerOne != address)
              return (
                <tr key={game.gameId.toString()}>
                  <td>{game.gameId.toString()}</td>
                  <td>{formatEther(game.rewardPool.toString())} AVAX</td>
                  <td>{shortAddress(game.playerOne)}</td>
                  <td>
                    {Number(data.value._hex) < game.rewardPool._hex ? (
                      "Not enough balance"
                    ) : (
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
                    )}
                  </td>
                </tr>
              );
          })}
        </tbody>
      </table>
    </div>
  );
}
