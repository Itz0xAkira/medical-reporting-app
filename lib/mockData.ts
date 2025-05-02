import { Company, Offer, User } from "../types";

export const mockCompanies: Company[] = [
  { id: "company1", name: "PharmaCorp", location: "New York" },
  { id: "company2", name: "MediPlus", location: "Los Angeles" },
  { id: "company3", name: "HealthSource", location: "Chicago" },
];

export const mockOffers: Offer[] = [
  {
    id: "offer1",
    companyId: "company1",
    companyName: "PharmaCorp",
    medicineName: "Amoxicillin",
    quantity: 100,
    price: 10.5,
    expiryDate: new Date(2024, 11, 30),
  },
  // Add more offers as needed
];

export const mockUsers: User[] = [
  { id: "user1", name: "Worker A1", role: "driver" },
  { id: "user3", name: "Team Lead B1", role: "admin" },
  // Add more users as needed
];
