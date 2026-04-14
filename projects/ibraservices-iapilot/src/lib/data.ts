import type { Timestamp } from "firebase/firestore";

export type Vehicle = {
  id: string;
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

export const vehicles: Vehicle[] = [
  { id: '1', make: 'Honda', model: 'Civic', year: 2021, vin: '1HGCV1...', owner: 'Alice Johnson', lastService: '2023-10-15', status: 'Ready', imageUrl: 'https://picsum.photos/seed/vehicle1/400/300', imageHint: 'blue car' },
  { id: '2', make: 'Ford', model: 'F-150', year: 2020, vin: '1FTFW1...', owner: 'Bob Williams', lastService: '2023-11-01', status: 'In Service', imageUrl: 'https://picsum.photos/seed/vehicle4/400/300', imageHint: 'black truck' },
  { id: '3', make: 'Toyota', model: 'RAV4', year: 2022, vin: '2T3H1R...', owner: 'Charlie Brown', lastService: '2023-09-20', status: 'Needs Attention', imageUrl: 'https://picsum.photos/seed/vehicle3/400/300', imageHint: 'silver suv' },
  { id: '4', make: 'Tesla', model: 'Model 3', year: 2023, vin: '5YJ3E1...', owner: 'Diana Prince', lastService: '2024-01-05', status: 'Maintenance Due', imageUrl: 'https://picsum.photos/seed/vehicle2/400/300', imageHint: 'red car' },
];

export type Appointment = {
  id: string;
  customerId: string;
  vehicleId: string;
  description: string;
  startTime: Timestamp;
  endTime: Timestamp;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
};

export const appointments: Omit<Appointment, 'startTime' | 'endTime'>[] = [
  { id: '1', customerId: 'Charlie Brown', vehicleId: 'Toyota RAV4', description: 'Oil Change', status: 'Scheduled' },
  { id: '2', customerId: 'Bob Williams', vehicleId: 'Ford F-150', description: 'Brake Inspection', status: 'In Progress' },
  { id: '3', customerId: 'Eve Adams', vehicleId: 'Nissan Leaf', description: 'Tire Rotation', status: 'Scheduled' },
];

export type InventoryPart = {
  id: string;
  name: string;
  sku: string;
  stock: number;
  lowStockThreshold: number;
  price: number;
};

export const inventory: InventoryPart[] = [
  { id: '1', name: 'Oil Filter', sku: 'OF-001', stock: 15, lowStockThreshold: 10, price: 12.99 },
  { id: '2', name: 'Air Filter', sku: 'AF-002', stock: 8, lowStockThreshold: 10, price: 22.50 },
  { id: '3', name: 'Brake Pads (Set)', sku: 'BP-003', stock: 25, lowStockThreshold: 15, price: 75.00 },
  { id: '4', name: 'Spark Plugs (4-pack)', sku: 'SP-004', stock: 5, lowStockThreshold: 5, price: 35.75 },
  { id: '5', name: 'Synthetic Oil (5L)', sku: 'SO-005', stock: 30, lowStockThreshold: 20, price: 45.99 },
];

export type Message = {
    id: string;
    sender: 'user' | 'support';
    text: string;
    timestamp: string;
    avatar: string;
}

export type ChatContact = {
    id: string;
    name: string;
    vehicle: string;
    avatar: string;
    lastMessage: string;
    lastMessageTime: string;
}

export const chatContacts: ChatContact[] = [
    { id: '1', name: 'Alice Johnson', vehicle: 'Honda Civic', avatar: 'https://picsum.photos/seed/avatar1/100/100', lastMessage: 'Okay, thank you!', lastMessageTime: '10:42 AM' },
    { id: '2', name: 'Bob Williams', vehicle: 'Ford F-150', avatar: 'https://picsum.photos/seed/avatar2/100/100', lastMessage: 'When can I pick it up?', lastMessageTime: '9:15 AM' },
    { id: '3', name: 'Charlie Brown', vehicle: 'Toyota RAV4', avatar: 'https://picsum.photos/seed/avatar3/100/100', lastMessage: 'I have another question about the invoice.', lastMessageTime: 'Yesterday' },
];

export const messageHistory: Record<string, Message[]> = {
    '1': [
        { id: 'm1', sender: 'user', text: 'Hi, just checking on the status of my Civic.', timestamp: '10:40 AM', avatar: 'https://picsum.photos/seed/avatar1/100/100'},
        { id: 'm2', sender: 'support', text: 'Hi Alice, it\'s all done. We\'re just finishing up the final checks.', timestamp: '10:41 AM', avatar: 'https://picsum.photos/seed/garage_avatar/100/100'},
        { id: 'm3', sender: 'user', text: 'Okay, thank you!', timestamp: '10:42 AM', avatar: 'https://picsum.photos/seed/avatar1/100/100'},
    ],
    '2': [
        { id: 'm4', sender: 'support', text: 'Hi Bob, your F-150 is ready for pickup.', timestamp: '9:14 AM', avatar: 'https://picsum.photos/seed/garage_avatar/100/100'},
        { id: 'm5', sender: 'user', text: 'When can I pick it up?', timestamp: '9:15 AM', avatar: 'https://picsum.photos/seed/avatar2/100/100'},
    ],
    '3': [],
}
