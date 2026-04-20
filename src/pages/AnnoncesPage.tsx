import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementCard } from "@/components/announcements/AnnouncementCard";
import { PageHeader } from "@/components/ui/page-header";
import { mockAnnouncements, mockClubs } from "@/data/mockData";

const AnnoncesPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto">
          <PageHeader
            overline="Actualités"
            title="Annonces"
            description="Restez informé des dernières nouvelles et activités des clubs de l'ISET Radès."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {mockAnnouncements.map((a, i) => (
              <AnnouncementCard
                key={a.id}
                announcement={a}
                clubName={mockClubs.find((c) => c.id === a.clubId)?.name}
                index={i}
              />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AnnoncesPage;
