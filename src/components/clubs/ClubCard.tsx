import { Club } from "@/types/club";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ClubCardProps {
  club: Club;
  index: number;
}

const categoryVariant: Record<string, "default" | "info" | "success" | "warning"> = {
  Technologie: "info",
  Culture: "warning",
  Sport: "success",
  Business: "default",
  Environnement: "success",
};

export function ClubCard({ club, index }: ClubCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      viewport={{ once: true }}
    >
      <Link to={`/clubs/${club.id}`} className="group block">
        <div className="bg-card rounded-xl border border-border shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden">
          {/* Top color stripe */}
          <div className="h-1.5 bg-accent" />
          <div className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-11 h-11 rounded-lg bg-primary/8 flex items-center justify-center shrink-0">
                <span className="text-lg font-heading font-bold text-primary">{club.name.charAt(0)}</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="font-heading font-semibold text-foreground mb-1 group-hover:text-accent transition-colors text-[15px]">
              {club.name}
            </h3>
            <Badge variant={categoryVariant[club.category] || "default"} className="mb-3">
              {club.category}
            </Badge>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-4">
              {club.description}
            </p>
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Users className="w-3.5 h-3.5" />
                {club.membersCount} membres
              </span>
              <span className="text-xs text-muted-foreground">
                Depuis {club.foundedYear}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
