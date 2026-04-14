'use client';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Sparkles, AlertTriangle } from 'lucide-react';

import { generateVehicleDescription, type GenerateVehicleDescriptionOutput } from '@/ai/flows/generate-description-flow';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  make: z.string().min(2, { message: 'Make must be at least 2 characters.' }),
  model: z.string().min(1, { message: 'Model is required.' }),
  year: z.coerce.number().min(1900, 'Invalid year.').max(new Date().getFullYear() + 1, 'Invalid year.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function DescriptionGeneratorPage() {
  const [generatedDescription, setGeneratedDescription] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { make: '', model: '', year: new Date().getFullYear() },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setError(null);
    setGeneratedDescription(null);

    try {
      const result = await generateVehicleDescription({
        make: data.make,
        model: data.model,
        year: data.year,
      });
      setGeneratedDescription(result.description);
      toast({
        title: "Description Generated!",
        description: "The AI has created a new marketing description.",
      });
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: "Generation Failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-0">
       <div className="mb-6">
        <h1 className="text-3xl font-bold font-headline">AI Description Generator</h1>
        <p className="text-muted-foreground">Use the power of Gemini to create compelling vehicle descriptions.</p>
       </div>
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><Sparkles /> Vehicle Details</CardTitle>
            <CardDescription>Enter the vehicle information to generate a description.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="make"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Make</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Toyota" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Camry" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 2024" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                    </>
                  ) : 'Generate Description'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">Generated Description</CardTitle>
            <CardDescription>The AI-powered result will appear below.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-4">Gemini is thinking...</p>
              </div>
            )}
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {generatedDescription ? (
              <Textarea readOnly value={generatedDescription} rows={10} className="bg-muted" />
            ) : (
              !isLoading && <p className="text-center text-muted-foreground py-8">Results will be displayed here.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
