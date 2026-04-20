import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/stat-card";
import { mockClubs, mockRequests } from "@/data/mockData";
import { Building2, Users, ClipboardList, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const AdminDashboard = () => {
  const activeClubs = mockClubs.filter((c) => c.status === "active");
  const pendingClubs = mockClubs.filter((c) => c.status === "pending");
  const totalMembers = mockClubs.reduce((sum, c) => sum + c.membersCount, 0);
  const pendingRequests = mockRequests.filter((r) => r.status === "pending");

  return (
    <DashboardLayout title="Administration" description="Vue d'ensemble de la plateforme">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Clubs actifs" value={activeClubs.length} icon={<Building2 className="w-5 h-5" />} />
        <StatCard label="Clubs en attente" value={pendingClubs.length} icon={<Shield className="w-5 h-5" />} trend={pendingClubs.length > 0 ? `${pendingClubs.length} à valider` : undefined} />
        <StatCard label="Total membres" value={totalMembers} icon={<Users className="w-5 h-5" />} />
        <StatCard label="Demandes en attente" value={pendingRequests.length} icon={<ClipboardList className="w-5 h-5" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border shadow-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold text-foreground">Clubs récents</h2>
            <Link to="/admin/clubs" className="text-xs text-accent hover:underline">Gérer</Link>
          </div>
          <div className="space-y-3">
            {mockClubs.slice(0, 5).map((club) => (
              <div key={club.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/40">
                <div>
                  <p className="text-sm font-medium text-foreground">{club.name}</p>
                  <p className="text-xs text-muted-foreground">{club.membersCount} membres · {club.responsableName}</p>
                </div>
                <Badge variant={club.status === "active" ? "success" : club.status === "pending" ? "warning" : "destructive"}>
                  {club.status === "active" ? "Actif" : club.status === "pending" ? "En attente" : "Désactivé"}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border shadow-card p-5">
          <h2 className="font-heading font-semibold text-foreground mb-4">Activité récente</h2>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-muted/40">
              <p className="text-sm text-foreground">Club Photographie demande la validation</p>
              <p className="text-xs text-muted-foreground">Il y a 2 jours</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/40">
              <p className="text-sm text-foreground">3 nouvelles demandes d'adhésion</p>
              <p className="text-xs text-muted-foreground">Il y a 3 jours</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/40">
              <p className="text-sm text-foreground">Club Robotique a publié une annonce</p>
              <p className="text-xs text-muted-foreground">Il y a 5 jours</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
