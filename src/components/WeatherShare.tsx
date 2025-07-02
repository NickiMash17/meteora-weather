import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Share2, 
  Twitter, 
  Facebook, 
  Instagram, 
  Copy, 
  Download,
  X,
  Check
} from 'lucide-react';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

interface WeatherShareProps {
  weather: any;
  location: string;
}

const WeatherShare: React.FC<WeatherShareProps> = ({ weather, location }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation();

  const getWeatherEmoji = (condition: string) => {
    switch (condition) {
      case 'Clear': return '☀️';
      case 'Clouds': return '☁️';
      case 'Rain': return '🌧️';
      case 'Snow': return '❄️';
      case 'Thunderstorm': return '⛈️';
      case 'Drizzle': return '🌦️';
      case 'Mist': return '🌫️';
      case 'Fog': return '🌫️';
      default: return '🌤️';
    }
  };

  const generateShareText = () => {
    if (!weather) return '';
    
    const temp = Math.round(weather.temperature.current);
    const condition = weather.condition.description;
    const emoji = getWeatherEmoji(weather.condition.main);
    
    return `${emoji} ${temp}°C ${t('and')} ${condition} ${t('in')} ${location} ${t('right now! Checked with Meteora Weather 🌍')}`;
  };

  const shareData = {
    title: `${t('Weather in')} ${location}`,
    text: generateShareText(),
    url: window.location.href
  };

  const handleShare = async (platform: string) => {
    const text = generateShareText();
    const url = window.location.href;

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`);
        break;
      case 'instagram':
        // Instagram doesn't support direct sharing via URL, so we copy to clipboard
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        break;
      case 'native':
        if (navigator.share) {
          try {
            await navigator.share(shareData);
          } catch (error) {
            console.log('Error sharing:', error);
          }
        } else {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
        break;
      case 'copy':
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        break;
    }
  };

  const downloadWeatherCard = () => {
    // Create a canvas element to generate the weather card
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1200;
    canvas.height = 630;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
    gradient.addColorStop(0, '#4361ee');
    gradient.addColorStop(1, '#7209b7');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 630);

    // Add weather data
    ctx.fillStyle = 'white';
    ctx.font = 'bold 48px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(`${t('Weather in')} ${location}`, 600, 150);

    if (weather) {
      const temp = Math.round(weather.temperature.current);
      const condition = weather.condition.description;
      const emoji = getWeatherEmoji(weather.condition.main);

      ctx.font = 'bold 72px Inter';
      ctx.fillText(`${emoji} ${temp}°C`, 600, 280);

      ctx.font = '32px Inter';
      ctx.fillText(condition, 600, 340);

      ctx.font = '24px Inter';
      ctx.fillText(`${t('Checked with Meteora Weather')}`, 600, 400);
    }

    // Download the image
    const link = document.createElement('a');
    link.download = `weather-${location}-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="weather-share">
      <motion.button
        className="share-button"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Share2 size={20} />
        {t('Share Weather')}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="share-modal"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="share-header">
              <h3>{t('Share Weather')}</h3>
              <button 
                className="close-button"
                onClick={() => setIsOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="share-preview">
              <div className="weather-card">
                <div className="card-header">
                  <h4>{location}</h4>
                  <span className="weather-emoji">
                    {weather ? getWeatherEmoji(weather.condition.main) : '🌍'}
                  </span>
                </div>
                {weather && (
                  <div className="card-content">
                    <div className="temperature">
                      {Math.round(weather.temperature.current)}°C
                    </div>
                    <div className="condition">
                      {weather.condition.description}
                    </div>
                    <div className="timestamp">
                      {format(new Date(), 'MMM dd, HH:mm')}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="share-options">
              <motion.button
                className="share-option twitter"
                onClick={() => handleShare('twitter')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Twitter size={20} />
                {t('Twitter')}
              </motion.button>

              <motion.button
                className="share-option facebook"
                onClick={() => handleShare('facebook')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Facebook size={20} />
                {t('Facebook')}
              </motion.button>

              <motion.button
                className="share-option instagram"
                onClick={() => handleShare('instagram')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Instagram size={20} />
                {t('Instagram')}
              </motion.button>

              <motion.button
                className="share-option copy"
                onClick={() => handleShare('copy')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
                {copied ? t('Copied!') : t('Copy Text')}
              </motion.button>

              <motion.button
                className="share-option download"
                onClick={downloadWeatherCard}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download size={20} />
                {t('Download Card')}
              </motion.button>

              <motion.button
                className="share-option native"
                onClick={() => handleShare('native')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Share2 size={20} />
                {t('Share')}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isOpen && (
        <motion.div
          className="share-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default WeatherShare; 