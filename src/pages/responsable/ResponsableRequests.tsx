import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { mockRequests } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Check, X, ClipboardList, Eye } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MembershipRequest } from "@/types/club";

const ResponsableRequests = () => {
  const [requests, setRequests] = useState(mockRequests.filter((r) => r.clubId === "1"));
  const [confirmAction, setConfirmAction] = useState<{ id: string; action: "accept" | "reject" } | null>(null);
  const [viewRequest, setViewRequest] = useState<MembershipRequest | null>(null);

  const handleAction = () => {
    if (!confirmAction) return;
    setRequests(requests.map((r) =>
      r.id === confirmAction.id ? { ...r, status: confirmAction.action === "accept" ? "accepted" as const : "rejected" as const } : r
    ));
    toast.success(confirmAction.action === "accept" ? "Demande acceptée avec succès." : "Demande refusée.");
    setConfirmAction(null);
  };

  const pending = requests.filter((r) => r.status === "pending");
  const processed = requests.filter((r) => r.status !== "pending");

  return (
    <DashboardLayout title="Demandes d'adhésion" description={`${pending.length} en attente de traitement`}>
      {requests.length > 0 ? (
        <div className="space-y-6">
          {pending.length > 0 && (
            <div>
              <h2 className="font-heading font-semibold text-foreground mb-3">En attente ({pending.length})</h2>
              <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/40">
                        <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider p-4">Étudiant</th>
                        <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider p-4">Email</th>
                        <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider p-4">Date</th>
                        <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pending.map((req) => (
                        <tr key={req.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                          <td className="p-4 font-medium text-sm text-foreground">{req.studentName}</td>
                          <td className="p-4 text-sm text-muted-foreground">{req.studentEmail}</td>
                          <td className="p-4 text-sm text-muted-foreground">{new Date(req.requestedAt).toLocaleDateString("fr-FR")}</td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button size="sm" variant="ghost" onClick={() => setViewRequest(req)} className="gap-1"><Eye className="w-3.5 h-3.5" /></Button>
                              <Button size="sm" variant="accent" onClick={() => setConfirmAction({ id: req.id, action: "accept" })} className="gap-1"><Check className="w-3.5 h-3.5" />Accepter</Button>
                              <Button size="sm" variant="outline" onClick={() => setConfirmAction({ id: req.id, action: "reject" })} className="gap-1 text-destructive hover:text-destructive"><X className="w-3.5 h-3.5" />Refuser</Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {processed.length > 0 && (
            <div>
              <h2 className="font-heading font-semibold text-foreground mb-3">Traitées ({processed.length})</h2>
              <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/40">
                        <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider p-4">Étudiant</th>
                        <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider p-4">Email</th>
                        <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider p-4">Date</th>
                        <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider p-4">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {processed.map((req) => (
                        <tr key={req.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                          <td className="p-4 font-medium text-sm text-foreground">{req.studentName}</td>
                          <td className="p-4 text-sm text-muted-foreground">{req.studentEmail}</td>
                          <td className="p-4 text-sm text-muted-foreground">{new Date(req.requestedAt).toLocaleDateString("fr-FR")}</td>
                          <td className="p-4">
                            <Badge variant={req.status === "accepted" ? "success" : "destructive"}>
                              {req.status === "accepted" ? "Acceptée" : "Refusée"}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <EmptyState
          icon={<ClipboardList className="w-6 h-6 text-muted-foreground" />}
          title="Aucune demande"
          description="Aucune demande d'adhésion reçue pour le moment."
        />
      )}

      <ConfirmDialog
        open={!!confirmAction}
        onOpenChange={() => setConfirmAction(null)}
        title={confirmAction?.action === "accept" ? "Accepter la demande ?" : "Refuser la demande ?"}
        description={confirmAction?.action === "accept" ? "L'étudiant sera ajouté comme membre du club." : "L'étudiant sera notifié du refus de sa demande."}
        confirmLabel={confirmAction?.action === "accept" ? "Accepter" : "Refuser"}
        variant={confirmAction?.action === "reject" ? "destructive" : "default"}
        onConfirm={handleAction}
      />

      <Dialog open={!!viewRequest} onOpenChange={() => setViewRequest(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">Détail de la demande</DialogTitle>
          </DialogHeader>
          {viewRequest && (
            <div className="space-y-3 mt-2">
              <div><span className="text-xs text-muted-foreground uppercase tracking-wider">Étudiant</span><p className="text-sm font-medium text-foreground">{viewRequest.studentName}</p></div>
              <div><span className="text-xs text-muted-foreground uppercase tracking-wider">Email</span><p className="text-sm text-foreground">{viewRequest.studentEmail}</p></div>
              <div><span className="text-xs text-muted-foreground uppercase tracking-wider">Date</span><p className="text-sm text-foreground">{new Date(viewRequest.requestedAt).toLocaleDateString("fr-FR")}</p></div>
              <div><span className="text-xs text-muted-foreground uppercase tracking-wider">Motivation</span><p className="text-sm text-foreground">{viewRequest.motivation}</p></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default ResponsableRequests;
