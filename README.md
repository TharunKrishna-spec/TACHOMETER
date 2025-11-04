# Tachometer Real-time Monitor

This is a modern, responsive web application designed to monitor real-time and historical data from an IoT-enabled tachometer. It provides a sleek, futuristic interface for users to connect to a device and visualize engine performance data through a live gauge, historical charts, and AI-powered analysis.

**[View the Live Demo](https://tachometer.vercel.app/)**



## Key Features

- **Real-time Data Streaming**: Connect to a device and watch RPM data update live on the dashboard.
- **Interactive Dashboard**: Features a dynamic tachometer gauge, a live-updating history chart for the last 60 seconds of data, and key performance statistics (Current, Average, and Max RPM).
- **Session Management**: 
    - Start and stop data recording sessions with a simple toggle.
    - Sessions are automatically saved to local storage when the device is turned off.
    - View, delete, and clear session history.
- **Data Comparison**: Select two or more past sessions to compare their RPM data side-by-side on an overlayed chart.
- **AI-Powered Insights**: Utilizes the Google Gemini API to provide a professional, AI-generated analysis of the current session's performance data.
- **Data Export**: Export any saved session's data to a CSV file for external analysis.
- **Stunning UI/UX**: Built with a "tech-noir" aesthetic, featuring fluid animations from Framer Motion, particle backgrounds, and a responsive layout crafted with Tailwind CSS.
- **Fully Mocked Backend**: The application simulates a live data stream and device connection, allowing it to run standalone without any backend or hardware setup.

## Technology Stack

- **Frontend**: React, TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion, GSAP (for the splash screen)
- **Charting**: Recharts
- **AI Integration**: Google Gemini API (`@google/genai`)
- **State Management**: React Hooks (`useState`, `useEffect`)
- **Local Storage**: For persisting session history.

## How It Works

The application is designed to be a seamless, single-page experience.

1.  **Splash Screen**: A captivating spiral animation greets the user upon first load.
2.  **Landing Page**: Presents the application's features and value proposition.
3.  **Device Selector**: The user is prompted to enter a Device ID. Since the backend is mocked, **any non-empty ID will work**. The application simulates a verification check.
4.  **Dashboard**: This is the main interface where all the action happens.
    - **Power Toggle**: The user must first "turn on" the device using the power toggle. This initiates the mock data stream.
    - **Live Data**: The gauge, chart, and stat cards will immediately begin displaying the simulated data.
    - **Saving a Session**: Turning the device "off" will end the current session. If the session has meaningful data, it will be automatically saved to the "Session History" panel.
    - **Analysis & History**: Users can interact with the analytics panels, get AI insights, and manage their saved session history.
    - **Changing Device**: The user can return to the device selector screen at any time to "connect" to a new device.
