
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TachometerDataPoint } from '../types';

interface HistoryChartProps {
  data: TachometerDataPoint[];
}

const HistoryChart: React.FC<HistoryChartProps> = ({ data }) => {
  const formattedData = data.map(d => ({
    ...d,
    time: new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={formattedData}
        margin={{
          top: 5,
          right: 20,
          left: -10,
          bottom: 5,
        }}
      >
        <defs>
            <filter id="line-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 245, 212, 0.1)" />
        <XAxis dataKey="time" stroke="#888" tick={{ fill: '#888', fontSize: 12 }} />
        <YAxis stroke="#888" domain={[0, 1200]} tick={{ fill: '#888', fontSize: 12 }} />
        <Tooltip
            contentStyle={{
                backgroundColor: 'rgba(10, 10, 10, 0.8)',
                backdropFilter: 'blur(5px)',
                borderColor: 'rgba(0, 245, 212, 0.3)',
                color: '#E6E6E6',
                borderRadius: '8px',
            }}
            labelStyle={{ color: '#9BFCF3', fontWeight: 'bold' }}
        />
        <Line 
            type="monotone" 
            dataKey="rpm" 
            stroke="#00F5D4" 
            strokeWidth={3} 
            dot={false} 
            isAnimationActive={true}
            animationDuration={300}
            animationEasing="ease-out"
            style={{ filter: 'url(#line-glow)' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default HistoryChart;