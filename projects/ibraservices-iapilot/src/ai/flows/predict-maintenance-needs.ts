'use server';

/**
 * @fileOverview AI-driven predictive maintenance flow.
 *
 * - predictMaintenanceNeeds - A function that predicts future maintenance needs for a vehicle.
 * - PredictMaintenanceNeedsInput - The input type for the predictMaintenanceNeeds function.
 * - PredictMaintenanceNeedsOutput - The return type for the predictMaintenanceNeeds function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictMaintenanceNeedsInputSchema = z.object({
  vehicleHistory: z.string().describe('A detailed history of the vehicle, including past maintenance, repairs, and any reported issues.'),
  currentVehicleData: z.string().describe('Current data from the vehicle, such as mileage, sensor readings, and recent performance metrics.'),
});
export type PredictMaintenanceNeedsInput = z.infer<typeof PredictMaintenanceNeedsInputSchema>;

const PredictMaintenanceNeedsOutputSchema = z.object({
  predictedMaintenance: z.array(
    z.object({
      maintenanceItem: z.string().describe('The specific maintenance item needed.'),
      urgency: z.string().describe('The urgency of the maintenance item (e.g., immediate, soon, upcoming).'),
      estimatedCost: z.number().describe('The estimated cost for the maintenance item.'),
      rationale: z.string().describe('The rationale behind the predicted maintenance need.'),
    })
  ).describe('A list of predicted maintenance items with their urgency, estimated cost and rationale.'),
  overallRecommendation: z.string().describe('An overall recommendation for the vehicle based on the predicted maintenance needs.'),
});
export type PredictMaintenanceNeedsOutput = z.infer<typeof PredictMaintenanceNeedsOutputSchema>;

export async function predictMaintenanceNeeds(input: PredictMaintenanceNeedsInput): Promise<PredictMaintenanceNeedsOutput> {
  return predictMaintenanceNeedsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictMaintenanceNeedsPrompt',
  input: {schema: PredictMaintenanceNeedsInputSchema},
  output: {schema: PredictMaintenanceNeedsOutputSchema},
  prompt: `You are an AI assistant specializing in predicting vehicle maintenance needs based on vehicle history and current data.

Analyze the following vehicle history and current data to predict future maintenance needs. Provide a list of predicted maintenance items with their urgency, estimated cost, and a rationale.

Vehicle History: {{{vehicleHistory}}}
Current Vehicle Data: {{{currentVehicleData}}}

Format your response as a JSON object conforming to the PredictMaintenanceNeedsOutputSchema schema.
`,
});

const predictMaintenanceNeedsFlow = ai.defineFlow(
  {
    name: 'predictMaintenanceNeedsFlow',
    inputSchema: PredictMaintenanceNeedsInputSchema,
    outputSchema: PredictMaintenanceNeedsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
