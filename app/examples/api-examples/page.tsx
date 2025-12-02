"use client";

import React from "react";
import styles from "../basic-chat/page.module.css";
import Chat from "../../components/chat";
import { handleBriostackCall } from "../../utils/briostack";
import { proxyOptimization } from "@/app/utils/optimization-client";

const ApiExamples = () => {
  const functionCallHandler = async (call: any) => {
    try {
      if (call?.function?.name === "call_briostack") {
        const args = JSON.parse(call.function.arguments);
        const result = await handleBriostackCall(args);
        return JSON.stringify(result);
      }
      if (call?.function?.name === "optimize_routes") {
        const args = JSON.parse(call.function.arguments);
        const provider =
          args.provider === "samsara" ? "samsara" : "nextbillion";
        const result = await proxyOptimization(args.payload, provider);
        return JSON.stringify(result);
      }
    } catch (err) {
      console.error(err);
      return JSON.stringify({ error: "Failed to handle function call" });
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <Chat functionCallHandler={functionCallHandler} />
      </div>
    </main>
  );
};

export default ApiExamples;
