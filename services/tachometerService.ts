import { TachometerDataPoint } from '../types';

/**
 * MOCK IMPLEMENTATION
 * This service is mocked to provide a functional demo without a real Firebase backend.
 */

// A running interval timer for the mock data stream
let mockDataInterval: number | null = null;

/**
 * Helper to generate a single mock data point for the stream.
 * @param time The current timestamp.
 * @returns A new TachometerDataPoint.
 */
const generateMockDataPoint = (time: number): TachometerDataPoint => {
    // A combination of sine waves with some noise to simulate engine revving
    const baseRpm = 450;
    const revCycle = 300 * Math.sin(time / 5000); // Slow rev cycle
    const fastFluctuation = 150 * Math.sin(time / 1800); // Faster vibration/fluctuation
    const noise = 50 * Math.random();
    const newRpm = baseRpm + revCycle + fastFluctuation + noise;
    return { timestamp: time, rpm: Math.max(0, Math.round(newRpm)) };
};

/**
 * Checks if a device node exists.
 * MOCK: Simulates a network call and always returns true for a demo.
 * @param deviceId The ID of the device to check.
 * @returns A promise that resolves to true.
 */
export const checkDeviceExists = async (deviceId: string): Promise<boolean> => {
  console.log(`MOCK: Checking for existence of device: ${deviceId}`);
  await new Promise(resolve => setTimeout(resolve, 1000));
  // In a real app, this would check a database. For the demo, we always succeed.
  return true;
};

/**
 * Sets the power state of a device.
 * MOCK: Simulates setting power state without a real backend.
 * @param deviceId The ID of the device to control.
 * @param isOn The desired power state (true for on, false for off).
 */
export const setDevicePowerState = async (deviceId: string, isOn: boolean): Promise<void> => {
  console.log(`MOCK: Setting device ${deviceId} power state to: ${isOn}`);
  // In a real app, this would write to the database.
  return Promise.resolve();
};

/**
 * Subscribes to a live data stream from a device.
 * MOCK: Generates a fake data stream using setInterval.
 * @param deviceId The ID of the device to monitor.
 * @param callback The function to call with new data points.
 * @returns An unsubscribe function to stop the data stream.
 */
export const startDataStream = (deviceId: string, callback: (data: TachometerDataPoint[]) => void): (() => void) => {
  console.log(`Starting MOCK data stream for device: ${deviceId}`);

  // Clear any existing interval to prevent multiple streams running
  if (mockDataInterval) {
    clearInterval(mockDataInterval);
  }

  // Immediately send a batch of historical data to populate the chart on load
  const initialData: TachometerDataPoint[] = [];
  const now = Date.now();
  // Generate the last 60 seconds of data at 4 points per second
  for (let i = 60 * 4; i > 0; i--) {
      initialData.push(generateMockDataPoint(now - i * 250));
  }
  callback(initialData);

  // Start a live stream of new data points every 500ms
  mockDataInterval = window.setInterval(() => {
    const newDataPoint = generateMockDataPoint(Date.now());
    callback([newDataPoint]);
  }, 500);

  // Return a function to clean up the interval when the component unmounts
  // or the device is turned off.
  return () => {
    console.log(`Stopping MOCK data stream for device: ${deviceId}`);
    if (mockDataInterval) {
      clearInterval(mockDataInterval);
      mockDataInterval = null;
    }
  };
};
