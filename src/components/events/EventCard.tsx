import { Event } from "@/types/club";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin } from "lucide-react";

interface EventCardProps {
  event: Event;
  clubName?: string;
  index: number;
}

export function EventCard({ event, clubName, index }: EventCardProps) {
  const eventDate = new Date(event.date);
  const isPast = eventDate < new Date();

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      viewport={{ once: true }}
      className="bg-card rounded-xl border border-border shadow-card hover:shadow-card-hover transition-shadow p-5"
    >
      <div className="flex gap-4">
        {/* Date block */}
        <div className="flex flex-col items-center justify-center w-14 h-14 rounded-lg bg-accent/10 shrink-0">
          <span className="text-xs font-semibold text-accent uppercase">
            {eventDate.toLocaleDateString("fr-FR", { month: "short" })}
          </span>
          <span className="text-xl font-heading font-bold text-accent leading-none">
            {eventDate.getDate()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {clubName && <Badge variant="default">{clubName}</Badge>}
            {isPast && <Badge variant="secondary">Passé</Badge>}
          </div>
          <h3 className="font-heading font-semibold text-foreground text-[15px] mb-1">{event.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-3">{event.description}</p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{event.time}</span>
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{event.location}</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
