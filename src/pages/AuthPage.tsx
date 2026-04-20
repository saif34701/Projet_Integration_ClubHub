import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { UserRole } from "@/types/club";

const AuthPage = () => {
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      login(selectedRole);
      toast.success("Connexion réussie ! Bienvenue.");
      const route = selectedRole === "admin" ? "/admin" : selectedRole === "responsable" ? "/responsable" : "/etudiant";
      navigate(route);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-sm mx-auto px-4">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary mx-auto flex items-center justify-center mb-4">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="font-heading text-xl font-bold text-foreground">Bienvenue sur ISET ClubHub</h1>
            <p className="text-sm text-muted-foreground mt-1">Connectez-vous avec votre compte Google institutionnel</p>
          </div>

          <div className="bg-card rounded-xl border border-border shadow-card p-6 space-y-5">
            {/* Demo role selector */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">Rôle de démonstration</Label>
              <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as UserRole)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Étudiant</SelectItem>
                  <SelectItem value="responsable">Responsable de club</SelectItem>
                  <SelectItem value="admin">Administrateur</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[11px] text-muted-foreground">Sélectionnez un rôle pour explorer l'interface correspondante.</p>
            </div>

            <Button onClick={handleGoogleLogin} disabled={loading} className="w-full gap-3" size="lg">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {loading ? "Connexion en cours…" : "Continuer avec Google"}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              En vous connectant, vous acceptez les conditions d'utilisation de la plateforme.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AuthPage;
