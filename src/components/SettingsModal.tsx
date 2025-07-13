import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/SettingsModal.css';
import { X } from 'lucide-react';

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
            <p>Settings functionality coming soon...</p>
            <div className="mt-4 space-y-2">
              <p><strong>Current Theme:</strong> {theme}</p>
              <p><strong>Time Format:</strong> {timeFormat}-hour</p>
              <p><strong>Sound:</strong> {soundEnabled ? 'On' : 'Off'}</p>
              <p><strong>Notifications:</strong> {notificationsEnabled ? 'On' : 'Off'}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SettingsModal; 