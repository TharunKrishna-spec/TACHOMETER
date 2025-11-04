import React, { useState, useEffect } from 'react';
import TachometerGauge from './TachometerGauge';
import HistoryChart from './HistoryChart';
import StatCard from './StatCard';
import { TachometerDataPoint } from '../types';

const generateDataPoint = (time: number): TachometerDataPoint => {
  const newRpm = 450 + 300 * Math.sin(time / 2000) + 150 * Math.sin(time / 800) + 50 * Math.random();
  return { timestamp: time, rpm: Math.max(0, Math.round(newRpm)) };
};

const DashboardPreview: React.FC = () => {
  const [mockData, setMockData] = useState<TachometerDataPoint[]>([]);

  useEffect(() => {
    // Pre-populate some data
    const initialData: TachometerDataPoint[] = [];
    const now = Date.now();
    for (let i = 30; i > 0; i--) {
        initialData.push(generateDataPoint(now - i * 1000));
    }
    setMockData(initialData);

    const interval = setInterval(() => {
      const newDataPoint = generateDataPoint(Date.now());
      setMockData(prevData => [...prevData, newDataPoint].slice(-30));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const currentRpm = mockData.length > 0 ? mockData[mockData.length - 1].rpm : 0;
  const avgRpm = mockData.length > 0 ? Math.round(mockData.reduce((acc, curr) => acc + curr.rpm, 0) / mockData.length) : 0;

  return (
    <div className="bg-panel-dark backdrop-blur-xl border border-cyan-tech-300/20 rounded-2xl shadow-glow-cyan p-6 relative overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="sm:col-span-1 flex items-center justify-center">
                <TachometerGauge rpm={currentRpm} maxRpm={1000} />
            </div>
            <div className="sm:col-span-2">
                <div className="h-40">
                    <HistoryChart data={mockData} />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <StatCard title="Live RPM" value={String(currentRpm)} />
                    <StatCard title="Avg RPM" value={String(avgRpm)} />
                </div>
            </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark/50 to-transparent pointer-events-none"></div>
        <div className="absolute top-4 right-4 text-xs font-mono uppercase tracking-widest text-cyan-tech-300/50">
            LIVE PREVIEW
        </div>
    </div>
  );
};

export default DashboardPreview;
