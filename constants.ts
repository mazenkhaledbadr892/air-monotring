import { AQILevel } from './types';

export const AQI_LEVELS: AQILevel[] = [
  { level: 'Safe', threshold: 0, color: 'text-safe', statusColor: 'safe', gradient: 'from-emerald-500 to-green-600', description: 'Air quality is considered satisfactory, and air pollution poses little or no risk.' },
  { level: 'Moderate', threshold: 51, color: 'text-moderate', statusColor: 'moderate', gradient: 'from-amber-400 to-orange-500', description: 'Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people.' },
  { level: 'Unhealthy', threshold: 101, color: 'text-unhealthy', statusColor: 'unhealthy', gradient: 'from-orange-500 to-red-600', description: 'Members of sensitive groups may experience health effects. The general public is not likely to be affected.' },
  { level: 'Dangerous', threshold: 151, color: 'text-dangerous', statusColor: 'dangerous', gradient: 'from-red-600 to-rose-700', description: 'Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.' },
];

export const MAX_LIVE_DATA_POINTS = 30; // Show last 2.5 minutes of data (30 * 5s)