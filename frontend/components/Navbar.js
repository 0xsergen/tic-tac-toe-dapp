import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import styles from "../styles/Navbar.module.css";
import Image from "next/image";

export default function Navbar() {
  return (
    <div className={styles.navbar}>
      <Image src="/logo.png" width={70} height={70} alt="tic-tac-toe logo" />

      <Link href="/">Home</Link>
      <Link href="/newgame">New Game</Link>
      <Link href="/claim">Claim Rewards</Link>
      <ConnectButton />
    </div>
  );
}
