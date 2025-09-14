import { useState, useEffect, useCallback, useRef } from 'react';
import { SensorData, HistoryPeriod, AQILevel } from '../types';
import * as AirQualityService from '../services/mockAirQualityService';
import { getAirQualityAnalysis } from '../services/geminiService';
import { MAX_LIVE_DATA_POINTS, AQI_LEVELS } from '../constants';

const getAqiStatus = (aqi: number): AQILevel => {
    const level = AQI_LEVELS.slice().reverse().find(l => aqi >= l.threshold);
    return level || AQI_LEVELS[0];
};

const useAirQualityData = () => {
  const [latestData, setLatestData] = useState<SensorData>(AirQualityService.generateRealTimeData());
  const [liveData, setLiveData] = useState<SensorData[]>([latestData]);
  const [historicalData, setHistoricalData] = useState<SensorData[]>([]);
  const [aiInsight, setAiInsight] = useState<string>('');
  const [isAiInsightLoading, setIsAiInsightLoading] = useState<boolean>(true);
  const previousAqiLevelRef = useRef<AQILevel['level'] | null>(null);

  const getAnalysisForData = useCallback(async (data: SensorData) => {
    setIsAiInsightLoading(true);
    try {
      const analysis = await getAirQualityAnalysis(data);
      setAiInsight(analysis);
    } catch (error) {
      console.error("Error getting AI analysis:", error);
      setAiInsight("Could not retrieve AI analysis at this time.");
    } finally {
      setIsAiInsightLoading(false);
    }
  }, []);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const newData = AirQualityService.generateRealTimeData();
      
      setLatestData(newData);
      setLiveData(prevData => {
        const updatedData = [...prevData, newData];
        if (updatedData.length > MAX_LIVE_DATA_POINTS) {
          return updatedData.slice(updatedData.length - MAX_LIVE_DATA_POINTS);
        }
        return updatedData;
      });

      // --- OPTIMIZATION ---
      // Only get a new AI analysis when the AQI *level* changes.
      const newAqiStatus = getAqiStatus(newData.aqi);
      if (previousAqiLevelRef.current !== newAqiStatus.level) {
        getAnalysisForData(newData);
        previousAqiLevelRef.current = newAqiStatus.level;
      }

    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [getAnalysisForData]);
  
  const generateHistoricalData = useCallback((period: HistoryPeriod) => {
    const data = AirQualityService.generateHistoricalData(period);
    setHistoricalData(data);
  }, []);

  // Fetch initial data and analysis ONCE on mount
  useEffect(() => {
    generateHistoricalData('day');
    // The `latestData` from the initial state is used for the first analysis call.
    getAnalysisForData(latestData).then(() => {
        const initialStatus = getAqiStatus(latestData.aqi);
        previousAqiLevelRef.current = initialStatus.level;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return { latestData, liveData, historicalData, generateHistoricalData, aiInsight, isAiInsightLoading };
};

export default useAirQualityData;