// App.js
import React, { useState } from 'react';
import FlightForm from './components/FlightForm';
import ForecastResult from './components/ForecastResult';
import './App.css'; // Import the styles

const App = () => {
  const [forecastData, setForecastData] = useState(null);

  const handleForecast = (data) => {
    setForecastData(data);
  };

  return (
    <div className="container">
      <FlightForm onForecast={handleForecast} />
      {forecastData && <ForecastResult {...forecastData} />}
    </div>
  );
};

export default App;
