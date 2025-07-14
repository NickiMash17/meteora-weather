import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/SettingsModal.css';
import { X, Sun, Moon, Monitor, Palette, Clock, Volume2, VolumeX, Bell, BellOff } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark' | 'system';
  onThemeChange: (theme: 'light' | 'dark' | 'system') => void;
  accentColor: string;
  onAccentColorChange: (color: string) => void;
  timeFormat: '12' | '24';
  onTimeFormatChange: (format: '12' | '24') => void;
  soundEnabled: boolean;
  onSoundToggle: (enabled: boolean) => void;
  notificationsEnabled: boolean;
  onNotificationsToggle: (enabled: boolean) => void;
}

const accentColors = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Purple', value: '#a21caf' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Yellow', value: '#fbbf24' },
  { name: 'Rose', value: '#f472b6' }
];

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  theme,
  onThemeChange,
  accentColor,
  onAccentColorChange,
  timeFormat,
  onTimeFormatChange,
  soundEnabled,
  onSoundToggle,
  notificationsEnabled,
  onNotificationsToggle
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

        return (
    <AnimatePresence>
      <motion.div
        className="settings-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          ref={modalRef}
          className="settings-modal"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="settings-header">
            <h2>Settings</h2>
            <button className="close-button" onClick={onClose}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="settings-content">
            {/* Theme Settings */}
            <div className="setting-section">
              <h3 className="setting-title">Theme</h3>
              <div className="theme-options">
                <button
                  className={`theme-option ${theme === 'light' ? 'active' : ''}`}
                  onClick={() => onThemeChange('light')}
                >
                  <Sun className="w-5 h-5" />
                  <span>Light</span>
                </button>
                <button
                  className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
                  onClick={() => onThemeChange('dark')}
                >
                  <Moon className="w-5 h-5" />
                  <span>Dark</span>
                </button>
                <button
                  className={`theme-option ${theme === 'system' ? 'active' : ''}`}
                  onClick={() => onThemeChange('system')}
                >
                  <Monitor className="w-5 h-5" />
                  <span>System</span>
                </button>
              </div>
            </div>

            {/* Accent Color Settings */}
            <div className="setting-section">
              <h3 className="setting-title">Accent Color</h3>
              <div className="color-options">
                {accentColors.map((color) => (
                  <button
                    key={color.value}
                    className={`color-option ${accentColor === color.value ? 'active' : ''}`}
                    onClick={() => onAccentColorChange(color.value)}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  >
                    {accentColor === color.value && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="color-check"
                      >
                        ✓
                      </motion.div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Format Settings */}
            <div className="setting-section">
              <h3 className="setting-title">Time Format</h3>
              <div className="time-format-options">
                <button
                  className={`time-format-option ${timeFormat === '12' ? 'active' : ''}`}
                  onClick={() => onTimeFormatChange('12')}
                >
                  <Clock className="w-5 h-5" />
                  <span>12-hour</span>
                </button>
                <button
                  className={`time-format-option ${timeFormat === '24' ? 'active' : ''}`}
                  onClick={() => onTimeFormatChange('24')}
                >
                  <Clock className="w-5 h-5" />
                  <span>24-hour</span>
                </button>
              </div>
            </div>

            {/* Sound Settings */}
            <div className="setting-section">
              <h3 className="setting-title">Sound</h3>
              <div className="toggle-section">
                  <div className="toggle-info">
                  <span>Weather sound effects</span>
                  <span className="toggle-description">Play ambient sounds based on weather conditions</span>
                </div>
                <button
                  className={`toggle-button ${soundEnabled ? 'enabled' : 'disabled'}`}
                  onClick={() => onSoundToggle(!soundEnabled)}
                >
                  <motion.div
                    className="toggle-slider"
                    animate={{ x: soundEnabled ? 20 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    {soundEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                  </motion.div>
                  </button>
              </div>
            </div>

            {/* Notifications Settings */}
            <div className="setting-section">
              <h3 className="setting-title">Notifications</h3>
              <div className="toggle-section">
                <div className="toggle-info">
                  <span>Weather alerts</span>
                  <span className="toggle-description">Receive notifications for severe weather</span>
                </div>
                <button
                  className={`toggle-button ${notificationsEnabled ? 'enabled' : 'disabled'}`}
                  onClick={() => onNotificationsToggle(!notificationsEnabled)}
                >
                  <motion.div
                    className="toggle-slider"
                    animate={{ x: notificationsEnabled ? 20 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    {notificationsEnabled ? <Bell className="w-3 h-3" /> : <BellOff className="w-3 h-3" />}
                  </motion.div>
                    </button>
                  </div>
                </div>

            {/* App Info */}
            <div className="setting-section">
              <h3 className="setting-title">About</h3>
              <div className="app-info">
                <p><strong>Version:</strong> 1.0.0</p>
                <p><strong>Developer:</strong> Nicolette Mashaba</p>
                <p><strong>Data Source:</strong> OpenWeatherMap API</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SettingsModal; 