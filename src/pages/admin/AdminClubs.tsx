import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { mockClubs } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Building2, Check, Ban, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Club } from "@/types/club";

const AdminClubs = () => {
  const [clubs, setClubs] = useState<Club[]>(mockClubs);
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ id: string; action: "activate" | "disable" } | null>(null);

  const filtered = clubs.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  const handleAction = () => {
    if (!confirmAction) return;
    setClubs(clubs.map((c) =>
      c.id === confirmAction.id ? { ...c, status: confirmAction.action === "activate" ? "active" as const : "disabled" as const } : c
    ));
    toast.success(confirmAction.action === "activate" ? "Club activé." : "Club désactivé.");
    setConfirmAction(null);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Club créé avec succès. En attente de validation.");
    setCreateOpen(false);
  };

  return (
    <DashboardLayout
      title="Gestion des clubs"
      description={`${clubs.length} clubs sur la plateforme`}
      actions={
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button variant="accent" size="sm" className="gap-2"><Plus className="w-4 h-4" />Créer un club</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-heading">Nouveau club</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-2">
              <div className="space-y-1.5">
                <Label>Nom du club</Label>
                <Input placeholder="Ex : Club Intelligence Artificielle" required />
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea placeholder="Description du club…" rows={3} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Catégorie</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technologie">Technologie</SelectItem>
                      <SelectItem value="Culture">Culture</SelectItem>
                      <SelectItem value="Sport">Sport</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Environnement">Environnement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Année de fondation</Label>
                  <Input type="number" placeholder="2026" required />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Responsable (email)</Label>
                <Input type="email" placeholder="responsable@isetrades.tn" />
              </div>
              <Button type="submit" variant="accent" className="w-full gap-2">
                <Building2 className="w-4 h-4" />Créer le club
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      <div className="mb-5">
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Rechercher un club…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider p-4">Club</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider p-4">Catégorie</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider p-4">Responsable</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider p-4">Membres</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider p-4">Statut</th>
                  <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((club) => (
                  <tr key={club.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="p-4 font-medium text-sm text-foreground">{club.name}</td>
                    <td className="p-4 text-sm text-muted-foreground">{club.category}</td>
                    <td className="p-4 text-sm text-muted-foreground">{club.responsableName || "—"}</td>
                    <td className="p-4 text-sm text-muted-foreground">{club.membersCount}</td>
                    <td className="p-4">
                      <Badge variant={club.status === "active" ? "success" : club.status === "pending" ? "warning" : "destructive"}>
                        {club.status === "active" ? "Actif" : club.status === "pending" ? "En attente" : "Désactivé"}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {(club.status === "pending" || club.status === "disabled") && (
                          <Button size="sm" variant="accent" onClick={() => setConfirmAction({ id: club.id, action: "activate" })} className="gap-1">
                            <Check className="w-3.5 h-3.5" />Activer
                          </Button>
                        )}
                        {club.status === "active" && (
                          <Button size="sm" variant="outline" onClick={() => setConfirmAction({ id: club.id, action: "disable" })} className="gap-1 text-destructive hover:text-destructive">
                            <Ban className="w-3.5 h-3.5" />Désactiver
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={<Building2 className="w-6 h-6 text-muted-foreground" />}
          title="Aucun club trouvé"
          description="Modifiez votre recherche."
        />
      )}

      <ConfirmDialog
        open={!!confirmAction}
        onOpenChange={() => setConfirmAction(null)}
        title={confirmAction?.action === "activate" ? "Activer ce club ?" : "Désactiver ce club ?"}
        description={confirmAction?.action === "activate" ? "Le club sera visible et accessible aux étudiants." : "Le club ne sera plus visible sur la plateforme."}
        confirmLabel={confirmAction?.action === "activate" ? "Activer" : "Désactiver"}
        variant={confirmAction?.action === "disable" ? "destructive" : "default"}
        onConfirm={handleAction}
      />
    </DashboardLayout>
  );
};

export default AdminClubs;
