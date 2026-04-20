import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  className?: string;
}

export function StatCard({ label, value, icon, trend, className }: StatCardProps) {
  return (
    <div className={cn("bg-card rounded-xl border border-border shadow-card p-5", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-heading font-bold text-foreground mt-1">{value}</p>
          {trend && <p className="text-xs text-accent mt-1">{trend}</p>}
        </div>
        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent shrink-0">
          {icon}
        </div>
      </div>
    </div>
  );
}
