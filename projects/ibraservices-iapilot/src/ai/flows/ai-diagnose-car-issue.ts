'use server';
/**
 * @fileOverview AI-powered car issue diagnosis flow.
 *
 * - diagnoseCarIssue - A function that accepts car issue symptoms and images, and returns a diagnostic report with potential causes.
 * - DiagnoseCarIssueInput - The input type for the diagnoseCarIssue function.
 * - DiagnoseCarIssueOutput - The return type for the diagnoseCarIssue function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiagnoseCarIssueInputSchema = z.object({
  symptoms: z.string().describe('The symptoms of the car issue.'),
  photoDataUri: z
    .string()
    .describe(
      "A photo related to the car issue, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DiagnoseCarIssueInput = z.infer<typeof DiagnoseCarIssueInputSchema>;

const DiagnoseCarIssueOutputSchema = z.object({
  potentialCauses: z.array(z.string()).describe('A list of potential causes for the car issue.'),
  confidenceLevels: z
    .array(z.number())
    .describe('A list of confidence levels (0-1) for each potential cause.'),
});
export type DiagnoseCarIssueOutput = z.infer<typeof DiagnoseCarIssueOutputSchema>;

export async function diagnoseCarIssue(input: DiagnoseCarIssueInput): Promise<DiagnoseCarIssueOutput> {
  return diagnoseCarIssueFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diagnoseCarIssuePrompt',
  input: {schema: DiagnoseCarIssueInputSchema},
  output: {schema: DiagnoseCarIssueOutputSchema},
  prompt: `You are an expert car mechanic specializing in diagnosing car issues.

You will use the following information to diagnose the car issue and provide a list of potential causes with confidence levels.

Symptoms: {{{symptoms}}}
Photo: {{media url=photoDataUri}}

Provide the potential causes as a list of strings, and the confidence levels as a corresponding list of numbers between 0 and 1.
`,
});

const diagnoseCarIssueFlow = ai.defineFlow(
  {
    name: 'diagnoseCarIssueFlow',
    inputSchema: DiagnoseCarIssueInputSchema,
    outputSchema: DiagnoseCarIssueOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
