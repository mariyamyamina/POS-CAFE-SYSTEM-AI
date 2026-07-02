import React, { createContext, useContext, useState, useEffect } from 'react';
import { settingsApi } from '../api';

const SettingsContext = createContext(null);

const DEFAULT_SETTINGS = {
  cafe_name: 'POS Cafe',
  time_format: 'hh:mm A',
  logo: null,
  low_stock_threshold: 10,
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  const loadSettings = async () => {
  setLoading(true);
  setIsUnauthorized(false); // 🔥 IMPORTANT RESET

  try {
    const data = await settingsApi.getSettings();
    setSettings(data);
  } catch (error) {
    const status = error?.response?.status || error?.status;

    if (status === 401 || status === 403) {
      setIsUnauthorized(true);
      setSettings(DEFAULT_SETTINGS); // optional safety reset
    } else {
      console.error('Failed to load settings:', error);
    }
  } finally {
    setLoading(false);
  }
};

  const updateSettings = async (newSettings) => {
    try {
      const updated = await settingsApi.updateSettings(newSettings);
      setSettings(updated);
      return updated;
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw error;
    }
  };


  return (
    <SettingsContext.Provider value={{ settings, loading, updateSettings, reloadSettings: loadSettings, isUnauthorized }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export default SettingsContext;
