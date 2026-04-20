import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { mockMembers } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import { Users, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const ResponsableMembers = () => {
  const [members, setMembers] = useState(mockMembers.filter((m) => m.clubId === "1"));
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = members.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = () => {
    if (!deleteId) return;
    setMembers(members.filter((m) => m.id !== deleteId));
    toast.success("Membre retiré du club.");
    setDeleteId(null);
  };

  return (
    <DashboardLayout title="Membres" description={`${members.length} membre${members.length > 1 ? "s" : ""} dans le club`}>
      <div className="mb-5">
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Rechercher un membre…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider p-4">Nom</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider p-4">Email</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider p-4">Rôle</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider p-4">Rejoint le</th>
                  <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((member) => (
                  <tr key={member.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="p-4 font-medium text-sm text-foreground">{member.name}</td>
                    <td className="p-4 text-sm text-muted-foreground">{member.email}</td>
                    <td className="p-4">
                      <Badge variant={member.role === "responsable" ? "info" : "default"}>
                        {member.role === "responsable" ? "Responsable" : "Membre"}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{new Date(member.joinedAt).toLocaleDateString("fr-FR")}</td>
                    <td className="p-4 text-right">
                      {member.role !== "responsable" && (
                        <Button size="sm" variant="ghost" onClick={() => setDeleteId(member.id)} className="text-destructive hover:text-destructive">
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={<Users className="w-6 h-6 text-muted-foreground" />}
          title="Aucun membre trouvé"
          description="Modifiez votre recherche ou invitez de nouveaux membres."
        />
      )}

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Retirer ce membre ?"
        description="Le membre sera retiré du club et devra refaire une demande s'il souhaite revenir."
        confirmLabel="Retirer"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </DashboardLayout>
  );
};

export default ResponsableMembers;
