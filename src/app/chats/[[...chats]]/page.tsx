"use client";

import ChatHome from "~/app/_components/chat/chat-home";

import { SidebarTrigger, useSidebar } from "~/components/ui/sidebar";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { AppSidebar } from "~/app/_components/global/app-sidebar";
import { HeroSection } from "~/app/_components/global/hero-section";
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
        {" "}
        <div className="flex min-h-screen flex-col items-center justify-center gap-20 bg-gradient-to-b from-[white] to-[#f7faff] py-12 text-black">
          <ChatHome />
        </div>
      </HeroSection>
    </>
  );
}
