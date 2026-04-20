import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { mockMeetings, mockClubs } from "@/data/mockData";
import { MeetingCard } from "@/components/meetings/MeetingCard";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Video } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const ResponsableMeetings = () => {
  const club = mockClubs.find((c) => c.responsableId === "user-1")!;
  const meetings = mockMeetings.filter((m) => m.clubId === club.id);
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Réunion créée avec succès.");
    setOpen(false);
  };

  return (
    <DashboardLayout
      title="Réunions"
      description="Planifiez et gérez les réunions de votre club"
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="accent" size="sm" className="gap-2"><Plus className="w-4 h-4" />Créer une réunion</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-heading">Nouvelle réunion</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div className="space-y-1.5">
                <Label>Titre</Label>
                <Input placeholder="Ex : Point d'avancement projet" required />
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea placeholder="Ordre du jour…" rows={3} required />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label>Date</Label>
                  <Input type="date" required />
                </div>
                <div className="space-y-1.5">
                  <Label>Heure</Label>
                  <Input type="time" required />
                </div>
                <div className="space-y-1.5">
                  <Label>Durée</Label>
                  <Select defaultValue="1h">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30min">30 min</SelectItem>
                      <SelectItem value="1h">1h</SelectItem>
                      <SelectItem value="1h30">1h30</SelectItem>
                      <SelectItem value="2h">2h</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Lien de réunion</Label>
                <Input type="url" placeholder="https://meet.google.com/..." />
              </div>
              <Button type="submit" variant="accent" className="w-full gap-2">
                <Video className="w-4 h-4" />Créer la réunion
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      {meetings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl">
          {meetings.map((m, i) => (
            <MeetingCard key={m.id} meeting={m} index={i} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Video className="w-6 h-6 text-muted-foreground" />}
          title="Aucune réunion"
          description="Planifiez votre première réunion."
        />
      )}
    </DashboardLayout>
  );
};

export default ResponsableMeetings;
