'use server';
/**
 * @fileOverview A flow to generate a marketing description for a vehicle using AI.
 *
 * - generateVehicleDescription - A function that accepts vehicle details and returns a marketing description.
 * - GenerateVehicleDescriptionInput - The input type for the generateVehicleDescription function.
 * - GenerateVehicleDescriptionOutput - The return type for the generateVehicleDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateVehicleDescriptionInputSchema = z.object({
  make: z.string().describe('The make of the vehicle (e.g., Toyota).'),
  model: z.string().describe('The model of the vehicle (e.g., Camry).'),
  year: z.number().describe('The year of the vehicle.'),
});
export type GenerateVehicleDescriptionInput = z.infer<typeof GenerateVehicleDescriptionInputSchema>;

const GenerateVehicleDescriptionOutputSchema = z.object({
  description: z.string().describe('The AI-generated marketing description for the vehicle.'),
});
export type GenerateVehicleDescriptionOutput = z.infer<typeof GenerateVehicleDescriptionOutputSchema>;

export async function generateVehicleDescription(input: GenerateVehicleDescriptionInput): Promise<GenerateVehicleDescriptionOutput> {
  return generateDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateVehicleDescriptionPrompt',
  input: {schema: GenerateVehicleDescriptionInputSchema},
  output: {schema: GenerateVehicleDescriptionOutputSchema},
  prompt: `You are a marketing expert for a car dealership.
Write a compelling, short and punchy marketing description for the following vehicle.
Highlight its key features and benefits for a potential buyer.

Vehicle Make: {{{make}}}
Vehicle Model: {{{model}}}
Vehicle Year: {{{year}}}

Generate a description that is exciting and makes someone want to buy this car.
`,
});

const generateDescriptionFlow = ai.defineFlow(
  {
    name: 'generateDescriptionFlow',
    inputSchema: GenerateVehicleDescriptionInputSchema,
    outputSchema: GenerateVehicleDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
