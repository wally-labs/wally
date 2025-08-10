import Image from "next/image";
import Link from "next/link";
import ClerkComponent from "./clerk-component";

type NavigationMenuItem = {
  name: string;
  link: string;
};

const NavigationMenuItems: NavigationMenuItem[] = [
  {
    name: "Features",
    link: "/features",
  },
  {
    name: "How It Works",
    link: "/details",
  },
  {
    name: "Testimonials",
    link: "/testimonials",
  },
  {
    name: "Pricing",
    link: "/plans",
  },
  {
    name: "Team",
    link: "/about-us",
  },
];

export function NavMenu() {
  return (
    <header className="relative mx-auto w-full max-w-full px-4 py-4">
      {/* Left: logo */}
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/wally-logo.png"
            alt="Wally"
            width={40}
            height={40}
            priority
          />
        </Link>

        {/* Right: actions */}
        <div className="flex items-center gap-4">
          <ClerkComponent />
        </div>
      </div>

      {/* Center: nav (true center, independent of left/right widths) */}
      <nav className="pointer-events-auto absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block">
        <ul className="flex items-center gap-12">
          {NavigationMenuItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.link}
                className="text-lg text-gray-800 hover:text-gray-500"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
