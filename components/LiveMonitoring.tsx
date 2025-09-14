import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { SensorData, TempUnit } from '../types';
import { useSettings } from '../contexts/SettingsContext';
import { useTheme } from '../contexts/ThemeContext';
import { Thermometer, Droplet, Wind, Molecule } from './icons/Icons';

interface ChartCardProps {
    title: string;
    data: SensorData[];
    dataKey: keyof SensorData;
    color: string;
    unit: string;
    icon: React.ReactNode;
    tempUnit: TempUnit;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, data, dataKey, color, unit, icon, tempUnit }) => {
    const { theme } = useTheme();
    const formattedData = data.map(d => {
        let value = d[dataKey];
        if (dataKey === 'temperature' && tempUnit === 'F') {
            value = (value * 9/5) + 32;
        }
        return {
            time: new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            value: value.toFixed(1)
        };
    });

    const textColor = theme === 'dark' ? '#94A3B8' : '#64748B';
    const gridColor = theme === 'dark' ? '#334155' : '#E2E8F0';
    const tooltipBg = theme === 'dark' ? '#0F172A' : '#FFFFFF';

    return (
        <div className="bg-card-light dark:bg-card-dark p-4 rounded-2xl shadow-md">
            <div className="flex items-center space-x-2 mb-4 text-text-light-secondary dark:text-text-dark-secondary">
                {icon}
                <h3 className="font-semibold">{title}</h3>
            </div>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={formattedData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                        <XAxis dataKey="time" stroke={textColor} tick={{ fontSize: 12 }} />
                        <YAxis stroke={textColor} tick={{ fontSize: 12 }} unit={unit} domain={['dataMin - 5', 'dataMax + 5']} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: tooltipBg,
                                border: `1px solid ${color}`,
                                borderRadius: '0.5rem'
                            }}
                            labelStyle={{ color: textColor }}
                        />
                        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};


interface LiveMonitoringProps {
    liveData: SensorData[];
}

const LiveMonitoring: React.FC<LiveMonitoringProps> = ({ liveData }) => {
    const { settings } = useSettings();
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold">Live Monitoring</h2>
            <ChartCard title="Temperature" data={liveData} dataKey="temperature" color="#3B82F6" unit={` °${settings.tempUnit}`} icon={<Thermometer />} tempUnit={settings.tempUnit} />
            <ChartCard title="Humidity" data={liveData} dataKey="humidity" color="#22D3EE" unit="%" icon={<Droplet />} tempUnit={settings.tempUnit}/>
            <ChartCard title="Air Quality Index (AQI)" data={liveData} dataKey="aqi" color="#F59E0B" unit="" icon={<Wind />} tempUnit={settings.tempUnit}/>
            <ChartCard title="MQ-7 Gas (CO)" data={liveData} dataKey="mq7" color="#A855F7" unit="ppm" icon={<Molecule />} tempUnit={settings.tempUnit}/>
            <ChartCard title="MQ-4 Gas (CH4)" data={liveData} dataKey="mq4" color="#EC4899" unit="ppm" icon={<Molecule />} tempUnit={settings.tempUnit}/>
        </div>
    );
};

export default LiveMonitoring;