"use client";

import React from "react";
import styles from "./page.module.css";
import Chat from "@/app/components/chat";

export default function AllExample() {
  return (
    <main className={styles.main}>
      {/* Logo (simple block; no sticky/fixed) */}
      <img
        src="/EXU-LOGO.png"      // <-- make sure this is in /public
        alt="EXU Logo"
        className={styles.logo}
      />

      {/* Perfectly centered chat area */}
      <section className={styles.chatWrap}>
        <div className={styles.chatblock}>
          <Chat />
        </div>
      </section>
    </main>
  );
}

