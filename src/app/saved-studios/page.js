import ProtectedRoute from "@/components/ProtectedRoute";
import SavedStudios from "@/components/SavedStudios";

export const metadata = {
  title: "Saved Studios",
};

export default function SavedStudiosPage() {
  return (
    <ProtectedRoute>
      <SavedStudios />
    </ProtectedRoute>
  );
}