import { Meeting } from "@/types/club";
import { motion } from "framer-motion";
import { Calendar, Clock, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MeetingCardProps {
  meeting: Meeting;
  clubName?: string;
  index: number;
}

export function MeetingCard({ meeting, clubName, index }: MeetingCardProps) {
  const meetingDate = new Date(meeting.date);
  const isPast = meetingDate < new Date();

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      viewport={{ once: true }}
      className="bg-card rounded-xl border border-border shadow-card p-5"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {clubName && <Badge variant="default">{clubName}</Badge>}
          {isPast && <Badge variant="secondary">Passée</Badge>}
        </div>
        <div className="flex flex-col items-end text-right">
          <span className="text-xs font-heading font-bold text-accent">{meetingDate.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</span>
          <span className="text-[11px] text-muted-foreground">{meeting.time}</span>
        </div>
      </div>
      <h3 className="font-heading font-semibold text-foreground mb-2 text-[15px]">{meeting.title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{meeting.description}</p>
      <div className="flex items-center gap-3 pt-3 border-t border-border">
        <div className="flex items-center gap-3 text-xs text-muted-foreground flex-1">
          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{meetingDate.toLocaleDateString("fr-FR")}</span>
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{meeting.time}</span>
        </div>
        {!isPast && (
          <a href={meeting.meetingLink} target="_blank" rel="noopener noreferrer">
            <Button size="sm" variant="accent" className="gap-1.5">
              <Video className="w-3.5 h-3.5" />
              Rejoindre
            </Button>
          </a>
        )}
      </div>
    </motion.article>
  );
}
