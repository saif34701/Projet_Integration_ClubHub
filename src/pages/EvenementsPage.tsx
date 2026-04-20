import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EventCard } from "@/components/events/EventCard";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { mockEvents, mockClubs } from "@/data/mockData";
import { CalendarDays } from "lucide-react";

const EvenementsPage = () => {
  const sortedEvents = [...mockEvents].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto">
          <PageHeader
            overline="Agenda"
            title="Événements & Réunions"
            description="Consultez les prochains événements et réunions organisés par les clubs."
          />
          {sortedEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {sortedEvents.map((e, i) => (
                <EventCard
                  key={e.id}
                  event={e}
                  clubName={mockClubs.find((c) => c.id === e.clubId)?.name}
                  index={i}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<CalendarDays className="w-6 h-6 text-muted-foreground" />}
              title="Aucun événement"
              description="Pas d'événement à afficher pour le moment."
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EvenementsPage;
