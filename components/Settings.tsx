import React from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { TempUnit } from '../types';

const Settings: React.FC = () => {
  const { settings, setTempUnit } = useSettings();

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">Settings</h2>
      
      <div className="p-6 bg-card-light dark:bg-card-dark rounded-2xl shadow-md">
        <h3 className="text-lg font-semibold text-text-light-primary dark:text-text-dark-primary">Units</h3>
        <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary mb-4">Choose your preferred measurement units.</p>
        <div className="flex items-center space-x-2">
          <span className="font-medium">Temperature</span>
          <div className="flex space-x-1 p-1 bg-bkg-light dark:bg-bkg-dark rounded-lg border border-gray-200 dark:border-slate-700">
            {(['C', 'F'] as TempUnit[]).map(unit => (
              <button
                key={unit}
                onClick={() => setTempUnit(unit)}
                className={`w-12 py-1 text-sm font-semibold rounded-md transition-colors duration-200 ${
                    settings.tempUnit === unit 
                    ? 'bg-accent text-white shadow' 
                    : 'text-text-light-secondary dark:text-text-dark-secondary hover:bg-gray-200 dark:hover:bg-slate-700'
                }`}
              >
                °{unit}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="p-6 bg-card-light dark:bg-card-dark rounded-2xl shadow-md">
        <h3 className="text-lg font-semibold text-text-light-primary dark:text-text-dark-primary">Alerts</h3>
        <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary mt-2">
          Visual and audible alerts are automatically triggered when the Air Quality Index (AQI) reaches the <span className="font-bold text-dangerous">'Dangerous'</span> level (AQI &gt; 150). This setting is not configurable.
        </p>
      </div>
    </div>
  );
};

export default Settings;