
import { SensorData, HistoryPeriod } from '../types';

// Simulates a reading from a sensor
function createDataPoint(base: Partial<SensorData> = {}): SensorData {
  const now = Date.now();
  const tempFluctuation = (Math.sin(now / 60000) * 5); // slow wave over a minute
  const humidityFluctuation = (Math.cos(now / 50000) * 10);
  const aqiFluctuation = (Math.sin(now / 30000) * 20) + (Math.random() * 10 - 5);
  const mq7Fluctuation = (Math.sin(now / 45000) * 15) + (Math.random() * 5 - 2.5);
  const mq4Fluctuation = (Math.cos(now / 70000) * 40) + (Math.random() * 20 - 10);

  return {
    timestamp: base.timestamp || now,
    temperature: base.temperature || (22 + tempFluctuation + (Math.random() * 0.5 - 0.25)),
    humidity: base.humidity || (45 + humidityFluctuation + (Math.random() * 2 - 1)),
    aqi: base.aqi || Math.max(0, Math.min(200, 75 + aqiFluctuation)),
    mq7: base.mq7 || Math.max(0, Math.min(500, 30 + mq7Fluctuation)), // CO in ppm
    mq4: base.mq4 || Math.max(0, Math.min(2000, 300 + mq4Fluctuation)), // Methane in ppm
  };
}

// Generates a single new data point
export function generateRealTimeData(): SensorData {
  return createDataPoint();
}

// Generates a dataset for a given historical period
export function generateHistoricalData(period: HistoryPeriod): SensorData[] {
  const now = Date.now();
  let dataPoints: SensorData[] = [];
  let startTime: number;
  let pointsCount: number;
  let interval: number;

  switch (period) {
    case 'day':
      pointsCount = 24;
      interval = 60 * 60 * 1000; // 1 hour
      startTime = now - (pointsCount * interval);
      break;
    case 'week':
      pointsCount = 7;
      interval = 24 * 60 * 60 * 1000; // 1 day
      startTime = now - (pointsCount * interval);
      break;
    case 'month':
      pointsCount = 30;
      interval = 24 * 60 * 60 * 1000; // 1 day
      startTime = now - (pointsCount * interval);
      break;
  }
  
  // Base values for a more realistic trend
  let baseAqi = 50 + Math.random() * 50;
  let baseTemp = 18 + Math.random() * 10;
  let baseHumidity = 40 + Math.random() * 15;
  let baseMq7 = 25 + Math.random() * 20;
  let baseMq4 = 280 + Math.random() * 50;

  for (let i = 0; i < pointsCount; i++) {
    const timestamp = startTime + (i * interval);
    // Add some larger, slower-moving random walks to the base values
    baseAqi += (Math.random() - 0.5) * 15;
    baseAqi = Math.max(10, Math.min(180, baseAqi)); // clamp values
    baseTemp += (Math.random() - 0.5) * 2;
    baseTemp = Math.max(10, Math.min(35, baseTemp));
    baseHumidity += (Math.random() - 0.5) * 5;
    baseHumidity = Math.max(30, Math.min(70, baseHumidity));
    baseMq7 += (Math.random() - 0.5) * 5;
    baseMq7 = Math.max(10, Math.min(100, baseMq7));
    baseMq4 += (Math.random() - 0.5) * 30;
    baseMq4 = Math.max(200, Math.min(500, baseMq4));


    dataPoints.push(createDataPoint({ 
      timestamp, 
      aqi: baseAqi + (Math.random() * 10 - 5),
      temperature: baseTemp + (Math.random() * 2 - 1),
      humidity: baseHumidity + (Math.random() * 5 - 2.5),
      mq7: baseMq7 + (Math.random() * 10 - 5),
      mq4: baseMq4 + (Math.random() * 20 - 10),
    }));
  }

  return dataPoints;
}