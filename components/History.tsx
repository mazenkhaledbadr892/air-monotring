import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { SensorData, HistoryPeriod } from '../types';
import { useSettings } from '../contexts/SettingsContext';
import { useTheme } from '../contexts/ThemeContext';

interface HistoryProps {
  historicalData: SensorData[];
  onPeriodChange: (period: HistoryPeriod) => void;
}

const History: React.FC<HistoryProps> = ({ historicalData, onPeriodChange }) => {
  const [activePeriod, setActivePeriod] = useState<HistoryPeriod>('day');
  const { settings } = useSettings();
  const { theme } = useTheme();

  const handlePeriodChange = (period: HistoryPeriod) => {
    setActivePeriod(period);
    onPeriodChange(period);
  };

  const formatXAxis = (tickItem: number) => {
    const date = new Date(tickItem);
    switch(activePeriod) {
        case 'day': return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'});
        case 'week': return date.toLocaleDateString([], { weekday: 'short' });
        case 'month': return date.toLocaleDateString([], { day: 'numeric', month: 'short'});
        default: return '';
    }
  };

  const formattedData = historicalData.map(d => ({
    ...d,
    temperature: settings.tempUnit === 'F' ? (d.temperature * 9 / 5) + 32 : d.temperature,
  }));
  
  const textColor = theme === 'dark' ? '#94A3B8' : '#64748B';
  const gridColor = theme === 'dark' ? '#334155' : '#E2E8F0';
  const tooltipBg = theme === 'dark' ? '#0F172A' : '#FFFFFF';

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold">Data History</h2>
            <div className="flex space-x-1 p-1 bg-bkg-light dark:bg-bkg-dark rounded-lg border border-gray-200 dark:border-slate-700">
                {(['day', 'week', 'month'] as HistoryPeriod[]).map(period => (
                    <button
                        key={period}
                        onClick={() => handlePeriodChange(period)}
                        className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors duration-200 ${
                            activePeriod === period 
                            ? 'bg-accent text-white shadow' 
                            : 'text-text-light-secondary dark:text-text-dark-secondary hover:bg-gray-200 dark:hover:bg-slate-700'
                        }`}
                    >
                        {period.charAt(0).toUpperCase() + period.slice(1)}
                    </button>
                ))}
            </div>
        </div>

        <div className="bg-card-light dark:bg-card-dark p-4 rounded-2xl shadow-md h-96">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formattedData} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis 
                        dataKey="timestamp" 
                        tickFormatter={formatXAxis} 
                        stroke={textColor}
                        tick={{ fontSize: 12 }}
                        angle={-30}
                        textAnchor="end"
                        height={40}
                    />
                    <YAxis yAxisId="left" stroke={"#3B82F6"} tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" stroke={"#64748B"} tick={{ fontSize: 12 }} />
                    <Tooltip 
                        formatter={(value, name) => [`${(value as number).toFixed(1)}`, name]}
                        labelFormatter={(label) => new Date(label).toLocaleString()}
                        contentStyle={{
                            backgroundColor: tooltipBg,
                            border: `1px solid ${gridColor}`,
                            borderRadius: '0.5rem'
                        }}
                    />
                    <Legend wrapperStyle={{fontSize: "14px"}}/>
                    <Line yAxisId="left" type="monotone" dataKey="temperature" name={`Temp (°${settings.tempUnit})`} stroke="#3B82F6" strokeWidth={2} dot={false} />
                    <Line yAxisId="right" type="monotone" dataKey="humidity" name="Humidity (%)" stroke="#22D3EE" strokeWidth={2} dot={false} />
                    <Line yAxisId="right" type="monotone" dataKey="aqi" name="AQI" stroke="#F59E0B" strokeWidth={2} dot={false} />
                    <Line yAxisId="right" type="monotone" dataKey="mq7" name="MQ-7 (ppm)" stroke="#A855F7" strokeWidth={2} dot={false} />
                    <Line yAxisId="right" type="monotone" dataKey="mq4" name="MQ-4 (ppm)" stroke="#EC4899" strokeWidth={2} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
};

export default History;