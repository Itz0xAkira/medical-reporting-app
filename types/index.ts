export interface Company {
  id: string;
  name: string;
  location: string;
}

export interface Offer {
  id: string;
  companyId: string;
  companyName: string;
  medicineName: string;
  quantity: number;
  price: number;
  expiryDate: Date;
}

export interface User {
  id: string;
  name: string;
  role: "doctor" | "admin" | "driver" | "supervisor"; // Updated roles
  email?: string;
  password?: string; // Optional for mock data
}

export interface PickupLog {
  id: string;
  userId: string;
  userName: string;
  offerId: string;
  companyId: string;
  companyName: string;
  medicineName: string;
  quantity: number;
  pickupTime: Date;
}
