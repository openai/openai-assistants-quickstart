import React from "react";
import styles from "./weather-widget.module.css";

const WeatherWidget = ({
  location = "---",
  temperature = "---",
  conditions = "Sunny",
  isEmpty = false,
}) => {
  const conditionClassMap = {
    Cloudy: styles.weatherBGCloudy,
    Sunny: styles.weatherBGSunny,
    Rainy: styles.weatherBGRainy,
    Snowy: styles.weatherBGSnowy,
    Windy: styles.weatherBGWindy,
  };

  if (isEmpty) {
    return (
      <div className={`${styles.weatherWidget} ${styles.weatherEmptyState}`}>
        <div className={styles.weatherWidgetData}>
          <p>Enter a city to see local weather</p>
          <p>try: what's the weather like in Berkeley?</p>
        </div>
      </div>
    );
  }

  const weatherClass = `${styles.weatherWidget} ${
    conditionClassMap[conditions] || styles.weatherBGSunny
  }`;

  return (
    <div className={weatherClass}>
      <div className={styles.weatherWidgetData}>
        <p>{location}</p>
        <h2>{temperature !== "---" ? `${temperature}°F` : temperature}</h2>
        <p>{conditions}</p>
      </div>
    </div>
  );
};

export default WeatherWidget;
