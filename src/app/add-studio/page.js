import ProtectedRoute from "@/components/ProtectedRoute";
import AddStudioForm from "@/components/AddStudioForm";

export const metadata = {
  title: "Add Studio",
};

export default function AddStudioPage() {
  return (
    <ProtectedRoute>
      <AddStudioForm />
    </ProtectedRoute>
  );
}