import { MembershipRequest } from "@/types/club";
import { Badge } from "@/components/ui/badge";

const statusConfig: Record<MembershipRequest["status"], { label: string; variant: "warning" | "success" | "destructive" }> = {
  pending: { label: "En attente", variant: "warning" },
  accepted: { label: "Acceptée", variant: "success" },
  rejected: { label: "Refusée", variant: "destructive" },
};

interface StatusBadgeProps {
  status: MembershipRequest["status"];
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
