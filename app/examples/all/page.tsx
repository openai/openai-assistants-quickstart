"use client";

import React, { useState } from "react";
import styles from "./page.module.css";
import Chat from "../../components/chat";
import WeatherWidget from "../../components/weather-widget";
import { getWeather } from "../../utils/weather";
import { handleBriostackCall } from "../../utils/briostack";
import { proxyOptimization } from "@/app/utils/optimization-client";
import FileViewer from "../../components/file-viewer";

const FunctionCalling = () => {
  const [weatherData, setWeatherData] = useState({});

  const functionCallHandler = async (call) => {
    try {
      if (call?.function?.name === "get_weather") {
        const args = JSON.parse(call.function.arguments);
        const data = await getWeather(args.location);
        setWeatherData(data);
        return JSON.stringify(data);
      }
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
        <div className={styles.column}>
          <WeatherWidget {...weatherData} />
          <FileViewer />
        </div>
        <div className={styles.chatContainer}>
          <div className={styles.chat}>
            <Chat functionCallHandler={functionCallHandler} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default FunctionCalling;
