"use client";

import { useUser } from "@clerk/nextjs";
import { createStore, Provider } from "jotai";
import { useMemo } from "react";

export default function JotaiProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = useUser();
  const myStore = useMemo(() => {
    console.log("Creating new store for ", user.user); // TODO: remove during prod
    return createStore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.user?.id]);

  return <Provider store={myStore}>{children}</Provider>;
}
