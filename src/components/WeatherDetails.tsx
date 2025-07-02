import { CurrentWeatherData } from '../types/weather';
import '../styles/WeatherDetails.css';
import { getCityDate } from '../utils/timezone';
import { useTranslation } from 'react-i18next';

interface WeatherDetailsProps {
  weather: CurrentWeatherData;
  timeFormat?: '12' | '24';
}

const WeatherDetails: React.FC<WeatherDetailsProps> = ({ weather, timeFormat = '12' }) => {
  const {
    wind,
    humidity,
    pressure,
    visibility,
    sunrise,
    sunset,
    uvIndex
  } = weather;

  const { t } = useTranslation();

  const formatTime = (timestamp: number) => {
    if (!weather || typeof weather.timezone !== 'number') return '';
    return getCityDate(weather, timestamp).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: timeFormat === '12'
    });
  };

  const formatVisibility = (meters: number) => {
    const kilometers = meters / 1000;
    return `${kilometers.toFixed(1)} km`;
  };

  const getUVLevel = (uv: number) => {
    if (uv <= 2) return { level: t('Low'), width: `${(uv / 12) * 100}%`, color: '#4caf50' };
    if (uv <= 5) return { level: t('Moderate'), width: `${(uv / 12) * 100}%`, color: '#ffc107' };
    if (uv <= 7) return { level: t('High'), width: `${(uv / 12) * 100}%`, color: '#ff9800' };
    if (uv <= 10) return { level: t('Very High'), width: `${(uv / 12) * 100}%`, color: '#f44336' };
    return { level: t('Extreme'), width: '100%', color: '#9c27b0' };
  };

  const uvData = getUVLevel(uvIndex);

  const getSunProgress = () => {
    if (!weather || typeof weather.timezone !== 'number') return 0;
    const now = getCityDate(weather).getTime() / 1000;
    const dayLength = sunset - sunrise;
    const progress = (now - sunrise) / dayLength;
    return Math.max(0, Math.min(1, progress)) * 100;
  };

  const sunPosition = getSunProgress();

  return (
    <div className="weather-details">
      <h3 className="details-title">{t('Weather Details')}</h3>
      
      <div className="details-grid">
        <div className="detail-card">
          <div className="detail-header">
            <div className="detail-icon">
              <svg viewBox="0 0 24 24">
                <path d="M12 3c-3.87 0-7 3.13-7 7s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
                <path d="M13.49 11.38l3.12 3.12-1.88 1.88-3.12-3.12-3.12 3.12-1.88-1.88 3.12-3.12L6.63 8.5l1.88-1.88 3.12 3.12 3.12-3.12 1.88 1.88-3.12 3.12z"/>
              </svg>
            </div>
            <h4>{t('Wind')}</h4>
          </div>
          <div className="detail-value">
            <span className="primary-value">{wind.speed} m/s</span>
            <div className="wind-direction-container">
              <div 
                className="wind-direction" 
                style={{ transform: `rotate(${wind.direction}deg)` }}
                aria-label={t('Wind direction {{direction}} degrees', { direction: wind.direction })}
              >
                <svg viewBox="0 0 24 24">
                  <path d="M12 2L4 12l8 10 8-10z"/>
                </svg>
              </div>
              <span className="wind-degrees">{wind.direction}°</span>
            </div>
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-header">
            <div className="detail-icon">
              <svg viewBox="0 0 24 24">
                <path d="M12 3c-3.87 0-7 3.13-7 7s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
                <path d="M12 5v8l5 3-1 1-5-3V5z"/>
              </svg>
            </div>
            <h4>{t('Humidity')}</h4>
          </div>
          <div className="detail-value">
            <span className="primary-value">{humidity}%</span>
            <div className="progress-container">
              <div className="progress-bar">
                <div 
                  className="progress" 
                  style={{ width: `${humidity}%` }}
                ></div>
              </div>
              <span className="progress-label">
                {humidity < 30 ? t('Dry') : humidity < 60 ? t('Comfortable') : t('Humid')}
              </span>
            </div>
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-header">
            <div className="detail-icon">
              <svg viewBox="0 0 24 24">
                <path d="M12 3c-3.87 0-7 3.13-7 7s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
                <path d="M12 5v8l5 3-1 1-5-3V5z"/>
              </svg>
            </div>
            <h4>{t('Visibility')}</h4>
          </div>
          <div className="detail-value">
            <span className="primary-value">{formatVisibility(visibility)}</span>
            <div className="visibility-scale">
              <div className="scale-dot"></div>
              <div className="scale-dot"></div>
              <div className="scale-dot"></div>
              <div className="scale-dot"></div>
              <div className={`scale-dot ${visibility > 10000 ? 'active' : ''}`}></div>
              <div className={`scale-dot ${visibility > 5000 ? 'active' : ''}`}></div>
              <div className={`scale-dot ${visibility > 2000 ? 'active' : ''}`}></div>
              <div className={`scale-dot ${visibility > 1000 ? 'active' : ''}`}></div>
            </div>
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-header">
            <div className="detail-icon">
              <svg viewBox="0 0 24 24">
                <path d="M12 3c-3.87 0-7 3.13-7 7s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
                <path d="M12 5v8l5 3-1 1-5-3V5z"/>
              </svg>
            </div>
            <h4>{t('Pressure')}</h4>
          </div>
          <div className="detail-value">
            <span className="primary-value">{pressure} hPa</span>
            <div className="pressure-indicator">
              <div className="indicator-needle" style={{
                transform: `rotate(${((pressure - 970) / 60) * 180 - 90}deg)`
              }}></div>
            </div>
            <span className="pressure-label">
              {pressure < 1000 ? t('Low') : pressure < 1020 ? t('Normal') : t('High')}
            </span>
          </div>
        </div>

        <div className="detail-card uv-card">
          <div className="detail-header">
            <div className="detail-icon">
              <svg viewBox="0 0 24 24">
                <path d="M12 3c-3.87 0-7 3.13-7 7s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
                <path d="M12 5v8l5 3-1 1-5-3V5z"/>
              </svg>
            </div>
            <h4>{t('UV Index')}</h4>
          </div>
          <div className="detail-value">
            <div className="uv-container">
              <span className="uv-value">{uvIndex}</span>
              <span className="uv-level">{uvData.level}</span>
              <div className="uv-progress-bar">
                <div 
                  className="uv-progress" 
                  style={{ width: uvData.width, backgroundColor: uvData.color }}
                ></div>
              </div>
              <div className="uv-scale">
                <span>{t('0')}</span>
                <span>{t('3')}</span>
                <span>{t('6')}</span>
                <span>{t('9')}</span>
                <span>{t('12+')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="detail-card sun-card">
          <div className="detail-header">
            <div className="detail-icon">
              <svg viewBox="0 0 24 24">
                <path d="M12 3c-3.87 0-7 3.13-7 7s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
                <path d="M12 5v8l5 3-1 1-5-3V5z"/>
              </svg>
            </div>
            <h4>{t('Sunrise & Sunset')}</h4>
          </div>
          <div className="detail-value">
            <div className="sun-container">
              <div className="sun-timeline">
                <div className="sun-icon" style={{ left: `${sunPosition}%` }}>
                  <svg viewBox="0 0 24 24">
                    <path d="M12 3c-3.87 0-7 3.13-7 7s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
                    <path d="M12 5v8l5 3-1 1-5-3V5z"/>
                  </svg>
                </div>
                <div className="sun-progress" style={{ width: `${sunPosition}%` }}></div>
              </div>
              <div className="sun-times">
                <div className="sun-time">
                  <span className="time-label">{t('Sunrise')}</span>
                  <span className="time-value">{formatTime(sunrise)}</span>
                </div>
                <div className="sun-time">
                  <span className="time-label">{t('Sunset')}</span>
                  <span className="time-value">{formatTime(sunset)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDetails;