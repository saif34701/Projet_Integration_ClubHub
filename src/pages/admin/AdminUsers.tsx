import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { EmptyState } from "@/components/ui/empty-state";
import { Users } from "lucide-react";

const AdminUsers = () => {
  return (
    <DashboardLayout title="Utilisateurs" description="Gestion des utilisateurs de la plateforme">
      <EmptyState
        icon={<Users className="w-6 h-6 text-muted-foreground" />}
        title="Module à venir"
        description="La gestion des utilisateurs sera disponible après l'activation du backend."
      />
    </DashboardLayout>
  );
};

export default AdminUsers;
