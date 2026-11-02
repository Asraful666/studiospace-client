import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardOverview from "@/components/DashboardOverview";

export const metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardOverview />
    </ProtectedRoute>
  );
}