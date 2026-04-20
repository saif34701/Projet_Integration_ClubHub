import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/stat-card";
import { mockClubs, mockRequests, mockAnnouncements, mockMeetings, mockMembers, mockEvents } from "@/data/mockData";
import { Users, ClipboardList, Megaphone, CalendarDays, Video } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const ResponsableDashboard = () => {
  const club = mockClubs.find((c) => c.responsableId === "user-1")!;
  const clubRequests = mockRequests.filter((r) => r.clubId === club.id);
  const pendingRequests = clubRequests.filter((r) => r.status === "pending");
  const clubAnnouncements = mockAnnouncements.filter((a) => a.clubId === club.id);
  const clubMeetings = mockMeetings.filter((m) => m.clubId === club.id);
  const clubEvents = mockEvents.filter((e) => e.clubId === club.id);
  const clubMembers = mockMembers.filter((m) => m.clubId === club.id);

  return (
    <DashboardLayout title={club.name} description="Espace responsable de club">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Membres actifs" value={clubMembers.length} icon={<Users className="w-5 h-5" />} />
        <StatCard label="Demandes en attente" value={pendingRequests.length} icon={<ClipboardList className="w-5 h-5" />} trend={pendingRequests.length > 0 ? `${pendingRequests.length} à traiter` : undefined} />
        <StatCard label="Annonces publiées" value={clubAnnouncements.length} icon={<Megaphone className="w-5 h-5" />} />
        <StatCard label="Événements à venir" value={clubEvents.length} icon={<CalendarDays className="w-5 h-5" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending requests */}
        <div className="bg-card rounded-xl border border-border shadow-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold text-foreground">Demandes récentes</h2>
            <Link to="/responsable/demandes" className="text-xs text-accent hover:underline">Tout voir</Link>
          </div>
          <div className="space-y-3">
            {pendingRequests.slice(0, 4).map((req) => (
              <div key={req.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/40">
                <div>
                  <p className="text-sm font-medium text-foreground">{req.studentName}</p>
                  <p className="text-xs text-muted-foreground">{req.studentEmail}</p>
                </div>
                <Badge variant="warning">En attente</Badge>
              </div>
            ))}
            {pendingRequests.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Aucune demande en attente.</p>}
          </div>
        </div>

        {/* Upcoming meetings */}
        <div className="bg-card rounded-xl border border-border shadow-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold text-foreground">Prochaines réunions</h2>
            <Link to="/responsable/reunions" className="text-xs text-accent hover:underline">Tout voir</Link>
          </div>
          <div className="space-y-3">
            {clubMeetings.slice(0, 3).map((m) => (
              <div key={m.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/40">
                <div>
                  <p className="text-sm font-medium text-foreground">{m.title}</p>
                  <p className="text-xs text-muted-foreground">{new Date(m.date).toLocaleDateString("fr-FR")} · {m.time}</p>
                </div>
                <Video className="w-4 h-4 text-accent" />
              </div>
            ))}
            {clubMeetings.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Aucune réunion planifiée.</p>}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ResponsableDashboard;
