"use client";

import React from "react";
import styles from "./page.module.css"; // use simple styles for demonstration purposes
import Chat from "../../components/chat";
import FileViewer from "../../components/file-viewer"; // Import FileViewer
import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs";

// Example client-side functions that the assistant can call
const clientFunctions = {
  get_weather: async ({ location }: { location: string }) => {
    // In a real app, you might fetch this from a weather API
    if (location.toLowerCase().includes("tokyo")) {
      return JSON.stringify({ location, temperature: "10", unit: "celsius", description: "Cloudy" });
    } else if (location.toLowerCase().includes("san francisco")) {
      return JSON.stringify({ location, temperature: "72", unit: "fahrenheit", description: "Sunny" });
    } else {
      return JSON.stringify({ location, temperature: "22", unit: "celsius", description: "Mostly sunny" });
    }
  },
  get_stock_price: async ({ symbol }: { symbol: string }) => {
    // In a real app, fetch from a stock API
    if (symbol.toUpperCase() === "MSFT") {
      return JSON.stringify({ symbol, price: "300", currency: "USD" });
    }
    return JSON.stringify({ symbol, price: "unknown" });
  }
};

const Home = () => {
  // The functionCallHandler that the Chat component will use
  const functionCallHandler = async (toolCall: RequiredActionFunctionToolCall): Promise<string> => {
    const functionName = toolCall.function.name;
    const args = JSON.parse(toolCall.function.arguments);

    console.log(`Function call requested: ${functionName} with args:`, args);

    if (clientFunctions[functionName]) {
      try {
        const result = await clientFunctions[functionName](args);
        return result;
      } catch (error) {
        console.error(`Error executing function ${functionName}:`, error);
        return JSON.stringify({ error: `Failed to execute function ${functionName}` });
      }
    } else {
      console.warn(`Function ${functionName} not found client-side.`);
      return JSON.stringify({ error: `Function ${functionName} not implemented.` });
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.pageContainer}>
        <div className={styles.chatColumn}>
          <Chat functionCallHandler={functionCallHandler} />
        </div>
        <div className={styles.fileViewerColumn}>
          <FileViewer />
        </div>
      </div>
    </main>
  );
};

export default Home;
