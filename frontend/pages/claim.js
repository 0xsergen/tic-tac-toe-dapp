import { useEffect, useState } from "react";
import { useAccount, useContract, useProvider, useSigner } from "wagmi";
import styles from "../styles/Claim.module.css";
import contractJson from "../abis/TicTacToe.json";
import { Signer } from "ethers";
import { CONTRACT_ADDRESS, EMPTY_ADDRESS } from "../constants";
import { formatEther, parseEther } from "ethers/lib/utils";
import Navbar from "../components/Navbar";
import Head from "next/head";
import Footer from "../components/Footer";

function shortAddress(_address) {
  return _address.substring(0, 6) + "..." + _address.slice(-4);
}

// TicTacToe Module
export default function TicTacToe(props) {
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState("");
  const [rewardInput, setRewardInput] = useState("");
  const [isClaimed, setIsClaimed] = useState(false);
  const [hash, setHash] = useState("");

  // const [hydrated, setHydrated] = useState(false);

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
  async function fetchRewardBalance() {
    setLoading(true);
    let claimableBalance = await gameContract.balance(address);

    setBalance(formatEther(claimableBalance.toString()));
    setLoading(false);
  }

  // To fetch game details
  async function handleClaim() {
    // Set loading status to true
    setLoading(true);

    try {
      const claimRewardsTx = await gameContract.claimRewards(
        parseEther(rewardInput)
      );
      await claimRewardsTx.wait();
      setHash(claimRewardsTx.hash);
      fetchRewardBalance();
      setIsClaimed(true);
    } catch (error) {
      console.error(error);
    }
    // Set loading status to false
    setLoading(false);
  }

  function shortAddress(address) {
    let result = address.slice(0, 6) + "..." + address.slice(-3);
    // console.log(result);
    return result;
  }

  useEffect(() => {}, [balance, isClaimed]);

  useEffect(() => {
    if (signer) {
      Promise.all([fetchRewardBalance()]).finally(() => setLoading(false));
    }
  }, [signer]);

  return (
    <div>
      <Head>
        <title>{`Tic Tac Toe | Claim Rewards`}</title>
        <meta name="description" content={`Tic Tac Toe | Claim Rewards`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <div className={styles.container}>
        <table>
          <thead>
            <tr>
              <th className={styles.tableCells}>Your Wallet</th>
              <th className={styles.tableCells}>Total Claimable Reward</th>
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            <tr>
              <td suppressHydrationWarning className={styles.tableCells}>
                {isConnected ? shortAddress(address) : "Connect wallet"}
              </td>
              <td className={styles.tableCells}>{balance} AVAX</td>
            </tr>
          </tbody>
        </table>
        <div className={styles.inputForm}>
          <input
            className={styles.input}
            type="text"
            placeholder="Claim (in AVAX)"
            value={rewardInput}
            onChange={(e) => {
              if (e.target.value === "") {
                setRewardInput("0");
              } else {
                setRewardInput(e.target.value);
              }
            }}
          />

          <button
            className={styles.button}
            onClick={handleClaim}
            disabled={loading}
          >
            {loading ? "Loading..." : "Claim"}
          </button>
          <div>
            {isClaimed && hash && (
              <a
                href={`https://testnet.snowtrace.io/tx/${hash}#internal`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Successfully claimed. Checked tx.
              </a>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
