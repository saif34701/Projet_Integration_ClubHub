import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Megaphone, CalendarDays, ChevronRight, Zap, Shield, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClubCard } from "@/components/clubs/ClubCard";
import { AnnouncementCard } from "@/components/announcements/AnnouncementCard";
import { EventCard } from "@/components/events/EventCard";
import { mockClubs, mockAnnouncements, mockEvents } from "@/data/mockData";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import heroBg from "@/assets/hero-bg.jpg";

const stats = [
  { icon: Users, label: "Membres actifs", value: "290+" },
  { icon: Megaphone, label: "Clubs actifs", value: "6" },
  { icon: CalendarDays, label: "Événements / an", value: "50+" },
];

const howItWorks = [
  { icon: Users, title: "Explorez les clubs", description: "Parcourez les clubs de l'ISET et trouvez celui qui vous correspond." },
  { icon: Zap, title: "Demandez l'adhésion", description: "Envoyez une demande en un clic et suivez son statut en temps réel." },
  { icon: Bell, title: "Restez informé", description: "Recevez les annonces, événements et notifications de vos clubs." },
];

const Index = () => {
  const publicAnnouncements = mockAnnouncements.filter((a) => a.isPublic);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sortedEvents = [...mockEvents].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
  const upcomingEvents = sortedEvents.filter((e) => new Date(e.date) >= today);
  const homepageEvents = (upcomingEvents.length > 0 ? upcomingEvents : sortedEvents).slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-16 overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="Campus universitaire ISET Radès" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary/85 backdrop-blur-sm" />
        </div>
        <div className="container mx-auto relative z-10 py-24 md:py-32">
          <div className="max-w-xl">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-accent/15 border border-accent/20 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span className="text-[12px] font-medium text-accent">Année universitaire 2025–2026</span>
              </div>
              <h1 className="font-heading text-3xl md:text-4xl lg:text-[44px] font-bold text-primary-foreground leading-[1.15] mb-5">
                La plateforme des clubs étudiants de l'ISET Radès
              </h1>
              <p className="text-base text-primary-foreground/75 leading-relaxed mb-8 max-w-md">
                Consultez les clubs, suivez leurs annonces, participez aux événements et rejoignez ceux qui vous correspondent.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/clubs">
                  <Button variant="accent" size="lg" className="gap-2">
                    Explorer les clubs <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button variant="outline" size="lg" className="bg-primary-foreground/100 hover:text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                    Continuer avec Google
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="mt-16 flex flex-wrap gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary-foreground/10 flex items-center justify-center">
                  <stat.icon className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <div className="text-lg font-heading font-bold text-primary-foreground">{stat.value}</div>
                  <div className="text-[11px] text-primary-foreground/50 uppercase tracking-wider">{stat.label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Clubs en vedette */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-[11px] font-semibold text-accent uppercase tracking-widest">Nos clubs</span>
              <h2 className="font-heading text-2xl font-bold text-foreground mt-0.5">Clubs en vedette</h2>
            </div>
            <Link to="/clubs" className="hidden sm:flex items-center gap-1 text-sm font-medium text-accent hover:text-accent/80 transition-colors">
              Voir tous <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {mockClubs.filter((c) => c.status === "active").slice(0, 6).map((club, i) => (
              <ClubCard key={club.id} club={club} index={i} />
            ))}
          </div>
          <div className="sm:hidden mt-6 text-center">
            <Link to="/clubs"><Button variant="outline" className="gap-2">Voir tous les clubs <ChevronRight className="w-4 h-4" /></Button></Link>
          </div>
        </div>
      </section>

      {/* Prochains événements */}
      <section className="py-16 md:py-20 bg-muted/40">
        <div className="container mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-[11px] font-semibold text-accent uppercase tracking-widest">Agenda</span>
              <h2 className="font-heading text-2xl font-bold text-foreground mt-0.5">Prochains événements</h2>
            </div>
            <Link to="/evenements" className="hidden sm:flex items-center gap-1 text-sm font-medium text-accent hover:text-accent/80 transition-colors">
              Tous les événements <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {homepageEvents.map((event, i) => (
              <EventCard key={event.id} event={event} clubName={mockClubs.find((c) => c.id === event.clubId)?.name} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Dernières annonces */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-[11px] font-semibold text-accent uppercase tracking-widest">Actualités</span>
              <h2 className="font-heading text-2xl font-bold text-foreground mt-0.5">Dernières annonces</h2>
            </div>
            <Link to="/annonces" className="hidden sm:flex items-center gap-1 text-sm font-medium text-accent hover:text-accent/80 transition-colors">
              Toutes les annonces <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {publicAnnouncements.slice(0, 4).map((a, i) => (
              <AnnouncementCard key={a.id} announcement={a} clubName={mockClubs.find((c) => c.id === a.clubId)?.name} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="py-16 md:py-20 bg-muted/40">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <span className="text-[11px] font-semibold text-accent uppercase tracking-widest">Simple & rapide</span>
            <h2 className="font-heading text-2xl font-bold text-foreground mt-0.5">Comment ça marche ?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {howItWorks.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
