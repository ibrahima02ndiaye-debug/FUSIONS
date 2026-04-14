import { config } from 'dotenv';
config();

import '@/ai/flows/predict-maintenance-needs.ts';
import '@/ai/flows/ai-diagnose-car-issue.ts';
import '@/ai/flows/answer-customer-questions.ts';
import '@/ai/flows/generate-description-flow.ts';
