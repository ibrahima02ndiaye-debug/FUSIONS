import type { Timestamp } from "firebase/firestore";

export type Vehicle = {
    id: string;
    customerId: string;
    make: string;
    model: string;
    year: number;
    vin: string;
    owner: string;
    lastService: string;
    status: 'In Service' | 'Needs Attention' | 'Ready' | 'Maintenance Due';
    imageUrl: string;
    imageHint: string;
};

export type AppointmentStatus = 'Scheduled' | 'In Progress' | 'QC' | 'Done';

export type Appointment = {
    id: string;
    customerId: string;
    vehicleId: string;
    description: string;
    startTime: Timestamp;
    endTime: Timestamp;
    status: AppointmentStatus;
};

export type Part = {
    id: string;
    name: string;
    description: string;
    partNumber: string;
    quantity: number;
    cost: number;
    lowStockThreshold: number;
};

export type Invoice = {
    id: string;
    customerId: string;
    appointmentId: string;
    invoiceDate: Timestamp;
    dueDate: Timestamp;
    totalAmount: number;
    status: 'Issued' | 'Paid' | 'Overdue';
};

export type Customer = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
}
