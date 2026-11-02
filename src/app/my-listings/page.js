import ProtectedRoute from "@/components/ProtectedRoute";
import MyListings from "@/components/MyListings";

export const metadata = {
  title: "My Studio Listings",
};

export default function MyListingsPage() {
  return (
    <ProtectedRoute>
      <MyListings />
    </ProtectedRoute>
  );
}