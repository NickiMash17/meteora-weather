import { useState, useEffect } from 'react';
import WeatherIcon from './WeatherIcon';
import WeatherDetails from './WeatherDetails';
import { CurrentWeatherData } from '../types/weather';
import '../styles/CurrentWeather.css';

interface CurrentWeatherProps {
  weather: CurrentWeatherData;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ weather }) => {
  const [timeString, setTimeString] = useState('');
  const [animate, setAnimate] = useState(false);
  const [bgImage, setBgImage] = useState('');

  useEffect(() => {
    // Update time
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      };
      setTimeString(now.toLocaleString('en-US', options));
    };
    
    updateTime();
    const timer = setInterval(updateTime, 60000);
    
    // Trigger animation
    setAnimate(false);
    setTimeout(() => setAnimate(true), 100);
    
    return () => clearInterval(timer);
  }, [weather]);

  useEffect(() => {
    // Set background image based on weather condition
    const condition = weather.condition.main.toLowerCase();
    const hour = new Date().getHours();
    const isDaytime = hour >= 6 && hour < 18;
    
    let image = '';
    
    if (condition.includes('thunderstorm')) {
      image = isDaytime 
        ? 'url(https://source.unsplash.com/random/800x600/?thunderstorm,day)' 
        : 'url(https://source.unsplash.com/random/800x600/?thunderstorm,night)';
    } else if (condition.includes('rain') || condition.includes('drizzle')) {
      image = isDaytime 
        ? 'url(https://source.unsplash.com/random/800x600/?rain,day)' 
        : 'url(https://source.unsplash.com/random/800x600/?rain,night)';
    } else if (condition.includes('snow')) {
      image = isDaytime 
        ? 'url(https://source.unsplash.com/random/800x600/?snow,day)' 
        : 'url(https://source.unsplash.com/random/800x600/?snow,night)';
    } else if (condition.includes('clear')) {
      image = isDaytime 
        ? 'url(https://source.unsplash.com/random/800x600/?sunny,sky)' 
        : 'url(https://source.unsplash.com/random/800x600/?stars,night)';
    } else if (condition.includes('cloud')) {
      image = isDaytime 
        ? 'url(https://source.unsplash.com/random/800x600/?cloudy,day)' 
        : 'url(https://source.unsplash.com/random/800x600/?cloudy,night)';
    } else {
      image = isDaytime 
        ? 'url(https://source.unsplash.com/random/800x600/?weather,day)' 
        : 'url(https://source.unsplash.com/random/800x600/?weather,night)';
    }
    
    setBgImage(image);
  }, [weather]);

  const formatTemperature = (temp: number) => {
    return Math.round(temp);
  };

  return (
    <div 
      className={`current-weather ${animate ? 'animate-in' : ''}`}
      style={{ backgroundImage: bgImage }}
    >
      <div className="weather-overlay"></div>
      
      <div className="current-weather-header">
        <div className="location-info">
          <h2 className="location-name">
            {weather.location}
            <span className="location-country">, {weather.country}</span>
          </h2>
          <p className="current-date">{timeString}</p>
        </div>
      </div>
      
      <div className="current-weather-body">
        <div className="current-weather-main">
          <div className="weather-icon-container">
            <WeatherIcon 
              conditionCode={weather.condition.id} 
              isDay={weather.isDay} 
              size="large" 
            />
          </div>
          
          <div className="temperature-container">
            <h1 className="current-temperature">
              {formatTemperature(weather.temperature.current)}°
              <span className="temperature-unit">C</span>
            </h1>
            <p className="feels-like">
              Feels like {formatTemperature(weather.temperature.feelsLike)}°
            </p>
          </div>
        </div>
        
        <div className="current-weather-condition">
          <p className="condition-text">{weather.condition.description}</p>
          <div className="min-max-temp">
            <span className="min-temp">
              <svg className="temp-icon" viewBox="0 0 24 24">
                <path d="M12 3c-3.87 0-7 3.13-7 7s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
                <path d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
              {formatTemperature(weather.temperature.min)}°
            </span>
            <span className="max-temp">
              <svg className="temp-icon" viewBox="0 0 24 24">
                <path d="M12 3c-3.87 0-7 3.13-7 7s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
                <path d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
              {formatTemperature(weather.temperature.max)}°
            </span>
          </div>
        </div>
      </div>
      
      <WeatherDetails weather={weather} />
      
      <div className="last-updated">
        <svg className="update-icon" viewBox="0 0 24 24">
          <path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/>
        </svg>
        Updated: {new Date(weather.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
};

export default CurrentWeather;