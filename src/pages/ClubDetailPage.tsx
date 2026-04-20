import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EmptyState } from "@/components/ui/empty-state";
import { mockClubs, mockAnnouncements, mockMeetings } from "@/data/mockData";
import { AnnouncementCard } from "@/components/announcements/AnnouncementCard";
import { MeetingCard } from "@/components/meetings/MeetingCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, Calendar, Send, Megaphone, Video } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ClubDetailPage = () => {
  const { id } = useParams();
  const club = mockClubs.find((c) => c.id === id);
  const clubAnnouncements = mockAnnouncements.filter((a) => a.clubId === id);
  const clubMeetings = mockMeetings.filter((m) => m.clubId === id);
  const [open, setOpen] = useState(false);

  if (!club) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 container mx-auto text-center py-20">
          <EmptyState title="Club introuvable" description="Ce club n'existe pas ou a été supprimé." />
          <Link to="/clubs" className="text-accent hover:underline mt-4 inline-block text-sm">Retour aux clubs</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleJoinRequest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Votre demande d'adhésion a été envoyée avec succès. Vous serez notifié dès qu'elle sera traitée.");
    setOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto">
          <Link to="/clubs" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Retour aux clubs
          </Link>

          {/* Club header card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl border border-border shadow-card overflow-hidden"
          >
            <div className="h-2 bg-accent" />
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="w-16 h-16 rounded-xl bg-primary/8 flex items-center justify-center shrink-0">
                  <span className="text-2xl font-heading font-bold text-primary">{club.name.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <Badge variant="info">{club.category}</Badge>
                  </div>
                  <h1 className="font-heading text-2xl font-bold text-foreground mb-2">{club.name}</h1>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">{club.description}</p>
                  <div className="flex items-center gap-5 mt-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-accent" /> {club.membersCount} membres</span>
                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-accent" /> Fondé en {club.foundedYear}</span>
                  </div>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button variant="accent" className="gap-2 shrink-0">
                      <Send className="w-4 h-4" /> Demander à rejoindre
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="font-heading">Demande d'adhésion</DialogTitle>
                      <DialogDescription>Remplissez ce formulaire pour rejoindre {club.name}.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleJoinRequest} className="space-y-4 mt-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="join-name">Nom complet</Label>
                        <Input id="join-name" placeholder="Ex : Mohamed Ben Ali" required />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="join-email">Adresse email ISET</Label>
                        <Input id="join-email" type="email" placeholder="prenom.nom@isetrades.tn" required />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="join-motivation">Motivation</Label>
                        <Textarea
                          id="join-motivation"
                          placeholder="Décrivez brièvement pourquoi vous souhaitez rejoindre ce club…"
                          required
                          rows={4}
                        />
                      </div>
                      <Button type="submit" variant="accent" className="w-full">
                        Envoyer ma demande
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <Tabs defaultValue="annonces" className="mt-8">
            <TabsList className="bg-muted/60">
              <TabsTrigger value="annonces" className="gap-1.5">
                <Megaphone className="w-3.5 h-3.5" /> Annonces ({clubAnnouncements.length})
              </TabsTrigger>
              <TabsTrigger value="reunions" className="gap-1.5">
                <Video className="w-3.5 h-3.5" /> Réunions ({clubMeetings.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="annonces" className="mt-5">
              {clubAnnouncements.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {clubAnnouncements.map((a, i) => (
                    <AnnouncementCard key={a.id} announcement={a} index={i} />
                  ))}
                </div>
              ) : (
                <EmptyState title="Aucune annonce" description="Ce club n'a pas encore publié d'annonce." />
              )}
            </TabsContent>
            <TabsContent value="reunions" className="mt-5">
              {clubMeetings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {clubMeetings.map((m, i) => (
                    <MeetingCard key={m.id} meeting={m} index={i} />
                  ))}
                </div>
              ) : (
                <EmptyState title="Aucune réunion planifiée" description="Il n'y a pas de réunion à venir pour ce club." />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ClubDetailPage;
