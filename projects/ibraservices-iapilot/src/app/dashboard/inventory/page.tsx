'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PlusCircle, Search, AlertCircle, Loader2, ShieldAlert } from "lucide-react"
import { useCollection, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import { collection, query } from 'firebase/firestore';
import type { Part } from "@/lib/data-types";
import { useMemo, useState } from "react";

function isLowStock(part: Part) {
  return part.quantity <= part.lowStockThreshold;
}

export default function InventoryPage() {
  const firestore = useFirestore();
  // For this demo, we'll simulate an admin check.
  // In a real app, you would have a proper role management system.
  // We are checking against a non-real UID to simulate a non-admin user.
  const [isUserAdmin] = useState(false);

  const partsQuery = useMemoFirebase(() => (firestore && isUserAdmin ? query(collection(firestore, 'parts')) : null), [firestore, isUserAdmin]);
  const { data: inventory, isLoading } = useCollection<Part>(partsQuery);

  return (
    <div className="container mx-auto p-0">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold font-headline">Inventaire</h1>
          <p className="text-muted-foreground">Gérez vos pièces et fournitures.</p>
        </div>
        <Button disabled={!isUserAdmin}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter une pièce
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="font-headline">Liste des pièces</CardTitle>
              {isUserAdmin && <CardDescription>{inventory?.length || 0} articles en inventaire.</CardDescription>}
            </div>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Rechercher des pièces..." className="pl-8" disabled={!isUserAdmin} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : !isUserAdmin ? (
             <div className="flex flex-col items-center justify-center h-64 text-center">
                <ShieldAlert className="h-12 w-12 text-destructive mb-4" />
                <h3 className="text-xl font-semibold">Accès non autorisé</h3>
                <p className="text-muted-foreground">Seuls les administrateurs peuvent consulter l'inventaire.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom de la pièce</TableHead>
                  <TableHead>N° de pièce</TableHead>
                  <TableHead className="text-right">En stock</TableHead>
                  <TableHead className="text-right">Prix</TableHead>
                  <TableHead className="text-center">Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventory?.map((part) => (
                  <TableRow key={part.id}>
                    <TableCell className="font-medium">{part.name}</TableCell>
                    <TableCell>{part.partNumber}</TableCell>
                    <TableCell className="text-right">{part.quantity}</TableCell>
                    <TableCell className="text-right">${part.cost.toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                      {isLowStock(part) ? (
                        <Badge variant="destructive" className="flex items-center justify-center gap-1">
                          <AlertCircle className="h-3 w-3" /> Stock faible
                        </Badge>
                      ) : (
                        <Badge variant="secondary">En stock</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
