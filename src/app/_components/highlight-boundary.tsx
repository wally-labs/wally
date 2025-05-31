"use client";

import { ErrorBoundary } from "@highlight-run/next/client";

export default function HighlightErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ErrorBoundary showDialog>{children}</ErrorBoundary>;
}
