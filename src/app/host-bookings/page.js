import ProtectedRoute from "@/components/ProtectedRoute";
import HostBookings from "@/components/HostBookings";

export const metadata = {
  title: "Booking Requests | StudioSpace",
};

export default function HostBookingsPage() {
  return (
    <ProtectedRoute>
      <HostBookings />
    </ProtectedRoute>
  );
}