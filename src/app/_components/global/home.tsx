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
    <div data-cy="home-root">
      <div data-cy="app-sidebar-wrapper">
        <AppSidebar>
          <div data-cy="app-sidebar-children-wrapper">
            {state === "expanded" && (
              <>
                <div data-cy="sidebar-trigger-in-home">
                  <SidebarTrigger />
                </div>
                <div data-cy="search-icon-in-home">
                  <FontAwesomeIcon icon={faSearch} />
                </div>
              </>
            )}
          </div>
        </AppSidebar>
      </div>
      <div data-cy="hero-section-wrapper" data-hero-state={state}>
        <HeroSection state={state}>{children}</HeroSection>
      </div>
    </div>
  );
}
