import { Skeleton } from "@/components/ui/skeleton";

export function ClubCardSkeleton() {
  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <div className="h-1.5 bg-muted rounded-t-xl -mx-5 -mt-5 mb-5" />
      <div className="flex items-start justify-between mb-3">
        <Skeleton className="w-11 h-11 rounded-lg" />
        <Skeleton className="w-4 h-4 rounded" />
      </div>
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-5 w-20 mb-3 rounded-md" />
      <Skeleton className="h-3 w-full mb-1" />
      <Skeleton className="h-3 w-2/3 mb-4" />
      <div className="border-t border-border pt-3 flex justify-between">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

export function AnnouncementCardSkeleton() {
  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <div className="flex items-center gap-2 mb-3">
        <Skeleton className="h-5 w-24 rounded-md" />
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-3 w-full mb-1" />
      <Skeleton className="h-3 w-full mb-1" />
      <Skeleton className="h-3 w-2/3 mb-4" />
      <div className="flex justify-between">
        <div className="flex gap-1.5">
          <Skeleton className="h-4 w-14 rounded" />
          <Skeleton className="h-4 w-14 rounded" />
        </div>
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr className="border-b border-border">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="p-3">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}
