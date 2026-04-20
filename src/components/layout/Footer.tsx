import { GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-heading font-bold text-[15px] text-foreground">ISET Clubs</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Plateforme centralisée des clubs étudiants de l'ISET Radès. Découvrez, rejoignez et participez à la vie associative de votre institut.
            </p>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-sm text-foreground mb-3">Plateforme</h4>
            <div className="flex flex-col gap-2">
              <Link to="/clubs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Tous les clubs</Link>
              <Link to="/annonces" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Annonces</Link>
              <Link to="/evenements" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Événements</Link>
            </div>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-sm text-foreground mb-3">Contact</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <span>ISET Radès, Tunisie</span>
              <span>clubs@isetrades.tn</span>
            </div>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-6">
          <p className="text-xs text-muted-foreground text-center">© 2026 ISET Radès — Plateforme clubs étudiants</p>
        </div>
      </div>
    </footer>
  );
}
