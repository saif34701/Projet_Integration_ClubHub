import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import { mockNotifications } from "@/data/mockData";
import { EmptyState } from "@/components/ui/empty-state";
import { Bell } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const StudentNotifications = () => {
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications(notifications.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <DashboardLayout
      title="Notifications"
      description={`${unreadCount} non lue${unreadCount > 1 ? "s" : ""}`}
      actions={
        unreadCount > 0 ? (
          <Button variant="outline" size="sm" onClick={markAllRead}>Tout marquer comme lu</Button>
        ) : undefined
      }
    >
      {notifications.length > 0 ? (
        <div className="space-y-2 max-w-2xl">
          {notifications.map((notif) => (
            <NotificationItem key={notif.id} notification={notif} onMarkRead={markRead} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Bell className="w-6 h-6 text-muted-foreground" />}
          title="Aucune notification"
          description="Vous n'avez pas de notification pour le moment."
        />
      )}
    </DashboardLayout>
  );
};

export default StudentNotifications;
