'use server';

/**
 * @fileOverview A support chatbot AI agent.
 *
 * - supportChatbot - A function that handles the support chatbot process.
 * - SupportChatbotInput - The input type for the supportChatbot function.
 * - SupportChatbotOutput - The return type for the supportChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SupportChatbotInputSchema = z.object({
  query: z.string().describe('The user query.'),
  language: z.enum(['amharic', 'english']).describe('The language of the query.'),
});
export type SupportChatbotInput = z.infer<typeof SupportChatbotInputSchema>;

const SupportChatbotOutputSchema = z.object({
  response: z.string().describe('The chatbot response.'),
});
export type SupportChatbotOutput = z.infer<typeof SupportChatbotOutputSchema>;

export async function supportChatbot(input: SupportChatbotInput): Promise<SupportChatbotOutput> {
  return supportChatbotFlow(input);
}

const getOrderInformation = ai.defineTool(
  {
    name: 'getOrderInformation',
    description: 'Returns specific information about an order.',
    inputSchema: z.object({
      orderId: z.string().describe('The ID of the order to retrieve information for.'),
    }),
    outputSchema: z.string(),
  },
  async input => {
    // TODO: Implement this by calling an external API to fetch order details.
    // For now, return a placeholder.
    return `Order information for order ID ${input.orderId}: Status - Processing, Expected Delivery - 2 days.`;
  }
);

const supportChatbotPrompt = ai.definePrompt({
  name: 'supportChatbotPrompt',
  input: {schema: SupportChatbotInputSchema},
  output: {schema: SupportChatbotOutputSchema},
  tools: [getOrderInformation],
  prompt: `You are a 24/7 support chatbot for EasyMeds Ethiopia, an e-pharmacy platform. You can answer queries on orders, tests, and health information.

The user's query is in {{language}}.

If the user asks about a specific order, use the getOrderInformation tool to get the order details and include them in your answer.

Respond in the same language as the user's query.

User query: {{{query}}}`,
});

const supportChatbotFlow = ai.defineFlow(
  {
    name: 'supportChatbotFlow',
    inputSchema: SupportChatbotInputSchema,
    outputSchema: SupportChatbotOutputSchema,
  },
  async input => {
    const {output} = await supportChatbotPrompt(input);
    return output!;
  }
);
