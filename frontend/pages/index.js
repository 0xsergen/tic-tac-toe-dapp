import Head from "next/head";
// import Image from "next/image";
// import Link from "next/link";

import styles from "../styles/Home.module.css";
import Navbar from "../components/Navbar";
// import CreateGame from "../components/CreateGame";
import Games from "../components/Games";
import MyGames from "../components/MyGames";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { useAccount, useProvider, useContract, useSigner } from "wagmi";
import contractJson from "../abis/TicTacToe.json";
// import { Signer } from "ethers";
import { CONTRACT_ADDRESS, EMPTY_ADDRESS } from "../constants";
import { SpinnerInfinity } from "spinners-react";

export default function Home() {
  const [startedGames, setStartedGames] = useState([]);
  const [availableGames, setAvalailableGames] = useState([]);
  const [endedGames, setEndedGames] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [myGames, setMyGames] = useState([]);
  const [myEndedGames, setMyEndedGames] = useState([]);

  const { isConnected } = useAccount();
  // console.log(contractJson.abi);

  const contractAbi = contractJson.abi;

  const { data: signer } = useSigner();

  // Get the provider, connected address, and a contract instance
  const provider = useProvider();
  const { address } = useAccount();
  const gameContract = useContract({
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: contractAbi,
    signerOrProvider: provider,
  });

  // Fetch Games
  async function fetchGames() {
    try {
      setLoading(true);
      let gamesArray = await gameContract.getGames();

      const startedGames = gamesArray.filter((game) => game.isStarted === true);
      const endedGames = gamesArray.filter((game) => game.isStarted === false);
      const availableGames = gamesArray.filter(
        (game) =>
          game.playerOne != EMPTY_ADDRESS && game.playerTwo == EMPTY_ADDRESS
      );
      // console.log(gamesArray);
      if (isConnected && address) {
        const playerGames = gamesArray.filter(
          (game) =>
            (game.playerOne == address || game.playerTwo == address) &&
            game.winner == 0
        );

        const playerEndedGames = gamesArray.filter(
          (game) =>
            (game.playerOne == address || game.playerTwo == address) &&
            game.winner != 0
        );
        setMyGames(playerGames);
        setMyEndedGames(playerEndedGames);
        // console.log(address, playerGames, myGames);
      }
      setAvalailableGames(availableGames);
      setStartedGames(startedGames);
      setEndedGames(endedGames);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchGames();
  }, [address]);

  useEffect(() => {}, [myGames]);

  return (
    <div>
      <Head>
        <title>Tic Tac Toe Game</title>
        <meta name="description" content="Tic Tac Toe" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <div className={styles.main}>
        <div className={styles.header}>
          <h3>Play TicTacToe, enjoy and earn!</h3>
        </div>
        <div>
          <div className={styles.spinner}>
            {
              <SpinnerInfinity
                enabled={loading}
                size={50}
                thickness={100}
                speed={100}
                color="rgba(57, 98, 172, 1)"
                secondaryColor="rgba(0, 0, 0, 0.44)"
              />
            }
          </div>

          {isConnected && address && myGames.length > 0 && (
            <div className={styles.myGames}>
              {<MyGames data={myGames} address={address} isActive={true} />}
            </div>
          )}
          {isConnected && address && myEndedGames.length > 0 && (
            <div className={styles.myGames}>
              {
                <MyGames
                  data={myEndedGames}
                  address={address}
                  isActive={false}
                />
              }
            </div>
          )}

          <div>
            {/* Render the available games */}
            <div className={styles.container}>
              {!loading && <Games data={availableGames} fetch={fetchGames} />}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
