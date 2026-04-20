import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/stat-card";
import { mockClubs, mockRequests, mockAnnouncements, mockEvents, mockNotifications } from "@/data/mockData";
import { ClipboardList, Megaphone, CalendarDays, Bell, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnnouncementCard } from "@/components/announcements/AnnouncementCard";

const StudentDashboard = () => {
  const myRequests = mockRequests.filter((r) => r.studentId === "user-10");
  const pendingCount = myRequests.filter((r) => r.status === "pending").length;
  const unreadNotifs = mockNotifications.filter((n) => !n.read && n.userId === "user-10").length;

  return (
    <DashboardLayout title="Tableau de bord" description="Bienvenue dans votre espace étudiant">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Mes clubs" value={2} icon={<Users className="w-5 h-5" />} />
        <StatCard label="Demandes en attente" value={pendingCount} icon={<ClipboardList className="w-5 h-5" />} />
        <StatCard label="Événements à venir" value={mockEvents.length} icon={<CalendarDays className="w-5 h-5" />} />
        <StatCard label="Notifications" value={unreadNotifs} icon={<Bell className="w-5 h-5" />} trend={unreadNotifs > 0 ? `${unreadNotifs} non lues` : undefined} />
      </div>

      {/* Quick sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent requests */}
        <div className="bg-card rounded-xl border border-border shadow-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold text-foreground">Mes demandes récentes</h2>
            <Link to="/etudiant/demandes" className="text-xs text-accent hover:underline">Tout voir</Link>
          </div>
          <div className="space-y-3">
            {myRequests.slice(0, 3).map((req) => (
              <div key={req.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/40">
                <div>
                  <p className="text-sm font-medium text-foreground">{req.clubName}</p>
                  <p className="text-xs text-muted-foreground">{new Date(req.requestedAt).toLocaleDateString("fr-FR")}</p>
                </div>
                <Badge variant={req.status === "pending" ? "warning" : req.status === "accepted" ? "success" : "destructive"}>
                  {req.status === "pending" ? "En attente" : req.status === "accepted" ? "Acceptée" : "Refusée"}
                </Badge>
              </div>
            ))}
            {myRequests.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Aucune demande pour le moment.</p>}
          </div>
        </div>

        {/* Latest announcements */}
        <div className="bg-card rounded-xl border border-border shadow-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold text-foreground">Dernières annonces</h2>
            <Link to="/annonces" className="text-xs text-accent hover:underline">Tout voir</Link>
          </div>
          <div className="space-y-3">
            {mockAnnouncements.filter((a) => a.isPublic).slice(0, 3).map((a) => (
              <div key={a.id} className="p-3 rounded-lg bg-muted/40">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="default">{mockClubs.find((c) => c.id === a.clubId)?.name}</Badge>
                  <span className="text-xs text-muted-foreground">{new Date(a.createdAt).toLocaleDateString("fr-FR")}</span>
                </div>
                <p className="text-sm font-medium text-foreground">{a.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
