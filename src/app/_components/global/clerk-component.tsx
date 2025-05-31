import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { useSetAtom } from "jotai";
import { Button } from "~/components/ui/button";
import { chatDataAtom } from "../atoms";
import { useEffect } from "react";
import { api } from "~/trpc/react";
import { H } from "@highlight-run/next/client";

export default function ClerkComponent() {
  const apiUtils = api.useUtils();

  // this component is used to render the sign in button and user button
  const { isLoaded, isSignedIn, user } = useUser();
  const setChatData = useSetAtom(chatDataAtom);

  // this useEffect should run only ONCE on mount to check session before login
  useEffect(() => {
    const anonId = `anon=${crypto.randomUUID()}`;
    H.identify(anonId, {
      highlightDisplayName: "Visitor",
      highlightEmail: "visitor@anonymous",
      hasUsedFeature: false,
    });
  });

  // this useEffect should run only once clerk finishes loading
  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!isSignedIn || user === null) {
      sessionStorage.removeItem("wally:chatData");
      setChatData([]);
      void apiUtils.chat.getAllChatHeaders.invalidate(); // TODO invalidate() or cancel() here, find better suited one

      return;
    }

    const userId = user.id;
    const fullName = user.firstName + " " + user.lastName;
    const emailId = user.primaryEmailAddressId ?? "";
    const email =
      user.emailAddresses.find((email) => email.id === emailId)?.emailAddress ??
      "";
    const hasSignedIn = true;

    console.log("highlight identification: ", fullName, email, hasSignedIn);

    H.identify(userId, {
      highlightDisplayName: fullName,
      highlightEmail: email,
      hasUsedFeature: hasSignedIn,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoaded, isSignedIn]);

  return (
    <>
      <SignedOut>
        <SignInButton>
          <Button variant="main">Sign In</Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </>
  );
}
