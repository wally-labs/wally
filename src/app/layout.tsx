import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { ClerkProvider } from "@clerk/nextjs";

import { SidebarProvider } from "@components/ui/sidebar";
import { Toaster } from "sonner";
import JotaiProvider from "./_components/jotai-provider";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { HighlightInit } from "@highlight-run/next/client";
import HighlightErrorBoundary from "~/app/_components/highlight-boundary";
import { env } from "~/env-client";

export const metadata: Metadata = {
  title: "Wally",
  description:
    "Wally is your personal AI relationship wellness assistant that offers offline communication tips to strengthen bonds and nurture healthier connections.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      {process.env.NODE_ENV === "production" && (
        <HighlightInit
          projectId={env.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID}
          serviceName="my-nextjs-frontend"
          storageMode="sessionStorage"
          tracingOrigins={["/api/trpc"]}
          environment={env.NEXT_PUBLIC_HIGHLIGHT_ENV}
          networkRecording={{
            // enabled: true,
            // recordHeadersAndBody: true,
            // urlBlocklist: [],
            enabled: false,
          }}
        />
      )}
      <HighlightErrorBoundary>
        <html lang="en" className={`${GeistSans.variable}`}>
          <body>
            <TRPCReactProvider>
              <JotaiProvider>{children}</JotaiProvider>
            </TRPCReactProvider>
            <Toaster />
            <Analytics debug={false} />
            <SpeedInsights debug={false} />
          </body>
        </html>
      </HighlightErrorBoundary>
    </ClerkProvider>
  );
}
