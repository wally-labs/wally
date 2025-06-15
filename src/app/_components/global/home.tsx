"use client";

import { SidebarTrigger, useSidebar } from "@components/ui/sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { AppSidebar } from "./app-sidebar";
import { HeroSection } from "./hero-section";

export default function Home({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { state } = useSidebar();

  return (
    <>
      <AppSidebar data-cy="app-sidebar">
        {state === "expanded" && (
          <>
            <SidebarTrigger />
            <FontAwesomeIcon icon={faSearch} />
          </>
        )}
      </AppSidebar>
      <HeroSection state={state}>{children}</HeroSection>
    </>
  );
}
