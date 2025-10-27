
import { GoogleGenAI, Type } from '@google/genai';
import { RideOption } from '../types';

let ai: GoogleGenAI | null = null;

/**
 * Lazily initializes and returns the GoogleGenAI client.
 * Throws an error if the API key is not configured.
 */
const getAiClient = (): GoogleGenAI => {
  if (!ai) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error('API_KEY environment variable not set. Please configure it in your deployment settings.');
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};


const rideOptionsSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      type: {
        type: Type.STRING,
        description: 'The type of ride (e.g., "Eco", "Comfort", "XL").',
      },
      eta: {
        type: Type.STRING,
        description: 'Estimated time of arrival for the ride in minutes.',
      },
      price: {
        type: Type.STRING,
        description: 'The estimated price for the ride in USD (e.g., "$12.50").',
      },
      description: {
        type: Type.STRING,
        description: 'A brief, appealing description of the ride type.',
      },
      capacity: {
          type: Type.STRING,
          description: 'The passenger capacity, e.g., "1-2 passengers".'
      }
    },
    required: ['type', 'eta', 'price', 'description', 'capacity'],
  },
};

export const findRides = async (pickup: string, destination: string): Promise<RideOption[]> => {
  const prompt = `
    You are an API for a ridesharing app called "Gemini Rides".
    A user wants to find a ride from "${pickup}" to "${destination}".
    Generate 3 realistic and distinct ride options for them.
    Provide varied ETAs between 2 and 10 minutes.
    Prices should be reasonable for a rideshare app.
    Keep descriptions short and enticing.
    Follow the provided JSON schema precisely.
  `;

  try {
    const geminiClient = getAiClient();
    const response = await geminiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: rideOptionsSchema,
      },
    });

    const jsonText = response.text.trim();
    const rideOptions = JSON.parse(jsonText);

    // Basic validation to ensure we have an array
    if (!Array.isArray(rideOptions)) {
        throw new Error("Invalid response format from Gemini API.");
    }
    
    return rideOptions;
  } catch (error) {
    console.error('Error fetching ride options from Gemini:', error);
    if (error instanceof Error) {
        // Re-throw the original error to be displayed in the UI
        throw error;
    }
    throw new Error('An unknown error occurred while fetching ride options.');
  }
};
