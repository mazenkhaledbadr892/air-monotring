import { GoogleGenAI } from "@google/genai";
import { SensorData } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Analyzes the given sensor data using the Gemini API.
 * @param data The latest sensor data.
 * @returns A string containing an AI-generated analysis and recommendation.
 */
export async function getAirQualityAnalysis(data: SensorData): Promise<string> {
    const { temperature, humidity, aqi, mq7, mq4 } = data;

    const prompt = `
        You are an expert environmental analyst. Based on the following real-time sensor data from an indoor environment, provide a concise and actionable recommendation in Arabic for the user.
        The analysis should be easy to understand for a non-technical person.

        Current Data:
        - Temperature: ${temperature.toFixed(1)}°C
        - Humidity: ${humidity.toFixed(1)}%
        - Air Quality Index (AQI): ${aqi.toFixed(0)}
        - Carbon Monoxide (CO - MQ-7): ${mq7.toFixed(0)} ppm
        - Methane (CH4 - MQ-4): ${mq4.toFixed(0)} ppm

        Start with a one-sentence summary of the current air quality status. Then, provide one or two clear, actionable recommendations.
        For example: "جودة الهواء اليوم معتدلة. ننصح بتهوية الغرفة جيداً لمدة ١٥ دقيقة." or "جودة الهواء ممتازة حالياً، لا داعي لاتخاذ أي إجراءات."
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        
        return response.text.trim();
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return "حدث خطأ أثناء تحليل البيانات. يرجى المحاولة مرة أخرى لاحقًا.";
    }
}
