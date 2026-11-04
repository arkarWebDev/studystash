import { useId, type ReactNode } from "react";

interface SidebarSectionProps {
  title?: string;
  children: ReactNode;
}

export function SidebarSection({ title, children }: SidebarSectionProps) {
  const headingId = useId();

  return (
    <section aria-labelledby={title ? headingId : undefined} className="flex flex-col gap-0.5">
      {title && (
        <h3
          id={headingId}
          className="px-2 pb-1 text-xs font-medium text-muted-foreground group-data-[collapsed=true]/sidebar:sr-only"
        >
          {title}
        </h3>
      )}
      {children}
    </section>
  );
}
