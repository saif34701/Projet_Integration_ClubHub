import { Announcement } from "@/types/club";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Calendar, User } from "lucide-react";

interface AnnouncementCardProps {
  announcement: Announcement;
  clubName?: string;
  index: number;
}

export function AnnouncementCard({ announcement, clubName, index }: AnnouncementCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      viewport={{ once: true }}
      className="bg-card rounded-xl border border-border shadow-card p-5"
    >
      <div className="flex items-center gap-2 mb-3">
        {clubName && (
          <Badge variant="default">{clubName}</Badge>
        )}
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {new Date(announcement.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
        </span>
      </div>
      <h3 className="font-heading font-semibold text-foreground mb-2 text-[15px]">{announcement.title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{announcement.content}</p>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {announcement.tags.map((tag) => (
            <span key={tag} className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded">
              #{tag}
            </span>
          ))}
        </div>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <User className="w-3 h-3" />
          {announcement.authorName}
        </span>
      </div>
    </motion.article>
  );
}
