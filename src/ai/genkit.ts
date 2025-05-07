
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI({apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'AIzaSyDpWpX_hqcW5iTYCm6AXq9dHBiLPAHQ8wc'})],
  model: 'googleai/gemini-2.0-flash',
});

