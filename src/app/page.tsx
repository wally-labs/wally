import { Button } from "~/components/ui/button";
import { HydrateClient } from "~/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gradient-to-b from-[white] to-[#f7faff] py-12 text-black">
        <h1 className="text-5xl font-bold text-amberTheme">WALLY</h1>

        <h2 className="text-2xl font-semibold">
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
          <Button variant="main" className="px-8 py-4">
            Get Started Free
          </Button>
          <Button
            variant="outline"
            className="px-8 py-4 text-purple-400 hover:border-pink-500 hover:text-white"
          >
            See How It Works
          </Button>
        </div>
      </div>
    </HydrateClient>
  );
}
