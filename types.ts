

export interface TachometerDataPoint {
  timestamp: number;
  rpm: number;
}

// FIX: Added the 'Session' interface, which was missing but required by multiple components.
export interface Session {
  id: string;
  startTime: number;
  duration: number;
  avgRpm: number;
  maxRpm: number;
  minRpm: number;
  data: TachometerDataPoint[];
}
