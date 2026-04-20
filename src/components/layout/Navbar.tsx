import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, Menu, X, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navItems = [
  { label: "Accueil", path: "/" },
  { label: "Clubs", path: "/clubs" },
  { label: "Annonces", path: "/annonces" },
  { label: "Événements", path: "/evenements" },
];

export function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const dashboardPath = user?.role === "admin" ? "/admin" : user?.role === "responsable" ? "/responsable" : "/etudiant";

  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border"
    >
      <div className="container mx-auto flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <GraduationCap className="w-4.5 h-4.5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold text-[15px] leading-tight text-foreground">ISET ClubHub</span>
            <span className="text-[10px] text-muted-foreground leading-none tracking-wider uppercase">Radès</span>
          </div>
        </Link>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-0.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3.5 py-2 rounded-md text-[13px] font-medium transition-colors ${
                  isActive
                    ? "bg-primary/8 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <Link to={dashboardPath}>
              <Button variant="accent" size="sm" className="gap-2">
                <LayoutDashboard className="w-4 h-4" />Mon espace
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="outline" size="sm">Connexion</Button>
              </Link>
              <Link to="/auth">
                <Button variant="accent" size="sm">S'inscrire</Button>
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-md text-foreground hover:bg-muted transition-colors"
          aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-border bg-card"
        >
          <div className="container py-3 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <div className="flex gap-2 mt-2 pt-2 border-t border-border">
              {isAuthenticated ? (
                <Link to={dashboardPath} onClick={() => setMobileOpen(false)} className="flex-1">
                  <Button variant="accent" size="sm" className="w-full gap-2"><LayoutDashboard className="w-4 h-4" />Mon espace</Button>
                </Link>
              ) : (
                <>
                  <Link to="/auth" onClick={() => setMobileOpen(false)} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">Connexion</Button>
                  </Link>
                  <Link to="/auth" onClick={() => setMobileOpen(false)} className="flex-1">
                    <Button variant="accent" size="sm" className="w-full">S'inscrire</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
