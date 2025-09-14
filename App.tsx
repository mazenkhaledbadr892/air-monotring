import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { SettingsProvider } from './contexts/SettingsContext';
import useAirQualityData from './hooks/useAirQualityData';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import LiveMonitoring from './components/LiveMonitoring';
import History from './components/History';
import Settings from './components/Settings';
import { Page, AQILevel } from './types';
import { AQI_LEVELS } from './constants';

const AppContent: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentPage, setCurrentPage] = useState<Page>('Dashboard');
    const { theme } = useTheme();

    const { latestData, liveData, historicalData, generateHistoricalData, aiInsight, isAiInsightLoading } = useAirQualityData();
    const [isAlerting, setIsAlerting] = useState(false);
    const [hasPlayedSound, setHasPlayedSound] = useState(false);
    const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
    const masterGainRef = useRef<GainNode | null>(null);
    const [forcedAqiStatus, setForcedAqiStatus] = useState<AQILevel | null>(null);

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [theme]);
    
    const initAudioContext = () => {
        if (!audioContext) {
            try {
                const newAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                const gainNode = newAudioContext.createGain();
                gainNode.connect(newAudioContext.destination);
                masterGainRef.current = gainNode;
                setAudioContext(newAudioContext);
            } catch (e) {
                console.error("Web Audio API is not supported in this browser");
            }
        }
    };
    
    const stopAlertSound = useCallback(() => {
        if (masterGainRef.current && audioContext) {
            const now = audioContext.currentTime;
            masterGainRef.current.gain.cancelScheduledValues(now);
            masterGainRef.current.gain.linearRampToValueAtTime(0, now + 0.5); // Smooth fade out
        }
    }, [audioContext]);

    const playAlertSound = useCallback(() => {
        if (!audioContext || !masterGainRef.current) {
            console.error("Audio context not available to play sound.");
            return;
        }
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        
        const masterGain = masterGainRef.current;
        const now = audioContext.currentTime;
        
        // Restore volume smoothly
        masterGain.gain.cancelScheduledValues(now);
        masterGain.gain.linearRampToValueAtTime(0.3, now + 0.1);

        const beepDuration = 0.1;
        const beepInterval = 0.5;
        const totalDuration = 10;

        for (let i = 0; i < totalDuration / beepInterval; i++) {
            const startTime = now + i * beepInterval;
            
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(masterGain);
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(1000, startTime);
            
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(1, startTime + beepDuration * 0.1);
            gainNode.gain.linearRampToValueAtTime(0, startTime + beepDuration);
            
            oscillator.start(startTime);
            oscillator.stop(startTime + beepDuration);
        }
    }, [audioContext]);
    
    const getAqiStatus = (aqi: number) => {
        const level = AQI_LEVELS.slice().reverse().find(l => aqi >= l.threshold);
        return level || AQI_LEVELS[0];
    };
    
    const realAqiStatus = getAqiStatus(latestData.aqi);
    const aqiStatus = forcedAqiStatus || realAqiStatus;

    useEffect(() => {
        const isDangerous = aqiStatus.level === 'Dangerous';
        setIsAlerting(isDangerous);

        let soundCooldownTimer: NodeJS.Timeout | undefined;

        if (isDangerous) {
            if (!hasPlayedSound) {
                playAlertSound();
                setHasPlayedSound(true);
                // Allow sound to re-trigger after 15s if condition persists
                soundCooldownTimer = setTimeout(() => {
                    setHasPlayedSound(false);
                }, 15000); // 10s sound + 5s cooldown
            }
        } else {
            // If the level is no longer dangerous, stop sound and reset flag.
            stopAlertSound();
            setHasPlayedSound(false);
        }

        return () => {
            if (soundCooldownTimer) {
                clearTimeout(soundCooldownTimer);
            }
        };
    }, [aqiStatus.level, hasPlayedSound, playAlertSound, stopAlertSound]);

    const handleLogin = () => {
        initAudioContext();
        setIsLoggedIn(true);
    }
    
    const handleForceStatus = (level: AQILevel['level'] | null) => {
        if (level === null) {
            setForcedAqiStatus(null);
        } else {
            const newStatus = AQI_LEVELS.find(l => l.level === level);
            if (newStatus) {
                // To make the test data more realistic, we can fake a value within that range
                const mockAqiValue = newStatus.threshold + Math.random() * 20;
                setForcedAqiStatus({...newStatus, aqi: mockAqiValue});
            }
        }
    };


    const renderPage = () => {
        const dataForDashboard = {
          ...latestData,
          aqi: forcedAqiStatus ? forcedAqiStatus.aqi || forcedAqiStatus.threshold : latestData.aqi
        };

        switch (currentPage) {
            case 'Dashboard':
                return <Dashboard 
                            latestData={dataForDashboard} 
                            aqiStatus={aqiStatus} 
                            isAlerting={isAlerting} 
                            onForceStatus={handleForceStatus} 
                            aiInsight={aiInsight}
                            isAiInsightLoading={isAiInsightLoading}
                        />;
            case 'Live':
                return <LiveMonitoring liveData={liveData} />;
            case 'History':
                return <History historicalData={historicalData} onPeriodChange={generateHistoricalData} />;
            case 'Settings':
                return <Settings />;
            default:
                return <Dashboard 
                            latestData={dataForDashboard} 
                            aqiStatus={aqiStatus} 
                            isAlerting={isAlerting} 
                            onForceStatus={handleForceStatus} 
                            aiInsight={aiInsight}
                            isAiInsightLoading={isAiInsightLoading}
                        />;
        }
    };
    
    if (!isLoggedIn) {
        return <Login onLogin={handleLogin} />;
    }

    return (
        <Layout currentPage={currentPage} setCurrentPage={setCurrentPage} isAlerting={isAlerting}>
            {renderPage()}
        </Layout>
    );
};

const App: React.FC = () => (
    <ThemeProvider>
        <SettingsProvider>
            <AppContent />
        </SettingsProvider>
    </ThemeProvider>
);

export default App;