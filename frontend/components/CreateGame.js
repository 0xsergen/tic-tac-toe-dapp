import { useEffect, useState } from "react";
import { useAccount, useContract, useProvider, useSigner } from "wagmi";
import styles from "../styles/Create.module.css";
import { formatEther, parseEther } from "ethers/lib/utils";
import contractJson from "../abis/TicTacToe.json";
import { CONTRACT_ADDRESS } from "../constants";
import Router from "next/router";

export default function CreateGame(props) {
  // Loading state
  const [loading, setLoading] = useState(false);
  const [entryFee, setEntryFee] = useState("");
  const [showCreatedGame, setShowCreatedGame] = useState(false);

  // Get the provider, connected address, and a contract instance
  const contractAbi = contractJson.abi;
  const { data: signer } = useSigner();

  const provider = useProvider();
  const { address } = useAccount();
  const contract = useContract({
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: contractAbi,
    signerOrProvider: signer,
  });

  // Main function to be called when 'Create' button is clicked
  async function handleCreateGame() {
    // Set loading status to true
    setLoading(true);

    try {
      const createGameTx = await contract.startGame({
        value: parseEther(entryFee),
      });
      await createGameTx.wait();
      console.log(createGameTx);
      // Start displaying a button to view the NFT details
      // setShowCreatedGame(true);
    } catch (error) {
      console.error(error);
    }

    // props.fetch();
    // Set loading status to false
    setLoading(false);
    setEntryFee("");
    Router.push("/");
  }

  return (
    <div className={styles.container}>
      {/* Show the input fields for the user to enter contract details */}
      <div className={styles.header}>
        <h3>Create a New Game</h3>
      </div>

      <div className={styles.inputForm}>
        <input
          className={styles.input}
          type="text"
          placeholder="Entry Fee (in AVAX)"
          value={entryFee}
          onChange={(e) => {
            if (e.target.value === "") {
              setEntryFee("0");
            } else {
              setEntryFee(e.target.value);
            }
          }}
        />

        {/* Button to create the game */}
        <button
          className={styles.button}
          onClick={handleCreateGame}
          disabled={loading}
        >
          {loading ? "Loading..." : "Create"}
        </button>
      </div>
    </div>
  );
}
