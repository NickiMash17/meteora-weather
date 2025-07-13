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
  Trash2
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
  accentColors: { name: string; value: string }[];
  timeFormat: '12' | '24';
  setTimeFormat: (format: '12' | '24') => void;
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
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('appearance');
  const [notifications, setNotifications] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [dataUsage, setDataUsage] = useState('balanced');

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
                    onClick={() => setAccentColor(color.value)}
                    aria-label={`Set accent color to ${color.name}`}
                  >
                    <div className="color-preview" style={{ background: color.value }}></div>
                    <span className="color-name">{color.name}</span>
                    {accentColor === color.value && <Check className="w-4 h-4" />}
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