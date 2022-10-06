import styles from "../styles/NewGames.module.css";
import Navbar from "../components/Navbar";
import CreateGame from "../components/CreateGame";
import Footer from "../components/Footer";

export default function NewGame() {
  return (
    <div>
      <Navbar />
      <div className={styles.createGame}>
        <CreateGame />
      </div>
      <Footer />
    </div>
  );
}
