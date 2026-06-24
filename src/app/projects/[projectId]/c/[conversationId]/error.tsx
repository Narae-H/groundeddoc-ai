"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";

interface ConversationErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/** Conversation error boundary (Client Component, per Next's `error.tsx` convention). */
export default function ConversationError({
  error,
  reset,
}: ConversationErrorProps) {
  useEffect(() => {
    // TODO(P4): forward to real error reporting.
    console.error(error);
  }, [error]);

  return (
    <ErrorState
      title="Couldn’t load this conversation"
      action={
        <Button variant="primary" onClick={reset}>
          Try again
        </Button>
      }
    />
  );
}
