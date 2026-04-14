'use client';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { PlusCircle, MoreHorizontal, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import type { Vehicle } from '@/lib/data-types';

const statusVariantMap: { [key: string]: 'secondary' | 'default' | 'destructive' | 'outline' } = {
  Ready: 'secondary',
  'In Service': 'default',
  'Needs Attention': 'destructive',
  'Maintenance Due': 'outline',
};

function VehiclesList() {
  const firestore = useFirestore();
  const { user } = useUser();

  const vehiclesQuery = useMemoFirebase(
    () => (firestore && user ? query(collection(firestore, `customers/${user.uid}/vehicles`)) : null),
    [firestore, user]
  );
  const { data: vehicles, isLoading } = useCollection<Vehicle>(vehiclesQuery);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Vehicle</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Last Service</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {vehicles?.map((vehicle) => (
          <TableRow key={vehicle.id}>
            <TableCell className="font-medium">
              <Link
                href={`/dashboard/vehicles/${vehicle.id}`}
                className="hover:underline"
              >
                {vehicle.make} {vehicle.model} ({vehicle.year})
              </Link>
            </TableCell>
            <TableCell>{vehicle.owner}</TableCell>
            <TableCell>{vehicle.lastService}</TableCell>
            <TableCell>
              <Badge variant={statusVariantMap[vehicle.status] || 'default'}>
                {vehicle.status}
              </Badge>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/vehicles/${vehicle.id}`}>
                      View Details
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Edit Vehicle</DropdownMenuItem>
                  <DropdownMenuItem>Create Appointment</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function VehiclesPage() {
  return (
    <div className="container mx-auto p-0">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold font-headline">Vehicles</h1>
          <p className="text-muted-foreground">
            Manage all vehicles in your system.
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Vehicle
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Vehicle Fleet</CardTitle>
          <CardDescription>
            A list of all customer vehicles registered in the garage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VehiclesList />
        </CardContent>
      </Card>
    </div>
  );
}
