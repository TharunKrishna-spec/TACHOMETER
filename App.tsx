import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SplashScreen from './components/SplashScreen';
import LandingPage from './components/LandingPage';
import DeviceSelector from './components/DeviceSelector';
import Dashboard from './components/Dashboard';
import ParticlesBackground from './components/ParticlesBackground';
import { TachometerDataPoint, Session } from './types';
import { startDataStream, setDevicePowerState } from './services/tachometerService';

const App: React.FC = () => {
  const [view, setView] = useState<'splash' | 'landing' | 'selector' | 'dashboard'>('splash');
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [data, setData] = useState<TachometerDataPoint[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const [isDeviceOn, setIsDeviceOn] = useState<boolean>(false);
  const [isTogglingDevice, setIsTogglingDevice] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);

  useEffect(() => {
    try {
        const storedSessions = localStorage.getItem('tachometerSessions');
        if (storedSessions) {
            setSessions(JSON.parse(storedSessions));
        }
    } catch (error) {
        console.error("Failed to load sessions from local storage", error);
        localStorage.removeItem('tachometerSessions');
    }
  }, []);

  const handleSaveSessions = (updatedSessions: Session[]) => {
      try {
          setSessions(updatedSessions);
          localStorage.setItem('tachometerSessions', JSON.stringify(updatedSessions));
      } catch (error) {
          console.error("Failed to save sessions to local storage", error);
      }
  };
  
  const handleEnter = () => setView('landing');
  const handleGetStarted = () => setView('selector');
  const handleReturnToLanding = () => setView('landing');

  const handleDeviceSelect = (selectedDeviceId: string) => {
    setDeviceId(selectedDeviceId);
    setData([]);
    setIsDeviceOn(false);
    setConnectionStatus('disconnected');
    setError(null);
    setView('dashboard');
  };

  const handleToggleDevice = async (isOn: boolean) => {
    if (!deviceId || isTogglingDevice) return;

    setError(null);
    setIsTogglingDevice(true);

    try {
      await setDevicePowerState(deviceId, isOn);
      setIsDeviceOn(isOn);
      if (isOn) {
        setConnectionStatus('connecting');
        setData([]);
        setSessionStartTime(Date.now());
      } else {
        setConnectionStatus('disconnected');
        if (sessionStartTime && data.length > 1) {
            const endTime = Date.now();
            const durationInSeconds = Math.round((endTime - sessionStartTime) / 1000);
            const rpms = data.map(d => d.rpm);
            const avgRpm = Math.round(rpms.reduce((a, b) => a + b, 0) / rpms.length);
            const maxRpm = Math.max(...rpms);
            const minRpm = Math.min(...rpms);
    
            const newSession: Session = {
                id: `session-${sessionStartTime}`,
                startTime: sessionStartTime,
                duration: durationInSeconds,
                avgRpm,
                maxRpm,
                minRpm,
                data: [...data]
            };
            handleSaveSessions([...sessions, newSession].sort((a,b) => b.startTime - a.startTime));
        }
        setSessionStartTime(null);
      }
    } catch (error) {
      console.error("Failed to set device power state:", error);
      const errorMessage = 'Failed to toggle device power. Please try again.';
      setError(errorMessage);
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsTogglingDevice(false);
    }
  };
  
  const handleChangeDevice = () => {
    if (isDeviceOn) {
      handleToggleDevice(false);
    }
    setDeviceId(null);
    setData([]);
    setConnectionStatus('disconnected');
    setError(null);
    setView('selector');
  };

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    if (deviceId && isDeviceOn) {
      const dataCallback = (newDataChunk: TachometerDataPoint[]) => {
          if (connectionStatus !== 'connected') {
            setConnectionStatus('connected');
          }
          setData(prevData => [...prevData, ...newDataChunk].slice(-60));
      };

      unsubscribe = startDataStream(deviceId, dataCallback);
      
    } else {
      setData([]);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [deviceId, isDeviceOn, connectionStatus]);
  
  const renderContent = () => {
    switch(view) {
        case 'splash':
            return <SplashScreen onEnter={handleEnter} />;
        case 'landing':
            return <LandingPage onGetStarted={handleGetStarted} />;
        case 'selector':
            return <DeviceSelector onDeviceSelect={handleDeviceSelect} onBack={handleReturnToLanding} />;
        case 'dashboard':
            if (!deviceId) {
                setView('selector'); // Should not happen, but as a fallback
                return <DeviceSelector onDeviceSelect={handleDeviceSelect} onBack={handleReturnToLanding} />;
            }
            return <Dashboard 
                deviceId={deviceId} 
                data={data} 
                connectionStatus={connectionStatus}
                isDeviceOn={isDeviceOn}
                sessions={sessions}
                onChangeDevice={handleChangeDevice}
                onToggleDevice={handleToggleDevice}
                onSaveSessions={handleSaveSessions}
            />;
        default:
             return <SplashScreen onEnter={handleEnter} />;
    }
  }

  return (
    <>
      <ParticlesBackground />
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  )
};

export default App;