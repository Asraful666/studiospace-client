import ProtectedRoute from "@/components/ProtectedRoute";
import MyBookings from "@/components/MyBookings";

export const metadata = {
  title: "My Bookings | StudioSpace",
};

export default function MyBookingsPage() {
  return (
    <ProtectedRoute>
      <MyBookings />
    </ProtectedRoute>
  );
}