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
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Image from 'next/image';
import { Lightbulb, Wrench, Loader2, AlertTriangle, Upload } from 'lucide-react';

import { diagnoseCarIssue, type DiagnoseCarIssueOutput } from '@/ai/flows/ai-diagnose-car-issue';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  symptoms: z.string().min(10, { message: 'Please describe the symptoms in at least 10 characters.' }),
  photo: z.any()
    .refine(files => files?.length === 1, "A photo is required.")
    .refine(files => files?.[0]?.size <= 5000000, `Max file size is 5MB.`)
    .refine(
      files => ["image/jpeg", "image/png", "image/webp"].includes(files?.[0]?.type),
      "Only .jpg, .png, and .webp formats are supported."
    ),
});

type FormValues = z.infer<typeof formSchema>;

export default function DiagnosticsPage() {
  const [diagnosis, setDiagnosis] = useState<DiagnoseCarIssueOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { symptoms: '' },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
        setPreview(null);
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setError(null);
    setDiagnosis(null);

    const file = data.photo[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
        const photoDataUri = reader.result as string;
        try {
            const result = await diagnoseCarIssue({
                symptoms: data.symptoms,
                photoDataUri,
            });
            setDiagnosis(result);
            toast({
                title: "Diagnosis Complete",
                description: "The AI has analyzed the issue.",
            });
        } catch (e) {
            console.error(e);
            const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
            setError(errorMessage);
            toast({
                variant: 'destructive',
                title: "Diagnosis Failed",
                description: errorMessage,
            });
        } finally {
            setIsLoading(false);
        }
    };
    reader.onerror = () => {
        setError('Failed to read file.');
        setIsLoading(false);
    };
  };

  return (
    <div className="container mx-auto p-0">
       <div className="mb-6">
        <h1 className="text-3xl font-bold font-headline">AI Car Diagnostic Tool</h1>
        <p className="text-muted-foreground">Upload symptoms and an image to get an AI-driven diagnosis.</p>
       </div>
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><Wrench /> Submit Issue</CardTitle>
            <CardDescription>Provide details about the car problem.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="symptoms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Symptoms</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Engine makes a rattling noise, smoke from exhaust..." {...field} rows={5} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="photo"
                  render={({ field }) => (
                    <FormItem>
                        <FormLabel>Photo of the Issue</FormLabel>
                        <FormControl>
                            <div className="relative">
                                <Input type="file" className="opacity-0 absolute inset-0 w-full h-full z-10 cursor-pointer" {...form.register('photo')} onChange={handleFileChange} />
                                <div className="border-2 border-dashed border-muted-foreground/50 rounded-lg p-6 text-center hover:bg-accent transition-colors">
                                    {preview ?
                                        <Image src={preview} alt="Preview" width={400} height={300} className="max-h-48 w-auto mx-auto object-contain rounded-md" /> :
                                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                            <Upload className="w-8 h-8" />
                                            <span>Click or drag to upload image</span>
                                            <span className="text-xs">PNG, JPG, WEBP up to 5MB</span>
                                        </div>
                                    }
                                </div>
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Diagnosing...
                    </>
                  ) : 'Get AI Diagnosis'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><Lightbulb /> AI Diagnosis Results</CardTitle>
            <CardDescription>Potential causes based on the provided information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-4">AI is analyzing the data...</p>
              </div>
            )}
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {diagnosis ? (
              <div className="space-y-4">
                <h3 className="font-semibold">Potential Causes:</h3>
                <ul className="space-y-3">
                  {diagnosis.potentialCauses.map((cause, index) => (
                    <li key={index}>
                      <p className="font-medium">{cause}</p>
                      <div className="flex items-center gap-2">
                        <Progress value={diagnosis.confidenceLevels[index] * 100} className="w-full" />
                        <span className="text-sm font-semibold w-12 text-right">
                          {Math.round(diagnosis.confidenceLevels[index] * 100)}%
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              !isLoading && <p className="text-center text-muted-foreground py-8">Results will be displayed here.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
