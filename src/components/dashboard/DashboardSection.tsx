import { useId, type ReactNode } from "react";

interface DashboardSectionProps {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}

export function DashboardSection({ title, action, children }: DashboardSectionProps) {
  const headingId = useId();

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h2 id={headingId} className="text-sm font-medium text-muted-foreground">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}
