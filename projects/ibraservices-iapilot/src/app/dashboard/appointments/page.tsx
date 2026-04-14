'use client';
import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle } from 'lucide-react';
import {
  useCollection,
  useFirestore,
  useMemoFirebase,
  updateDocumentNonBlocking,
  useUser,
} from '@/firebase';
import { collection, query, doc } from 'firebase/firestore';
import type { Appointment } from '@/lib/data-types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';

const columns = [
  'Scheduled',
  'In Progress',
  'QC',
  'Done',
];

const columnTitles: { [key: string]: string } = {
  Scheduled: 'À faire',
  'In Progress': 'En cours',
  QC: 'Contrôle Qualité',
  Done: 'Terminé',
};

export default function AppointmentsPage() {
  const firestore = useFirestore();
  const { user } = useUser();

  const appointmentsQuery = useMemoFirebase(
    () => (firestore && user ? query(collection(firestore, `customers/${user.uid}/appointments`)) : null),
    [firestore, user]
  );
  const { data: appointments, isLoading } =
    useCollection<Appointment>(appointmentsQuery);

  const getAppointmentsByStatus = (status: string) => {
    return (
      appointments?.filter((app) => app.status === status) || []
    );
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, appId: string) => {
    e.dataTransfer.setData("appId", appId);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, newStatus: string) => {
    const appId = e.dataTransfer.getData("appId");
    if (firestore && user && appId) {
        const appointmentRef = doc(firestore, `customers/${user.uid}/appointments`, appId);
        updateDocumentNonBlocking(appointmentRef, { status: newStatus });
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="container mx-auto p-0">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold font-headline">Rendez-vous</h1>
          <p className="text-muted-foreground">
            Gérez le flux de travail avec le tableau Kanban.
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Planifier un rendez-vous
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-headline">
                Nouveau rendez-vous
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Client
                </Label>
                <Input
                  id="name"
                  defaultValue="John Doe"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="vehicle" className="text-right">
                  Véhicule
                </Label>
                <Input
                  id="vehicle"
                  defaultValue="Toyota Camry"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="service" className="text-right">
                  Service
                </Label>
                <Input
                  id="service"
                  defaultValue="Vidange"
                  className="col-span-3"
                />
              </div>
              <Button type="submit">Planifier</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {columns.map((column) => (
          <Card
            key={column}
            className='flex flex-col h-full min-h-[300px]'
            onDrop={(e) => handleDrop(e, column)}
            onDragOver={handleDragOver}
          >
            <CardHeader>
              <CardTitle className="font-headline text-lg flex justify-between items-center">
                {columnTitles[column]}
                <span className="text-sm font-normal bg-muted text-muted-foreground rounded-full px-2 py-0.5">
                  {getAppointmentsByStatus(column).length}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 space-y-3 p-2">
              {getAppointmentsByStatus(column).map((app, index) => (
                <div
                  key={app.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, app.id)}
                  className='p-3 border rounded-lg bg-card text-card-foreground shadow-sm cursor-grab'
                >
                  <div className="flex items-start justify-between">
                      <div>
                          <p className="font-semibold text-sm leading-tight">
                              {app.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                              {app.vehicleId}
                          </p>
                      </div>
                      <Avatar className="h-8 w-8">
                          <AvatarFallback>{app.customerId.charAt(0)}</AvatarFallback>
                      </Avatar>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                      {format(new Date(app.startTime.seconds * 1000), "d MMM, h:mm a")}
                  </p>
                </div>
              ))}
              {getAppointmentsByStatus(column).length === 0 && !isLoading && (
                  <div className="text-center text-sm text-muted-foreground py-4">
                      Aucun rendez-vous
                  </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
