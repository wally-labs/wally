"use client";

import { SidebarTrigger, useSidebar } from "~/components/ui/sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { AppSidebar } from "~/app/_components/global/app-sidebar";
import { HeroSection } from "~/app/_components/global/hero-section";
import Image from "next/image";

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
        <div className="flex flex-col items-center justify-center py-12 text-5xl font-bold text-black">
          <span>Talk to{""}</span>
          <span className="sr-only"> WALLY </span>
          <Image
            src="/wally-main-header.svg"
            alt=""
            aria-hidden="true"
            width={400}
            height={100}
            priority
            className="h-[1em] w-auto align-middle"
          />
        </div>
      </HeroSection>
    </>
  );
}
