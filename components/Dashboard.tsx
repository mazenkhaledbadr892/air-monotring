import React from 'react';
import { SensorData, AQILevel } from '../types';
import { useSettings } from '../contexts/SettingsContext';
import { Thermometer, Droplet, Wind, AlertTriangle, Molecule, Lightbulb } from './icons/Icons';
import { useTheme } from '../contexts/ThemeContext';
import { AQI_LEVELS } from '../constants';

const Gauge: React.FC<{
    value: number;
    max: number;
    label: string;
    unit: string;
    icon: React.ReactNode;
    color: string;
}> = ({ value, max, label, unit, icon, color }) => {
    const { theme } = useTheme();
    const trackColor = theme === 'dark' ? '#334155' : '#E2E8F0'; // slate-700 dark, slate-200 light
    
    const radius = 70;
    const strokeWidth = 16;
    const circumference = 2 * Math.PI * radius;
    const progress = Math.max(0, Math.min(100, (value / max) * 100));
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative flex flex-col items-center justify-between p-4 bg-card-light dark:bg-card-dark rounded-2xl shadow-md transition-shadow hover:shadow-xl h-full">
            <div className="relative w-48 h-48">
                <svg className="w-full h-full" viewBox="0 0 180 180">
                    <circle
                        strokeWidth={strokeWidth}
                        stroke={trackColor}
                        fill="transparent"
                        r={radius}
                        cx="90"
                        cy="90"
                    />
                    <circle
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        stroke={color}
                        fill="transparent"
                        r={radius}
                        cx="90"
                        cy="90"
                        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 0.5s ease-out' }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold" style={{ color }}>
                        {Math.round(value)}
                        <span className="text-2xl font-medium">{unit}</span>
                    </span>
                </div>
            </div>
            <div className="mt-2 flex items-center space-x-2 text-text-light-secondary dark:text-text-dark-secondary">
                {icon}
                <span className="text-md font-semibold">{label}</span>
            </div>
        </div>
    );
};

const AiInsightCard: React.FC<{ insight: string; isLoading: boolean }> = ({ insight, isLoading }) => {
    return (
        <div className="p-5 bg-card-light dark:bg-card-dark rounded-2xl shadow-md flex items-start space-x-4">
            <div className="flex-shrink-0 mt-1">
                <div className="p-2 bg-accent/10 rounded-full text-accent">
                   <Lightbulb className="w-6 h-6" />
                </div>
            </div>
            <div className="flex-1">
                <h3 className="font-bold text-lg text-text-light-primary dark:text-text-dark-primary mb-1">التحليل الذكي</h3>
                {isLoading ? (
                    <div className="space-y-2 animate-pulse">
                        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2"></div>
                    </div>
                ) : (
                    <p className="text-text-light-secondary dark:text-text-dark-secondary whitespace-pre-wrap">{insight}</p>
                )}
            </div>
        </div>
    );
};


interface DashboardProps {
    latestData: SensorData;
    aqiStatus: AQILevel;
    isAlerting: boolean;
    onForceStatus: (level: AQILevel['level'] | null) => void;
    aiInsight: string;
    isAiInsightLoading: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ latestData, aqiStatus, isAlerting, onForceStatus, aiInsight, isAiInsightLoading }) => {
    const { settings } = useSettings();
    const { temperature, humidity, aqi, mq7, mq4 } = latestData;

    const displayTemp = settings.tempUnit === 'C' ? temperature : (temperature * 9 / 5) + 32;
    const tempUnit = `°${settings.tempUnit}`;
    
    const statusColors = {
      safe: '#10B981',
      moderate: '#F59E0B',
      unhealthy: '#F97316',
      dangerous: '#EF4444',
    };
    const aqiColor = statusColors[aqiStatus.statusColor];

    return (
        <div className="space-y-6">
            {isAlerting && (
                <div className="p-4 bg-dangerous/10 border-l-4 border-dangerous text-dangerous rounded-lg flex items-start space-x-3 animate-glow-danger">
                    <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="font-bold">DANGER ALERT!</h3>
                        <p className="text-sm">Air Quality is at a DANGEROUS level. Take necessary precautions.</p>
                    </div>
                </div>
            )}
            
            <div className={`p-6 rounded-2xl shadow-lg text-white bg-gradient-to-br ${aqiStatus.gradient}`}>
                <h2 className="text-lg font-semibold text-white/80">Current Status</h2>
                <div className="flex items-baseline space-x-2 mt-1">
                    <p className="text-4xl font-bold">{aqiStatus.level}</p>
                    <p className="px-3 py-1 text-sm font-medium rounded-full bg-black/20">AQI {Math.round(aqi)}</p>
                </div>
                <p className="mt-2 text-white/90">{aqiStatus.description}</p>
            </div>
            
            <AiInsightCard insight={aiInsight} isLoading={isAiInsightLoading} />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                 <Gauge value={aqi} label="Air Quality Index" unit="" icon={<Wind />} color={aqiColor} max={200} />
                 <Gauge value={displayTemp} label="Temperature" unit={tempUnit} icon={<Thermometer />} color={'#3B82F6'} max={settings.tempUnit === 'C' ? 50 : 122} />
                 <Gauge value={humidity} label="Humidity" unit="%" icon={<Droplet />} color={'#22D3EE'} max={100} />
                 <Gauge value={mq7} label="MQ-7 Gas (CO)" unit="ppm" icon={<Molecule />} color={'#A855F7'} max={500} />
                 <Gauge value={mq4} label="MQ-4 Gas (CH4)" unit="ppm" icon={<Molecule />} color={'#EC4899'} max={2000} />
            </div>

            <div className="p-4 bg-card-light dark:bg-card-dark rounded-2xl shadow-md">
                <h3 className="font-bold mb-3 text-text-light-primary dark:text-text-dark-primary">Manual Alert Test Controls</h3>
                <div className="flex flex-wrap gap-2">
                    {AQI_LEVELS.map(levelInfo => (
                        <button key={levelInfo.level} onClick={() => onForceStatus(levelInfo.level)} className={`px-3 py-1 text-sm font-semibold rounded-md text-white bg-${levelInfo.statusColor} hover:opacity-90 transition-opacity`}>
                            Set to {levelInfo.level}
                        </button>
                    ))}
                    <button onClick={() => onForceStatus(null)} className="px-3 py-1 text-sm font-semibold rounded-md bg-gray-500 hover:bg-gray-600 text-white transition-colors">
                        Reset to Live Data
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;