const getWeather = (location) => {
  // chose a random temperature and condition
  const randomTemperature = Math.floor(Math.random() * (80 - 50 + 1)) + 50;
  const randomConditionIndex = Math.floor(Math.random() * 5);
  const conditions = ["Cloudy", "Sunny", "Rainy", "Snowy", "Windy"];

  return {
    location: location,
    temperature: randomTemperature,
    unit: "F",
    conditions: conditions[randomConditionIndex],
  };
};

export { getWeather };
