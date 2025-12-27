"use client";
import { useEffect } from "react";
import { ErrorPage } from './components/error-pages';

interface ErrorPages {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPages) {
  useEffect(() => {
    console.error("App level error", error);
  }, [error]);

  return <ErrorPage error={error} reset={reset} />;
}