"use client";
import { useState, useEffect } from "react";
import { mockCompanies, mockOffers, mockUsers } from "@/lib/mockData";
import { Company, Offer, User, PickupLog } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
const formatDate = (date: Date) => {
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";

// Extend the Session type to include 'id'
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null;
    };
  }
}
import { redirect } from "next/navigation";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [pickupLogs, setPickupLogs] = useState<PickupLog[]>([]);
  const [selectedOfferId, setSelectedOfferId] = useState<string>("");
  const [pickupQuantity, setPickupQuantity] = useState<number>(0);
  const [date, setDate] = useState<Date | undefined>(new Date());

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      const userRole = session?.user?.role;
      if (
        !["doctor", "admin", "driver", "supervisor"].includes(userRole || "")
      ) {
        redirect("/unauthorized"); // Redirect if the role is not allowed
      }
      // Simulate user login
      const loggedInUser = mockUsers.find((u) => u.id === session.user?.id);
      setUser(loggedInUser || null);

      // Redirect if the user role is not allowed
      if (!loggedInUser) {
        redirect("/unauthorized"); // Redirect to an unauthorized page
      }
    }
  }, [status, session]);

  if (status === "loading") return <p>Loading...</p>;
  if (!session) redirect("/login");

  const handlePickupSubmit = () => {
    if (!user || !selectedOfferId || !pickupQuantity || !date) return;

    const selectedOffer = mockOffers.find(
      (offer) => offer.id === selectedOfferId
    );
    if (!selectedOffer) return;

    const newPickup: PickupLog = {
      id: crypto.randomUUID(),
      userId: user.id,
      userName: user.name,
      offerId: selectedOffer.id,
      companyId: selectedOffer.companyId,
      companyName: selectedOffer.companyName,
      medicineName: selectedOffer.medicineName,
      quantity: pickupQuantity,
      pickupTime: date,
    };

    setPickupLogs((prev) => [...prev, newPickup]);
    setSelectedOfferId("");
    setPickupQuantity(0);
    setDate(new Date());
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Medical Reporting Dashboard</h1>
      {user && (
        <p className="mb-4">
          Logged in as: <strong>{user.name}</strong> ({user.role})
        </p>
      )}

      {user?.role === "doctor" && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Record Medicine Pickup</CardTitle>
            <CardDescription>
              Enter the details of the medicine pickup.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Select
                value={selectedOfferId}
                onValueChange={setSelectedOfferId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an offer" />
                </SelectTrigger>
                <SelectContent>
                  {mockOffers.map((offer) => (
                    <SelectItem key={offer.id} value={offer.id}>
                      {offer.companyName} - {offer.medicineName} (
                      {offer.quantity} available)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="mb-4">
              <Input
                type="number"
                placeholder="Quantity"
                value={pickupQuantity}
                onChange={(e) => setPickupQuantity(parseInt(e.target.value))}
              />
            </div>
            <div className="mb-4">
              <Calendar mode="single" selected={date} onSelect={setDate} />
            </div>
            <Button onClick={handlePickupSubmit}>Record Pickup</Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Pickup Logs</CardTitle>
          <CardDescription>Recent medicine pickups.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Worker</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Medicine</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pickupLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.userName}</TableCell>
                  <TableCell>{log.companyName}</TableCell>
                  <TableCell>{formatDate(log.pickupTime)}</TableCell>
                  <TableCell>{log.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
