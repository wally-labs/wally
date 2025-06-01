import { HydrateClient } from "~/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
      <div className="flex min-h-screen flex-col items-center justify-center gap-20 bg-gradient-to-b from-[white] to-[#f7faff] py-12 text-black">
        <h1 className="text-5xl font-bold text-amberTheme">
          Say Hello To Wally!
        </h1>
        <div className="w-[70%]">
          {/* TODO: Replace with future components */}
        </div>
      </div>
    </HydrateClient>
  );
}
