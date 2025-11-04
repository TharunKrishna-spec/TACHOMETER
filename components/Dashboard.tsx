import React, { useState, useMemo } from 'react';
import { TachometerDataPoint, Session } from '../types';
import TachometerGauge from './TachometerGauge';
import HistoryChart from './HistoryChart';
import StatCard from './StatCard';
import PowerToggle from './PowerToggle';
import AnalyticsPanel from './AnalyticsPanel';
import HistoryPanel from './HistoryPanel';
import ComparisonModal from './ComparisonModal';
import { getTachometerInsights } from '../services/geminiService';
import { AnalyticsIcon } from './icons/AnalyticsIcon';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

interface DashboardProps {
  deviceId: string;
  data: TachometerDataPoint[];
  connectionStatus: 'connecting' | 'connected' | 'disconnected';
  isDeviceOn: boolean;
  sessions: Session[];
  onChangeDevice: () => void;
  onToggleDevice: (isOn: boolean) => void;
  onSaveSessions: (sessions: Session[]) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ deviceId, data, connectionStatus, isDeviceOn, sessions, onChangeDevice, onToggleDevice, onSaveSessions }) => {
  const [insights, setInsights] = useState<string>('');
  const [isLoadingInsights, setIsLoadingInsights] = useState<boolean>(false);
  const [comparingSessions, setComparingSessions] = useState<Session[]>([]);
  
  const currentRPM = isDeviceOn && data.length > 0 ? data[data.length - 1].rpm : 0;

  const { avgRPM, maxRPM } = useMemo(() => {
    if (!isDeviceOn || data.length === 0) return { avgRPM: 0, maxRPM: 0 };
    const rpms = data.map(d => d.rpm);
    const sum = rpms.reduce((a, b) => a + b, 0);
    const avg = sum / data.length;
    const max = Math.max(...rpms);
    return { avgRPM: Math.round(avg), maxRPM: max };
  }, [data, isDeviceOn]);

  const handleGetInsights = async () => {
    if (data.length < 10) {
      setInsights("Not enough data for analysis. Please wait for at least 10 data points.");
      return;
    }
    setIsLoadingInsights(true);
    setInsights('');
    try {
      const result = await getTachometerInsights(data);
      setInsights(result);
    } catch (error) {
      console.error("Error getting insights:", error);
      setInsights("Sorry, an error occurred while analyzing the data. Please try again.");
    } finally {
      setIsLoadingInsights(false);
    }
  };
  
  const getStatusIndicator = () => {
    switch (connectionStatus) {
      case 'connected':
        return <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>;
      case 'connecting':
        return <div className="w-3 h-3 bg-yellow-500 rounded-full animate-spin"></div>;
      case 'disconnected':
        return <div className={`w-3 h-3 rounded-full ${isDeviceOn ? 'bg-red-500' : 'bg-slate-500'}`}></div>;
    }
  };

  const handleCompare = (sessionIds: string[]) => {
    const toCompare = sessions.filter(s => sessionIds.includes(s.id));
    if (toCompare.length > 1) {
        setComparingSessions(toCompare);
    }
  };

  const handleCloseComparison = () => {
      setComparingSessions([]);
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
      <header className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
            <button
                onClick={onChangeDevice}
                aria-label="Go back to device selection"
                className="p-2 -ml-2 text-gray-400 rounded-full hover:bg-white/10 hover:text-off-white transition-colors"
            >
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <PowerToggle isOn={isDeviceOn} onToggle={onToggleDevice} />
            <div>
              <h1 className="text-3xl font-bold text-off-white">Device Dashboard</h1>
              <div className="flex items-center gap-2 text-gray-400 font-mono text-sm">
                {getStatusIndicator()}
                <span>{deviceId}</span>
                <span className="text-gray-400/50">|</span>
                <span className="capitalize">{connectionStatus}</span>
              </div>
            </div>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div className="lg:col-span-1 xl:col-span-1 bg-panel-dark backdrop-blur-xl border border-cyan-tech-300/20 rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center">
          <TachometerGauge rpm={currentRPM} maxRpm={1000} />
        </div>
        
        <div className="lg:col-span-2 xl:col-span-3 bg-panel-dark backdrop-blur-xl border border-cyan-tech-300/20 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-off-white mb-4 tracking-wider">RPM History (Live)</h2>
          <div className="h-64">
            <HistoryChart data={data} />
          </div>
        </div>
        
        <div className="lg:col-span-3 xl:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Current RPM" value={currentRPM.toString()} />
          <StatCard title="Session Avg RPM" value={avgRPM.toString()} />
          <StatCard title="Session Max RPM" value={maxRPM.toString()} />
        </div>

        <div className="lg:col-span-3 xl:col-span-2 min-h-[300px]">
           <AnalyticsPanel data={data} />
        </div>

        <div className="lg:col-span-3 xl:col-span-2 min-h-[300px]">
            <HistoryPanel sessions={sessions} onSaveSessions={onSaveSessions} onCompare={handleCompare} />
        </div>

        <div className="lg:col-span-3 xl:col-span-4 bg-panel-dark backdrop-blur-xl border border-cyan-tech-300/20 rounded-2xl shadow-lg p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h2 className="text-xl font-semibold text-off-white tracking-wider">AI Performance Analysis</h2>
            <button onClick={handleGetInsights} disabled={isLoadingInsights || !isDeviceOn} className="flex items-center gap-2 py-2 px-4 text-sm font-medium rounded-lg text-black bg-cyan-tech-300 hover:bg-cyan-tech-400 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors">
              <AnalyticsIcon className="w-5 h-5"/>
              {isLoadingInsights ? 'Analyzing...' : 'Get Insights'}
            </button>
          </div>
          {isLoadingInsights && <div className="text-center text-gray-400">Loading analysis...</div>}
          {!isDeviceOn && !insights && <div className="text-center text-gray-500">Turn the device on to analyze performance.</div>}
          {insights && <div className="text-off-white bg-black/30 p-4 rounded-md font-mono text-sm whitespace-pre-wrap">{insights}</div>}
        </div>
      </main>
      {comparingSessions.length > 0 && (
          <ComparisonModal sessions={comparingSessions} onClose={handleCloseComparison} />
      )}
    </div>
  );
};

export default Dashboard;