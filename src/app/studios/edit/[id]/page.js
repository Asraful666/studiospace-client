import { notFound } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import EditStudioForm from "@/components/EditStudioForm";

export const metadata = {
  title: "Edit Studio | StudioSpace",
};

export default async function EditStudioPage({ params }) {
  const { id } = await params;

  if (!/^[a-fA-F0-9]{24}$/.test(id)) {
    notFound();
  }

  return (
    <ProtectedRoute>
      <EditStudioForm studioId={id} />
    </ProtectedRoute>
  );
}