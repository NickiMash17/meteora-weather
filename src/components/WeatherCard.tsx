import WeatherIcon from './WeatherIcon';
import '../styles/WeatherCard.css';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  return (
    <div className={`weather-card ${type} flex flex-col items-center justify-between p-4 min-w-[120px] rounded-xl transition-all duration-300 hover:scale-105 shadow-lg bg-white/80 dark:bg-gray-900/80 mb-2 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto sm:mx-0 animate-float animate-gradient-glow`}
      style={{ touchAction: 'manipulation' }}
      tabIndex={0}
      aria-label={t('Weather card: {{condition}}, {{temperature}}°', { condition, temperature })}
    >
      <div className="card-header text-center mb-4 w-full">
        {type === 'hourly' && (
          <>
            <h3 className="time text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">{t(time || '')}</h3>
            <p className="day text-sm font-medium text-gray-600 dark:text-gray-400">{t(day || '')}</p>
          </>
        )}
        {type === 'daily' && (
          <>
            <h3 className="day text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">{t(day || '')}</h3>
            <p className="date text-xs text-gray-500 dark:text-gray-500 opacity-70">{t(date || '')}</p>
          </>
        )}
      </div>
      
      <div className="card-body flex flex-col items-center gap-4 mb-4 w-full">
        <div className="card-icon flex items-center justify-center">
          <WeatherIcon conditionCode={conditionCode} isDay={isDay} size="medium" />
        </div>
        
        <div className="card-temperature text-center w-full">
          <span className="temperature text-3xl font-bold text-gray-900 dark:text-gray-100">{temperature}°</span>
          
          {type === 'daily' && minTemp !== undefined && maxTemp !== undefined && (
            <div className="minmax-container flex items-center justify-center gap-2 mt-2">
              <span className="min text-sm font-medium text-blue-500 dark:text-cyan-400">{minTemp}°</span>
              <div className="temp-bar flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full relative max-w-[60px]">
                <div 
                  className="temp-progress absolute h-full bg-gradient-to-r from-blue-400 to-blue-600 dark:from-cyan-400 dark:to-cyan-600 rounded-full top-0" 
                  style={{ 
                    width: `${((maxTemp - minTemp) / 30) * 100}%`,
                    left: `${((minTemp + 10) / 30) * 100}%`
                  }}
                ></div>
              </div>
              <span className="max text-sm font-medium text-gray-600 dark:text-gray-400">{maxTemp}°</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="card-footer text-center w-full">
        <p className="condition text-sm text-gray-600 dark:text-gray-400 mb-2 capitalize font-medium">{t(condition)}</p>
        
        {precipitation > 0 && (
          <div className="precipitation flex items-center justify-center gap-1 text-xs text-blue-500 dark:text-cyan-400">
            <svg className="precipitation-icon w-3.5 h-3.5 fill-current opacity-80" viewBox="0 0 24 24">
              <path d="M12 3c-3.87 0-7 3.13-7 7s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
              <path d="M12 5v8l5 3-1 1-5-3V5z"/>
            </svg>
            <span className="precipitation-value font-medium">{Math.round(precipitation * 100)}% {t('Precipitation')}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherCard;