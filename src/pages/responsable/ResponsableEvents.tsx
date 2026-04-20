import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { mockEvents, mockClubs } from "@/data/mockData";
import { EventCard } from "@/components/events/EventCard";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, CalendarDays } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const ResponsableEvents = () => {
  const club = mockClubs.find((c) => c.responsableId === "user-1")!;
  const events = mockEvents.filter((e) => e.clubId === club.id);
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Événement créé avec succès.");
    setOpen(false);
  };

  return (
    <DashboardLayout
      title="Événements"
      description="Gérez les événements de votre club"
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="accent" size="sm" className="gap-2"><Plus className="w-4 h-4" />Créer un événement</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-heading">Nouvel événement</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div className="space-y-1.5">
                <Label>Titre</Label>
                <Input placeholder="Ex : Journée portes ouvertes" required />
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea placeholder="Décrivez l'événement…" rows={3} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Date</Label>
                  <Input type="date" required />
                </div>
                <div className="space-y-1.5">
                  <Label>Heure</Label>
                  <Input type="time" required />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Lieu</Label>
                <Input placeholder="Ex : Amphithéâtre A" required />
              </div>
              <Button type="submit" variant="accent" className="w-full gap-2">
                <CalendarDays className="w-4 h-4" />Créer l'événement
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl">
          {events.map((e, i) => (
            <EventCard key={e.id} event={e} index={i} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<CalendarDays className="w-6 h-6 text-muted-foreground" />}
          title="Aucun événement"
          description="Créez votre premier événement."
        />
      )}
    </DashboardLayout>
  );
};

export default ResponsableEvents;
