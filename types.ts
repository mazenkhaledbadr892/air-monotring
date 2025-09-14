export type Page = 'Dashboard' | 'Live' | 'History' | 'Settings';

export type TempUnit = 'C' | 'F';

export interface SensorData {
  timestamp: number;
  temperature: number;
  humidity: number;
  aqi: number;
  mq7: number; // Carbon Monoxide (CO)
  mq4: number; // Methane (CH4)
}

export interface AQILevel {
  level: 'Safe' | 'Moderate' | 'Unhealthy' | 'Dangerous';
  color: string;
  threshold: number;
  statusColor: 'safe' | 'moderate' | 'unhealthy' | 'dangerous';
  gradient: string;
  description: string;
  // FIX: Add optional 'aqi' property to allow for storing a specific AQI value with a forced status. This resolves errors in App.tsx.
  aqi?: number;
}

export type HistoryPeriod = 'day' | 'week' | 'month';