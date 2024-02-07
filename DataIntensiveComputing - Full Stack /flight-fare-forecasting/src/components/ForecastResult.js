// ForecastResult.js
import React, { useEffect, useState } from 'react';

const CountdownText = ({ finalValue, interval }) => {
  const [currentValue, setCurrentValue] = useState(finalValue);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentValue((prevValue) => (prevValue > 0 ? prevValue - 1 : 0));
    }, interval);

    return () => clearInterval(intervalId);
  }, [finalValue, interval]);

  return <p style={{ fontSize: '40px' }}>{currentValue}</p>;
};

const ForecastResult = ({ predictedFare, stops, arrivalTime, departureTime }) => {
  return (
    <div className="forecast-result">
      <h2>Flight Fare Forecast</h2>
      <CountdownText finalValue={predictedFare} interval={100} />
      <p>No. of Stops: {stops}</p>
      <p>Arrival Time: {arrivalTime}</p>
      <p>Departure Time: {departureTime}</p>
    </div>
  );
};

export default ForecastResult;
