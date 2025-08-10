import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { HydrateClient } from "~/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
      <div className="flex flex-col items-center justify-center gap-6 py-12 text-black">
        <h1 className="m-0 flex items-center justify-center">
          <span className="sr-only">WALLY</span>
          <Image
            src="/wally-main-header.svg"
            alt=""
            aria-hidden="true"
            width={960} // pick any large-ish width
            height={240} // aspect ratio of your SVG
            priority
            className="h-24 w-auto sm:h-28 md:h-36 lg:h-44"
          />
        </h1>

        <h2 className="text-3xl font-semibold">
          Find Your Perfect Match With{" "}
          <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            AI-Powered{" "}
          </span>
          Dating
        </h2>

        <p className="max-w-xl text-center text-base leading-relaxed">
          Wally AI understands your preferences, personality, and dating goals
          to connect you with compatible matches. Say goodbye to endless
          swiping!
        </p>

        <div className="flex gap-4">
          {/* Filled gradient */}
          <Button asChild className="btn-primary-gradient">
            <Link href="/chats">Get Started Free</Link>
          </Button>

          {/* Gradient border + gradient text */}
          <Button asChild className="btn-outline-gradient">
            <Link href="/how-it-works">See How It Works</Link>
          </Button>
        </div>
      </div>
    </HydrateClient>
  );
}
