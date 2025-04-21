import { useState } from 'react';
import WeatherCard from './WeatherCard';
import { ForecastData } from '../types/weather';
import '../styles/Forecast.css';

interface ForecastProps {
  forecast: ForecastData;
}

const Forecast: React.FC<ForecastProps> = ({ forecast }) => {
  const [activeTab, setActiveTab] = useState<'hourly' | 'daily'>('hourly');
  const [activeDay, setActiveDay] = useState(0);
  
  // Group hourly forecasts by day
  const dayForecasts = forecast.hourly.reduce((acc, hour) => {
    const date = new Date(hour.timestamp);
    const dayKey = date.toLocaleDateString();
    
    if (!acc[dayKey]) {
      acc[dayKey] = [];
    }
    
    acc[dayKey].push(hour);
    return acc;
  }, {} as Record<string, typeof forecast.hourly>);
  
  const dayKeys = Object.keys(dayForecasts);

  return (
    <div className="forecast-container">
      <div className="forecast-header">
        <h2 className="forecast-title">Forecast</h2>
        <div className="forecast-tabs">
          <button 
            className={`tab-button ${activeTab === 'hourly' ? 'active' : ''}`}
            onClick={() => setActiveTab('hourly')}
            aria-label="Hourly forecast"
          >
            Hourly
          </button>
          <button 
            className={`tab-button ${activeTab === 'daily' ? 'active' : ''}`}
            onClick={() => setActiveTab('daily')}
            aria-label="Daily forecast"
          >
            5-Day
          </button>
        </div>
      </div>
      
      <div className="forecast-content">
        {activeTab === 'hourly' && (
          <div className="hourly-forecast">
            <div className="day-selection">
              {dayKeys.slice(0, 3).map((day, index) => (
                <button 
                  key={day} 
                  className={`day-button ${index === activeDay ? 'active' : ''}`}
                  onClick={() => setActiveDay(index)}
                  aria-label={`View ${index === 0 ? 'Today' : new Date(day).toLocaleDateString('en-US', { weekday: 'short' })} forecast`}
                >
                  {index === 0 ? 'Today' : new Date(day).toLocaleDateString('en-US', { weekday: 'short' })}
                </button>
              ))}
            </div>
            
            <div className="hourly-cards">
              {dayForecasts[dayKeys[activeDay]].map((hour, index) => (
                <WeatherCard 
                  key={`hourly-${index}`}
                  time={new Date(hour.timestamp).toLocaleTimeString([], { hour: 'numeric', hour12: true })}
                  temperature={Math.round(hour.temperature)}
                  condition={hour.condition}
                  conditionCode={hour.conditionCode}
                  precipitation={hour.precipitation}
                  isDay={hour.isDay}
                  type="hourly"
                />
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'daily' && (
          <div className="daily-forecast">
            {forecast.daily.map((day, index) => (
              <WeatherCard 
                key={`daily-${index}`}
                day={new Date(day.timestamp).toLocaleDateString('en-US', { weekday: 'short' })}
                date={new Date(day.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                temperature={Math.round(day.temperature.day)}
                minTemp={Math.round(day.temperature.min)}
                maxTemp={Math.round(day.temperature.max)}
                condition={day.condition}
                conditionCode={day.conditionCode}
                precipitation={day.precipitation}
                isDay={true}
                type="daily"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Forecast;