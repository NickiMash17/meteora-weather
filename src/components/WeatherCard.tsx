import WeatherIcon from './WeatherIcon';
import '../styles/WeatherCard.css';

interface WeatherCardProps {
  day?: string;
  date?: string;
  time?: string;
  temperature: number;
  minTemp?: number;
  maxTemp?: number;
  condition: string;
  conditionCode: number;
  precipitation: number;
  isDay: boolean;
  type: 'hourly' | 'daily';
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  day,
  date,
  time,
  temperature,
  minTemp,
  maxTemp,
  condition,
  conditionCode,
  precipitation,
  isDay,
  type
}) => {
  return (
    <div className={`weather-card ${type}`}>
      <div className="card-header">
        {type === 'hourly' && (
          <>
            <h3 className="time">{time}</h3>
            <p className="day">{day}</p>
          </>
        )}
        {type === 'daily' && (
          <>
            <h3 className="day">{day}</h3>
            <p className="date">{date}</p>
          </>
        )}
      </div>
      
      <div className="card-body">
        <div className="card-icon">
          <WeatherIcon conditionCode={conditionCode} isDay={isDay} size="medium" />
        </div>
        
        <div className="card-temperature">
          <span className="temperature">{temperature}°</span>
          
          {type === 'daily' && minTemp !== undefined && maxTemp !== undefined && (
            <div className="minmax-container">
              <span className="min">{minTemp}°</span>
              <div className="temp-bar">
                <div 
                  className="temp-progress" 
                  style={{ 
                    width: `${((maxTemp - minTemp) / 30) * 100}%`,
                    left: `${((minTemp + 10) / 30) * 100}%`
                  }}
                ></div>
              </div>
              <span className="max">{maxTemp}°</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="card-footer">
        <p className="condition">{condition}</p>
        
        {precipitation > 0 && (
          <div className="precipitation">
            <svg className="precipitation-icon" viewBox="0 0 24 24">
              <path d="M12 3c-3.87 0-7 3.13-7 7s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
              <path d="M12 5v8l5 3-1 1-5-3V5z"/>
            </svg>
            <span className="precipitation-value">{Math.round(precipitation * 100)}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherCard;