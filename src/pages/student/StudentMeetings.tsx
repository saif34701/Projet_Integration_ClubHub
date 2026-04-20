import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MeetingCard } from "@/components/meetings/MeetingCard";
import { mockMeetings, mockClubs } from "@/data/mockData";
import { EmptyState } from "@/components/ui/empty-state";
import { Video } from "lucide-react";

const StudentMeetings = () => {
  const upcomingMeetings = mockMeetings.filter((m) => new Date(m.date) >= new Date());

  return (
    <DashboardLayout title="Réunions à venir" description="Réunions planifiées par vos clubs">
      {upcomingMeetings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl">
          {upcomingMeetings.map((m, i) => (
            <MeetingCard key={m.id} meeting={m} clubName={mockClubs.find((c) => c.id === m.clubId)?.name} index={i} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Video className="w-6 h-6 text-muted-foreground" />}
          title="Aucune réunion planifiée"
          description="Pas de réunion à venir pour le moment."
        />
      )}
    </DashboardLayout>
  );
};

export default StudentMeetings;
