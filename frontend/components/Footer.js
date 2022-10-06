import React from "react";
import { SocialIcon } from "react-social-icons";
import styles from "../styles/Footer.module.css";

export default function Footer() {
  return (
    <div className={styles.social}>
      <SocialIcon
        url="https://twitter.com/sergio_2098"
        target="_blank"
        rel="noopener noreferrer"
        style={{ height: 40, width: 40 }}
      />
      <SocialIcon
        url="https://github.com/sergio2098/"
        target="_blank"
        rel="noopener noreferrer"
        style={{ height: 40, width: 40 }}
      />
      <SocialIcon
        url="https://t.me/sergio_2098"
        target="_blank"
        rel="noopener noreferrer"
        style={{ height: 40, width: 40 }}
      />
    </div>
  );
}
