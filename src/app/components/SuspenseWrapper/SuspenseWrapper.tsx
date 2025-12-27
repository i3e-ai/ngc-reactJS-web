"use client";

import { Suspense } from "react";
import Loading from "../Loading/Loading";

interface SuspenseWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function SuspenseWrapper({
  children,
  fallback = <Loading message="Loading..." />
}: SuspenseWrapperProps) {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
}