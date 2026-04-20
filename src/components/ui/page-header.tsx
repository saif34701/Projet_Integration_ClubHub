interface PageHeaderProps {
  overline?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ overline, title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
      <div>
        {overline && (
          <span className="text-[11px] font-semibold text-accent uppercase tracking-widest">{overline}</span>
        )}
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mt-0.5">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground mt-1.5 max-w-lg">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
