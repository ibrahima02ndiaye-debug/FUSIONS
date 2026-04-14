'use client';
import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search,
  PlusCircle,
  Mail,
  Phone,
  Car,
  Wrench,
  User,
  Loader2,
} from 'lucide-react';
import {
  useCollection,
  useFirestore,
  useMemoFirebase,
} from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { Customer, Vehicle, Appointment } from '@/lib/data-types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

function ClientList({
  clients,
  selectedClientId,
  onSelectClient,
  isLoading,
}: {
  clients: Customer[] | null;
  selectedClientId: string | null;
  onSelectClient: (id: string) => void;
  isLoading: boolean;
}) {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredClients = React.useMemo(() => {
    if (!clients) return [];
    return clients.filter(
      (client) =>
        client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [clients, searchTerm]);

  return (
    <div className="border-r bg-muted/20 h-full flex flex-col">
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher des clients..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {filteredClients.map((client) => (
              <button
                key={client.id}
                onClick={() => onSelectClient(client.id)}
                className={cn(
                  'flex items-center gap-3 p-2 rounded-lg w-full text-left transition-colors',
                  selectedClientId === client.id
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-accent/50'
                )}
              >
                <Avatar>
                  <AvatarFallback>
                    {client.firstName?.charAt(0)}
                    {client.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 truncate">
                  <p className="font-semibold">
                    {client.firstName} {client.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {client.email}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ClientDetails({ client }: { client: Customer | null }) {
    const firestore = useFirestore();

    const vehiclesQuery = useMemoFirebase(() => (
        client ? query(collection(firestore, `customers/${client.id}/vehicles`)) : null
    ), [firestore, client]);
    const { data: vehicles, isLoading: isLoadingVehicles } = useCollection<Vehicle>(vehiclesQuery);

    const appointmentsQuery = useMemoFirebase(() => (
        client ? query(collection(firestore, `customers/${client.id}/appointments`)) : null
    ), [firestore, client]);
    const { data: appointments, isLoading: isLoadingAppointments } = useCollection<Appointment>(appointmentsQuery);


  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <User className="h-16 w-16 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-semibold">
          Sélectionnez un client
        </h2>
        <p className="mt-1 text-muted-foreground">
          Choisissez un client dans la liste pour voir ses détails.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 overflow-auto">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-2xl">
                {client.firstName?.charAt(0)}
                {client.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl font-headline">
                {client.firstName} {client.lastName}
              </CardTitle>
              <CardDescription>{client.email}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Mail className="mr-2 h-4 w-4" /> Email
            </Button>
            <Button variant="outline" size="sm">
              <Phone className="mr-2 h-4 w-4" /> Appeler
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Téléphone</p>
              <p className="font-medium">{client.phone}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Adresse</p>
              <p className="font-medium">{client.address}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Car /> Véhicules
          </CardTitle>
        </CardHeader>
        <CardContent>
            {isLoadingVehicles ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                vehicles && vehicles.length > 0 ? (
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Véhicule</TableHead>
                            <TableHead>VIN</TableHead>
                            <TableHead>Statut</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {vehicles.map((v) => (
                            <TableRow key={v.id}>
                            <TableCell>{v.make} {v.model} ({v.year})</TableCell>
                            <TableCell>{v.vin}</TableCell>
                            <TableCell><Badge>{v.status}</Badge></TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                ) : <p className="text-muted-foreground text-sm">Aucun véhicule trouvé pour ce client.</p>
            )}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Wrench /> Historique des services
          </CardTitle>
        </CardHeader>
        <CardContent>
           {isLoadingAppointments ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                appointments && appointments.length > 0 ? (
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Service</TableHead>
                            <TableHead>Véhicule</TableHead>
                            <TableHead>Statut</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {appointments.map((a) => (
                            <TableRow key={a.id}>
                            <TableCell>{format(new Date(a.startTime.seconds * 1000), "d MMM, yyyy")}</TableCell>
                            <TableCell>{a.description}</TableCell>
                            <TableCell>{a.vehicleId}</TableCell>
                            <TableCell><Badge>{a.status}</Badge></TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                ) : <p className="text-muted-foreground text-sm">Aucun historique de service trouvé.</p>
            )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function ClientsPage() {
  const [selectedClientId, setSelectedClientId] = React.useState<string | null>(null);

  const firestore = useFirestore();
  const clientsQuery = useMemoFirebase(
    () => (firestore ? collection(firestore, 'customers') : null),
    [firestore]
  );
  const { data: clients, isLoading } = useCollection<Customer>(clientsQuery);

  // Auto-select first client if none is selected
  React.useEffect(() => {
    if (!selectedClientId && clients && clients.length > 0) {
      setSelectedClientId(clients[0].id);
    }
  }, [clients, selectedClientId]);

  const selectedClient = React.useMemo(() => {
    if (!selectedClientId || !clients) return null;
    return clients.find((c) => c.id === selectedClientId) || null;
  }, [clients, selectedClientId]);

  return (
    <div className="container mx-auto p-0">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold font-headline">Gestion des clients</h1>
          <p className="text-muted-foreground">
            Affichez et gérez les profils de vos clients.
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter un client
        </Button>
      </div>

      <Card className="h-[calc(100vh-12rem)]">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 h-full">
          <ClientList
            clients={clients}
            selectedClientId={selectedClientId}
            onSelectClient={setSelectedClientId}
            isLoading={isLoading}
          />
          <div className="md:col-span-2 lg:col-span-3 h-full">
            <ClientDetails client={selectedClient} />
          </div>
        </div>
      </Card>
    </div>
  );
}
