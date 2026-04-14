'use client';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';
import { vehicles } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle, Wand2, ShieldCheck, DollarSign, CalendarClock } from 'lucide-react';
import { predictMaintenanceNeeds, type PredictMaintenanceNeedsOutput } from '@/ai/flows/predict-maintenance-needs';
import { useToast } from '@/hooks/use-toast';

const serviceHistory = [
    { date: "2023-10-15", service: "Oil Change, Tire Rotation", cost: "$75.00" },
    { date: "2023-05-20", service: "Brake Pad Replacement", cost: "$250.00" },
    { date: "2022-11-01", service: "Annual Inspection", cost: "$150.00" },
];

const diagnosticReports = [
    { date: "2023-09-01", issue: "Engine Misfire", result: "Faulty spark plug in cylinder 2. Replaced.", status: "Resolved" },
    { date: "2024-02-10", issue: "Rattling Noise", result: "AI Diagnosis: 85% probability of loose heat shield.", status: "Pending Repair" },
];

function PredictiveMaintenanceTab() {
  const [prediction, setPrediction] = useState<PredictMaintenanceNeedsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handlePredict = async () => {
    setIsLoading(true);
    setError(null);
    setPrediction(null);
    try {
      // In a real app, you'd fetch this data.
      const vehicleHistory = "Vehicle has 45,000 miles. Last oil change at 40,000 miles. Brake pads replaced at 30,000 miles. Original tires.";
      const currentVehicleData = "Current mileage: 45,000. Tire tread depth at 4/32 inch. No active diagnostic trouble codes.";
      const result = await predictMaintenanceNeeds({ vehicleHistory, currentVehicleData });
      setPrediction(result);
      toast({ title: "Prediction Generated", description: "AI has forecasted future maintenance needs." });
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(errorMessage);
      toast({ variant: 'destructive', title: "Prediction Failed", description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const urgencyIcon = (urgency: string) => {
    switch (urgency.toLowerCase()) {
        case 'immediate': return <AlertTriangle className="h-5 w-5 text-destructive" />;
        case 'soon': return <CalendarClock className="h-5 w-5 text-yellow-500" />;
        case 'upcoming': return <ShieldCheck className="h-5 w-5 text-green-500" />;
        default: return <ShieldCheck className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Predictive Maintenance Forecast</CardTitle>
        <CardDescription>Use AI to predict future maintenance needs based on vehicle history and data.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
            <Button onClick={handlePredict} disabled={isLoading}>
            {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
            ) : (
                <><Wand2 className="mr-2 h-4 w-4" /> Generate AI Forecast</>
            )}
            </Button>
        </div>

        {error && <div className="text-destructive text-center">{error}</div>}

        {prediction && (
            <div className='space-y-4'>
                <h3 className="font-semibold text-lg">Overall Recommendation:</h3>
                <p className="text-muted-foreground bg-accent/50 p-4 rounded-lg">{prediction.overallRecommendation}</p>

                <div className="space-y-4">
                    {prediction.predictedMaintenance.map((item, index) => (
                        <Card key={index} className="p-4">
                            <div className="flex items-start gap-4">
                                <div className="pt-1">{urgencyIcon(item.urgency)}</div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-bold text-base">{item.maintenanceItem}</h4>
                                        <div className="flex items-center gap-4">
                                            <Badge variant="outline" className="flex items-center gap-1">
                                                <DollarSign size={14}/> {item.estimatedCost}
                                            </Badge>
                                            <Badge>{item.urgency}</Badge>
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">{item.rationale}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}


export default function VehicleDetailPage({ params }: { params: { id: string } }) {
  const vehicle = vehicles.find((v) => v.id === params.id);

  if (!vehicle) {
    notFound();
  }

  return (
    <div className="container mx-auto p-0 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-6">
            <Image
              src={vehicle.imageUrl}
              alt={`${vehicle.make} ${vehicle.model}`}
              width={400}
              height={300}
              className="rounded-lg object-cover"
              data-ai-hint={vehicle.imageHint}
            />
            <div className="space-y-2">
              <h1 className="text-3xl font-bold font-headline">{vehicle.make} {vehicle.model} ({vehicle.year})</h1>
              <p className="text-muted-foreground">Owner: {vehicle.owner}</p>
              <p className="text-muted-foreground">VIN: {vehicle.vin}</p>
              <Badge variant={vehicle.status === "Needs Attention" || vehicle.status === "Maintenance Due" ? "destructive" : "secondary"}>
                Status: {vehicle.status}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">Service History</TabsTrigger>
          <TabsTrigger value="predictive">Predictive Maintenance</TabsTrigger>
          <TabsTrigger value="diagnostics">Diagnostic Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Vehicle Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Details about the vehicle's current condition, upcoming appointments, and open quotes will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Service History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead className="text-right">Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {serviceHistory.map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell>{entry.date}</TableCell>
                      <TableCell>{entry.service}</TableCell>
                      <TableCell className="text-right">{entry.cost}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictive" className="mt-4">
          <PredictiveMaintenanceTab />
        </TabsContent>

        <TabsContent value="diagnostics" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Diagnostic Reports</CardTitle>
            </CardHeader>
            <CardContent>
            <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Issue</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {diagnosticReports.map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell>{entry.date}</TableCell>
                      <TableCell>{entry.issue}</TableCell>
                      <TableCell>{entry.result}</TableCell>
                      <TableCell>
                        <Badge variant={entry.status === 'Resolved' ? 'secondary' : 'default'}>{entry.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
