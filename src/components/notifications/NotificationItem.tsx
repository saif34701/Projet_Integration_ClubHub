import { Notification } from "@/types/club";
import { Bell, CheckCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationItemProps {
  notification: Notification;
  onMarkRead?: (id: string) => void;
}

const iconMap = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
};

const colorMap = {
  info: "text-info",
  success: "text-accepted",
  warning: "text-warning",
};

export function NotificationItem({ notification, onMarkRead }: NotificationItemProps) {
  const Icon = iconMap[notification.type];
  const timeAgo = getTimeAgo(notification.createdAt);

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-lg border transition-colors cursor-pointer hover:bg-muted/50",
        notification.read ? "bg-card border-border" : "bg-accent/5 border-accent/20"
      )}
      onClick={() => onMarkRead?.(notification.id)}
    >
      <div className={cn("mt-0.5 shrink-0", colorMap[notification.type])}>
        <Icon className="w-4.5 h-4.5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium text-foreground">{notification.title}</h4>
          {!notification.read && (
            <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">{notification.message}</p>
        <span className="text-xs text-muted-foreground mt-1 block">{timeAgo}</span>
      </div>
    </div>
  );
}

function getTimeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  return `Il y a ${diffDays}j`;
}
