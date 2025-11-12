"use client";

import styles from "../all/page.module.css";
import Chat from "@/app/components/chat";

export default function FunctionCalling() {
  return (
    <main className={styles.main}>
      <div className={styles.chatContainer}>
        <Chat />
      </div>
    </main>
  );
}
