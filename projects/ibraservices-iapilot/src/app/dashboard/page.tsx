'use client';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { DollarSign, Car, Calendar, AlertCircle, Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import * as React from 'react';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, where, Timestamp, limit } from 'firebase/firestore';
import type { Appointment, Invoice, Vehicle, Part } from '@/lib/data-types';
import { format } from 'date-fns';

const chartData = [
  { name: "Jan", total: 0 },
  { name: "Fév", total: 0 },
  { name: "Mar", total: 0 },
  { name: "Avr", total: 0 },
  { name: "Mai", total: 0 },
  { name: "Juin", total: 0 },
];

const customerData = {
    nextAppointment: "30 juin 2024 - 10:00 (Changement d'huile)",
    openQuotes: 1,
    activeIssues: 2,
    vehicle: "Toyota RAV4 (2022)"
};

function AdminDashboard() {
  const firestore = useFirestore();
  const { user } = useUser();

  const invoicesQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'invoices')) : null, [firestore]);
  const { data: invoices, isLoading: isLoadingInvoices } = useCollection<Invoice>(invoicesQuery);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const appointmentsQuery = useMemoFirebase(() => firestore && user ? query(collection(firestore, `customers/${user.uid}/appointments`), where("startTime", ">=", Timestamp.fromDate(today)), where("startTime", "<", Timestamp.fromDate(tomorrow))) : null, [firestore, user]);
  const { data: todayAppointments, isLoading: isLoadingAppointments } = useCollection<Appointment>(appointmentsQuery);

  const recentAppointmentsQuery = useMemoFirebase(() => firestore && user ? query(collection(firestore, `customers/${user.uid}/appointments`), limit(3)) : null, [firestore, user]);
  const { data: recentAppointments, isLoading: isLoadingRecent } = useCollection<Appointment>(recentAppointmentsQuery);

  const vehiclesInServiceQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'vehicles'), where('status', '==', 'In Service')) : null, [firestore]);
  const { data: vehiclesInService, isLoading: isLoadingVehicles } = useCollection<Vehicle>(vehiclesInServiceQuery);

  const lowStockQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'parts'), where('quantity', '<=', 5)) : null, [firestore]);
  const { data: lowStockParts, isLoading: isLoadingParts } = useCollection<Part>(lowStockQuery);

  const totalRevenue = React.useMemo(() => {
    if (!invoices) return 0;
    const monthlyRevenue = chartData.map(d => ({...d}));
    invoices.forEach(inv => {
        const invDate = new Date(inv.invoiceDate.seconds * 1000);
        const monthIndex = invDate.getMonth();
        if (monthIndex < monthlyRevenue.length) {
            monthlyRevenue[monthIndex].total += inv.totalAmount;
        }
    });
    // This is a bit of a hack, but it populates the chart
    monthlyRevenue.forEach((d, i) => chartData[i] = d);
    return invoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
  }, [invoices]);

  const isLoading = isLoadingInvoices || isLoadingAppointments || isLoadingVehicles || isLoadingParts || isLoadingRecent;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenu total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingInvoices ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="text-2xl font-bold">{totalRevenue.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</div>}
            <p className="text-xs text-muted-foreground">+20.1% par rapport au mois dernier</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rendez-vous aujourd'hui</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingAppointments ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="text-2xl font-bold">+{todayAppointments?.length || 0}</div>}
            <p className="text-xs text-muted-foreground">+5 depuis hier</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Véhicules en service</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingVehicles ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="text-2xl font-bold">{vehiclesInService?.length || 0}</div>}
            <p className="text-xs text-muted-foreground">2 en attente de pièces</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertes de stock faible</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            {isLoadingParts ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="text-2xl font-bold">{lowStockParts?.length || 0}</div>}
            <p className="text-xs text-muted-foreground">Filtre à air, Bougies</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="font-headline">Aperçu</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData}>
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value} €`}
                />
                <Tooltip
                  cursor={{fill: 'hsla(var(--accent) / 0.3)'}}
                  contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                   formatter={(value: number) => `${value.toLocaleString()} €`}
                />
                <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-headline">Activité récente</CardTitle>
            <CardDescription>Un aperçu des services actuels et récents.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingRecent ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <Table>
                  <TableHeader>
                      <TableRow>
                          <TableHead>Véhicule</TableHead>
                          <TableHead>Service</TableHead>
                          <TableHead>Statut</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {recentAppointments?.map(activity => (
                          <TableRow key={activity.id}>
                              <TableCell className="font-medium">{activity.vehicleId}</TableCell>
                              <TableCell>{activity.description}</TableCell>
                              <TableCell><Badge variant={activity.status === "Completed" ? "secondary" : "default"}>{activity.status}</Badge></TableCell>
                          </TableRow>
                      ))}
                  </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


export default function DashboardPage() {
  const searchParams = useSearchParams();
  const view = searchParams.get('view') || 'admin';

  return (
    <div className="flex flex-col gap-8">
      <Tabs defaultValue={view} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-sm">
          <TabsTrigger value="admin">Vue Administrateur</TabsTrigger>
          <TabsTrigger value="customer">Vue client</TabsTrigger>
        </TabsList>
        <TabsContent value="admin">
            <AdminDashboard />
        </TabsContent>
        <TabsContent value="customer" className="space-y-4">
            <h2 className="text-2xl font-bold font-headline">Bon retour, Charlie!</h2>
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Votre véhicule</CardTitle>
                        <CardDescription>{customerData.vehicle}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Statut: <span className="text-foreground font-medium">Nécessite une attention</span></p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Prochain rendez-vous</CardTitle>
                        <CardDescription>Votre prochain service programmé.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="font-medium">{customerData.nextAppointment}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Actions en attente</CardTitle>
                        <CardDescription>Éléments nécessitant votre attention.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p>{customerData.openQuotes} Devis à approuver</p>
                        <p>{customerData.activeIssues} Problèmes actifs signalés</p>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
