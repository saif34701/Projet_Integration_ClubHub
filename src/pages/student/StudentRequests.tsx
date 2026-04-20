import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { mockRequests } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ClipboardList } from "lucide-react";

const StudentRequests = () => {
  const myRequests = mockRequests.filter((r) => r.studentId === "user-10");

  return (
    <DashboardLayout title="Mes demandes d'adhésion" description="Suivez le statut de vos demandes">
      {myRequests.length > 0 ? (
        <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider p-4">Club</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider p-4">Date</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider p-4">Motivation</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider p-4">Statut</th>
                </tr>
              </thead>
              <tbody>
                {myRequests.map((req) => (
                  <tr key={req.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="p-4 font-medium text-sm text-foreground">{req.clubName}</td>
                    <td className="p-4 text-sm text-muted-foreground">{new Date(req.requestedAt).toLocaleDateString("fr-FR")}</td>
                    <td className="p-4 text-sm text-muted-foreground max-w-xs truncate">{req.motivation}</td>
                    <td className="p-4">
                      <Badge variant={req.status === "pending" ? "warning" : req.status === "accepted" ? "success" : "destructive"}>
                        {req.status === "pending" ? "En attente" : req.status === "accepted" ? "Acceptée" : "Refusée"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={<ClipboardList className="w-6 h-6 text-muted-foreground" />}
          title="Aucune demande"
          description="Vous n'avez pas encore envoyé de demande d'adhésion. Explorez les clubs pour en rejoindre un !"
        />
      )}
    </DashboardLayout>
  );
};

export default StudentRequests;
