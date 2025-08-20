"use client";

import { SidebarTrigger, useSidebar } from "~/components/ui/sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { AppSidebar } from "~/app/_components/global/app-sidebar";
import { HeroSection } from "~/app/_components/global/hero-section";
import ChatHome from "~/app/_components/chat/chat-home";

export default function MainChat() {
  const { state } = useSidebar();

  return (
    <>
      <AppSidebar>
        {state === "expanded" && (
          <>
            <SidebarTrigger />
            <FontAwesomeIcon icon={faSearch} />
          </>
        )}
      </AppSidebar>
      <HeroSection state={state}>
        <div className="min-w-screen flex min-h-screen flex-col items-center py-24">
          <ChatHome />
        </div>
      </HeroSection>
    </>
  );
}
