import { GoogleGenAI } from "@google/genai";
import { TachometerDataPoint } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getTachometerInsights = async (data: TachometerDataPoint[]): Promise<string> => {
  if (data.length === 0) {
    return "No data available for analysis.";
  }

  const prompt = `
    Analyze the following tachometer data which represents engine RPM over time.
    Provide a brief, professional performance analysis in 2-3 sentences.
    Comment on engine stability, mention any sudden spikes or drops, and identify the peak RPM.
    The data is an array of objects with 'rpm' and 'timestamp' properties.
    Here is the data (last 100 points):
    ${JSON.stringify(data.slice(-100))}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating insights with Gemini:", error);
    throw new Error("Failed to get insights from AI.");
  }
};
