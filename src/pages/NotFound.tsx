import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h1 className="font-heading text-6xl font-extrabold text-primary mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">Page introuvable</p>
        <Link to="/">
          <Button className="gap-2">
            <Home className="w-4 h-4" /> Retour à l'accueil
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
