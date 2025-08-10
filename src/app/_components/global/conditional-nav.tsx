"use client";

import { usePathname } from "next/navigation";
import { NavMenu } from "./nav-menu";

export function ConditionalNav() {
  const pathname = usePathname();

  // Hide nav menu if path starts with /chats/
  const shouldShowNav = !pathname.startsWith("/chats/");

  if (!shouldShowNav) {
    return null;
  }

  return (
    <div className="w-full min-w-full">
      <NavMenu />
    </div>
  );
}
