import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sun, Moon, Monitor } from 'lucide-react';
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-modal="true"
          role="dialog"
          tabIndex={-1}
        >
          <motion.div
            ref={modalRef}
            className="glass-card max-w-md w-full p-6 rounded-2xl shadow-2xl relative focus:outline-none"
            initial={{ scale: 0.95, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 40 }}
            tabIndex={0}
            aria-label="Settings Modal"
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 dark:bg-gray-700/20 hover:bg-white/40 dark:hover:bg-gray-700/40 transition"
              onClick={onClose}
              aria-label="Close settings"
            >
              <X className="w-5 h-5 text-gray-700 dark:text-gray-200" />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Settings</h2>
            {/* Theme Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">Theme</h3>
              <div className="flex items-center justify-center gap-4">
                <button
                  className={`flex flex-col items-center px-4 py-2 rounded-lg border-2 transition focus:outline-none ${theme === 'light' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-transparent'}`}
                  onClick={() => setTheme('light')}
                  aria-label="Light theme"
                >
                  <Sun className="w-6 h-6 mb-1 text-yellow-400" />
                  <span className="text-xs font-medium">Light</span>
                </button>
                <button
                  className={`flex flex-col items-center px-4 py-2 rounded-lg border-2 transition focus:outline-none ${theme === 'dark' ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-transparent'}`}
                  onClick={() => setTheme('dark')}
                  aria-label="Dark theme"
                >
                  <Moon className="w-6 h-6 mb-1 text-purple-400" />
                  <span className="text-xs font-medium">Dark</span>
                </button>
                <button
                  className={`flex flex-col items-center px-4 py-2 rounded-lg border-2 transition focus:outline-none ${theme === 'system' ? 'border-gray-500 bg-gray-50 dark:bg-gray-900/20' : 'border-transparent'}`}
                  onClick={() => setTheme('system')}
                  aria-label="System theme"
                >
                  <Monitor className="w-6 h-6 mb-1 text-gray-400" />
                  <span className="text-xs font-medium">System</span>
                </button>
              </div>
            </div>
            {/* Accent Color Selection */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">Accent Color</h3>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {accentColors.map((c) => (
                  <button
                    key={c.value}
                    className={`w-8 h-8 rounded-full border-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-transform hover:scale-110 ${accentColor === c.value ? 'border-blue-500 ring-2 ring-blue-300' : 'border-white/70'}`}
                    style={{ background: c.value }}
                    aria-label={`Set accent color to ${c.name}`}
                    onClick={() => setAccentColor(c.value)}
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <label className="font-medium text-gray-700 dark:text-gray-200">Time Format</label>
              <div className="flex gap-3">
                <button
                  className={`px-3 py-1 rounded-lg border ${timeFormat === '12' ? 'bg-blue-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200'} transition`}
                  onClick={() => handleTimeFormatChange('12')}
                  aria-label="Set 12-hour time format"
                  type="button"
                >
                  12-hour
                </button>
                <button
                  className={`px-3 py-1 rounded-lg border ${timeFormat === '24' ? 'bg-blue-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200'} transition`}
                  onClick={() => handleTimeFormatChange('24')}
                  aria-label="Set 24-hour time format"
                  type="button"
                >
                  24-hour
                </button>
              </div>
            </div>
            <div className="settings-option">
              <label htmlFor="language-select">{t('Language')}</label>
              <select
                id="language-select"
                value={i18n.language}
                onChange={e => i18n.changeLanguage(e.target.value)}
                aria-label={t('Language')}
              >
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal; 