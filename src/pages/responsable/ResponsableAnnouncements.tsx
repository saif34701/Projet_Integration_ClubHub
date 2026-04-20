import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { mockAnnouncements, mockClubs } from "@/data/mockData";
import { AnnouncementCard } from "@/components/announcements/AnnouncementCard";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AICaptionGenerator } from "@/components/ai/AICaptionGenerator";
import { Plus, Megaphone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const ResponsableAnnouncements = () => {
  const club = mockClubs.find((c) => c.responsableId === "user-1")!;
  const announcements = mockAnnouncements.filter((a) => a.clubId === club.id);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [sendEmail, setSendEmail] = useState(false);

  const handleAIApply = (caption: string, hashtags: string[]) => {
    setContent(caption + "\n\n" + hashtags.join(" "));
    toast.success("Suggestion IA appliquée !");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Annonce publiée avec succès." + (sendEmail ? " Email envoyé aux membres." : ""));
    setOpen(false);
    setTitle("");
    setContent("");
  };

  return (
    <DashboardLayout
      title="Annonces"
      description={`${announcements.length} annonce${announcements.length > 1 ? "s" : ""} publiée${announcements.length > 1 ? "s" : ""}`}
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="accent" size="sm" className="gap-2"><Plus className="w-4 h-4" />Créer une annonce</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-heading">Nouvelle annonce</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-5 mt-2">
              <div className="space-y-1.5">
                <Label htmlFor="ann-title">Titre de l'annonce</Label>
                <Input id="ann-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex : Atelier Arduino pour débutants" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ann-content">Contenu</Label>
                <Textarea id="ann-content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Décrivez votre annonce…" rows={5} required />
              </div>

              <AICaptionGenerator onApply={handleAIApply} clubName={club.name} />

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40">
                <div>
                  <p className="text-sm font-medium text-foreground">Annonce publique</p>
                  <p className="text-xs text-muted-foreground">Visible par tous les visiteurs</p>
                </div>
                <Switch checked={isPublic} onCheckedChange={setIsPublic} />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40">
                <div>
                  <p className="text-sm font-medium text-foreground">Envoyer par email</p>
                  <p className="text-xs text-muted-foreground">Notifier les membres par email</p>
                </div>
                <Switch checked={sendEmail} onCheckedChange={setSendEmail} />
              </div>

              <Button type="submit" variant="accent" className="w-full gap-2">
                <Megaphone className="w-4 h-4" />Publier l'annonce
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      {announcements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl">
          {announcements.map((a, i) => (
            <AnnouncementCard key={a.id} announcement={a} index={i} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Megaphone className="w-6 h-6 text-muted-foreground" />}
          title="Aucune annonce"
          description="Créez votre première annonce pour informer les membres."
        />
      )}
    </DashboardLayout>
  );
};

export default ResponsableAnnouncements;
