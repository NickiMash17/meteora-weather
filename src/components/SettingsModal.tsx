import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/SettingsModal.css';
import { 
  X, 
  Sun, 
  Moon, 
  Monitor, 
  Palette, 
  Clock, 
  Globe, 
  Bell, 
  Shield, 
  Info,
  Check,
  Settings as SettingsIcon,
  Smartphone,
  Monitor as DesktopIcon,
  Wifi,
  WifiOff,
  RefreshCw,
  Download,
  Trash2,
  Heart
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
  accentColors: { name: string; value: string; }[];
  timeFormat: '12' | '24';
  setTimeFormat: (format: '12' | '24') => void;
  favorites?: string[];
  onAddFavorite?: (location: string) => void;
  onRemoveFavorite?: (location: string) => void;
  currentLocation?: string;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  theme,
  setTheme,
  accentColor,
  setAccentColor,
  accentColors,
  timeFormat,
  setTimeFormat,
  favorites = [],
  onAddFavorite,
  onRemoveFavorite,
  currentLocation = ''
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('appearance');
  const [notifications, setNotifications] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [dataUsage, setDataUsage] = useState('balanced');
  const [newFavorite, setNewFavorite] = useState('');

  // Focus trap
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  // Close on ESC
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleTimeFormatChange = (format: '12' | '24') => {
    setTimeFormat(format);
    localStorage.setItem('meteora-time-format', format);
  };

  const clearCache = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'data', label: 'Data & Privacy', icon: Shield },
    { id: 'about', label: 'About', icon: Info },
          { id: 'favorites', label: 'Favorites', icon: Heart },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'appearance':
        return (
          <div className="space-y-6">
            {/* Theme Selection */}
            <div className="setting-group">
              <h3 className="setting-title">
                <Sun className="w-5 h-5" />
                Theme
              </h3>
              <p className="setting-description">Choose your preferred color scheme</p>
              <div className="theme-options">
                <button
                  className={`theme-option ${theme === 'light' ? 'active' : ''}`}
                  onClick={() => setTheme('light')}
                  aria-label="Light theme"
                >
                  <div className="theme-preview light">
                    <Sun className="w-6 h-6" />
                  </div>
                  <span>Light</span>
                  {theme === 'light' && <Check className="w-4 h-4" />}
                </button>
                <button
                  className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
                  onClick={() => setTheme('dark')}
                  aria-label="Dark theme"
                >
                  <div className="theme-preview dark">
                    <Moon className="w-6 h-6" />
                  </div>
                  <span>Dark</span>
                  {theme === 'dark' && <Check className="w-4 h-4" />}
                </button>
                <button
                  className={`theme-option ${theme === 'system' ? 'active' : ''}`}
                  onClick={() => setTheme('system')}
                  aria-label="System theme"
                >
                  <div className="theme-preview system">
                    <Monitor className="w-6 h-6" />
                  </div>
                  <span>System</span>
                  {theme === 'system' && <Check className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Accent Color Selection */}
            <div className="setting-group">
              <h3 className="setting-title">
                <Palette className="w-5 h-5" />
                Accent Color
              </h3>
              <p className="setting-description">Customize the app's accent color</p>
              
              <div className="color-grid">
                {accentColors.map((color) => (
                  <button
                    key={color.value}
                    className={`color-option ${accentColor === color.value ? 'active' : ''}`}
                    style={{ '--color': color.value } as React.CSSProperties}
                    onClick={() => {
                      setAccentColor(color.value);
                    }}
                    aria-label={`Set accent color to ${color.name}`}
                  >
                    <div className="color-preview"></div>
                    <span className="color-name">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Format */}
            <div className="setting-group">
              <h3 className="setting-title">
                <Clock className="w-5 h-5" />
                Time Format
              </h3>
              <p className="setting-description">Choose your preferred time display format</p>
              <div className="format-options">
                <button
                  className={`format-option ${timeFormat === '12' ? 'active' : ''}`}
                  onClick={() => handleTimeFormatChange('12')}
                >
                  <span className="format-label">12-hour</span>
                  <span className="format-example">2:30 PM</span>
                  {timeFormat === '12' && <Check className="w-4 h-4" />}
                </button>
                <button
                  className={`format-option ${timeFormat === '24' ? 'active' : ''}`}
                  onClick={() => handleTimeFormatChange('24')}
                >
                  <span className="format-label">24-hour</span>
                  <span className="format-example">14:30</span>
                  {timeFormat === '24' && <Check className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="setting-group">
              <h3 className="setting-title">
                <Bell className="w-5 h-5" />
                Notifications
              </h3>
              <p className="setting-description">Manage your notification preferences</p>
              
              <div className="toggle-group">
                <div className="toggle-item">
                  <div className="toggle-info">
                    <span className="toggle-label">Weather Alerts</span>
                    <span className="toggle-description">Get notified about severe weather</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={notifications}
                      onChange={(e) => setNotifications(e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                
                <div className="toggle-item">
                  <div className="toggle-info">
                    <span className="toggle-label">Auto Refresh</span>
                    <span className="toggle-description">Automatically update weather data</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={autoRefresh}
                      onChange={(e) => setAutoRefresh(e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 'data':
        return (
          <div className="space-y-6">
            <div className="setting-group">
              <h3 className="setting-title">
                <Shield className="w-5 h-5" />
                Data & Privacy
              </h3>
              <p className="setting-description">Control your data usage and privacy settings</p>
              
              <div className="data-usage-section">
                <h4 className="section-subtitle">Data Usage</h4>
                <div className="radio-group">
                  {[
                    { value: 'minimal', label: 'Minimal', desc: 'Lowest data usage' },
                    { value: 'balanced', label: 'Balanced', desc: 'Recommended setting' },
                    { value: 'high', label: 'High Quality', desc: 'Best experience' }
                  ].map((option) => (
                    <label key={option.value} className="radio-option">
                      <input
                        type="radio"
                        name="dataUsage"
                        value={option.value}
                        checked={dataUsage === option.value}
                        onChange={(e) => setDataUsage(e.target.value)}
                      />
                      <div className="radio-content">
                        <span className="radio-label">{option.label}</span>
                        <span className="radio-description">{option.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="actions-section">
                <h4 className="section-subtitle">Actions</h4>
                <div className="action-buttons">
                  <button className="action-button" onClick={clearCache}>
                    <Trash2 className="w-4 h-4" />
                    Clear Cache
                  </button>
                  <button className="action-button">
                    <Download className="w-4 h-4" />
                    Export Data
                  </button>
                  <button className="action-button">
                    <RefreshCw className="w-4 h-4" />
                    Reset Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="space-y-6">
            <div className="setting-group">
              <h3 className="setting-title">
                <Info className="w-5 h-5" />
                About Meteora
              </h3>
              
              <div className="about-content">
                <div className="app-info">
                  <div className="app-logo">
                    <SettingsIcon className="w-12 h-12" />
                  </div>
                  <div className="app-details">
                    <h3 className="app-name">Meteora Weather</h3>
                    <p className="app-version">Version 1.0.0</p>
                    <p className="app-description">
                      A modern weather application built with React and TypeScript
                    </p>
                  </div>
                </div>

                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Language</span>
                    <select
                      value={i18n.language}
                      onChange={e => i18n.changeLanguage(e.target.value)}
                      className="language-select"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>
                  
                  <div className="info-item">
                    <span className="info-label">Connection</span>
                    <div className="connection-status">
                      <Wifi className="w-4 h-4" />
                      <span>Online</span>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <span className="info-label">Platform</span>
                    <div className="platform-info">
                      <Smartphone className="w-4 h-4" />
                      <span>Web App</span>
                    </div>
                  </div>
                </div>

                <div className="credits">
                  <h4 className="credits-title">Credits</h4>
                  <p className="credits-text">
                    Meteora Weather App developed by <strong>Nicolette Mashaba</strong>.<br/>
                    Weather data provided by OpenWeatherMap API.<br/>
                    Icons by Lucide React. Built with modern web technologies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'favorites':
        return (
          <div className="space-y-6">
            {/* Favorites Management */}
            <div className="setting-group">
              <h3 className="setting-title">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Favorite Locations
              </h3>
              <p className="setting-description">Manage your favorite weather locations</p>
              
              {/* Add new favorite */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newFavorite}
                  onChange={(e) => setNewFavorite(e.target.value)}
                  placeholder="Enter city name..."
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                />
                <button
                  onClick={() => {
                    if (newFavorite.trim() && onAddFavorite) {
                      onAddFavorite(newFavorite.trim());
                      setNewFavorite('');
                    }
                  }}
                  disabled={!newFavorite.trim()}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white transition-colors"
                >
                  Add
                </button>
              </div>

              {/* Current location quick add */}
              {currentLocation && !favorites.includes(currentLocation) && (
                <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Current Location</p>
                      <p className="text-white/60 text-sm">{currentLocation}</p>
                    </div>
                    <button
                      onClick={() => onAddFavorite?.(currentLocation)}
                      className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors"
                    >
                      Add to Favorites
                    </button>
                  </div>
                </div>
              )}

              {/* Favorites list */}
              <div className="space-y-2">
                {favorites.map((fav, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center gap-3">
                      <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-white">{fav}</span>
                    </div>
                    <button
                      onClick={() => onRemoveFavorite?.(fav)}
                      className="p-1 text-white/50 hover:text-red-400 transition-colors"
                      title="Remove from favorites"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                {favorites.length === 0 && (
                  <div className="text-center py-8 text-white/50">
                    <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <p>No favorite locations yet</p>
                    <p className="text-sm">Add locations to quickly access their weather</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="settings-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-modal="true"
          role="dialog"
          tabIndex={-1}
        >
          <motion.div
            ref={modalRef}
            className="settings-modal"
            initial={{ scale: 0.95, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 40 }}
            tabIndex={0}
            aria-label="Settings Modal"
          >
            {/* Header */}
            <div className="settings-header">
              <h2 className="settings-title">Settings</h2>
              <button
                className="close-button"
                onClick={onClose}
                aria-label="Close settings"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="settings-tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                  aria-label={tab.label}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="settings-content">
              {renderTabContent()}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal; 