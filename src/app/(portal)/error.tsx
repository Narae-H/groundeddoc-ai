"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";

interface PortalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Portal error boundary. Next requires `error.tsx` to be a Client Component — it owns
 * the `reset` retry. We never render the raw error message to the user.
 */
export default function PortalError({ error, reset }: PortalErrorProps) {
  useEffect(() => {
    // TODO(P4): forward to real error reporting.
    console.error(error);
  }, [error]);

  return (
    <ErrorState
      title="Couldn’t load your projects"
      action={
        <Button variant="primary" onClick={reset}>
          Try again
        </Button>
      }
    />
  );
}
