import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ClubCard } from "@/components/clubs/ClubCard";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { mockClubs } from "@/data/mockData";
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const categories = ["Tous", ...Array.from(new Set(mockClubs.map((c) => c.category)))];

const ClubsPage = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");

  const filtered = mockClubs.filter((club) => {
    const matchSearch = club.name.toLowerCase().includes(search.toLowerCase()) ||
      club.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === "Tous" || club.category === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto">
          <PageHeader
            overline="Explorer"
            title="Tous les clubs"
            description="Parcourez les clubs de l'ISET Radès et trouvez celui qui correspond à vos centres d'intérêt."
          />

          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un club…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
                aria-label="Rechercher un club"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((club, i) => (
                <ClubCard key={club.id} club={club} index={i} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Aucun club trouvé"
              description="Essayez de modifier votre recherche ou de changer de catégorie."
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ClubsPage;
