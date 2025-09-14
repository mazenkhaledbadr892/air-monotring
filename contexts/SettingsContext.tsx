
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { TempUnit } from '../types';

interface Settings {
  tempUnit: TempUnit;
  alertThreshold: number;
}

interface SettingsContextType {
  settings: Settings;
  setTempUnit: (unit: TempUnit) => void;
  setAlertThreshold: (threshold: number) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const DEFAULT_SETTINGS: Settings = {
  tempUnit: 'C',
  alertThreshold: 151, // Default to 'Dangerous'
};

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  const setTempUnit = (unit: TempUnit) => {
    setSettings(prev => ({ ...prev, tempUnit: unit }));
  };

  const setAlertThreshold = (threshold: number) => {
    setSettings(prev => ({ ...prev, alertThreshold: threshold }));
  };

  return (
    <SettingsContext.Provider value={{ settings, setTempUnit, setAlertThreshold }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
   