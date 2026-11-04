"use client";

import { Button } from "@/components/ui/button";

interface AppErrorProps {
  error: unknown;
  retry: () => void;
}

export default function AppError({ retry }: AppErrorProps) {
  return (
    <div className="flex flex-col items-start gap-3">
      <h2 className="text-lg font-medium">Something went wrong</h2>
      <p className="text-sm text-muted-foreground">This page couldn&apos;t be loaded. Please try again.</p>
      <Button variant="outline" onClick={() => retry()}>
        Try again
      </Button>
    </div>
  );
}
