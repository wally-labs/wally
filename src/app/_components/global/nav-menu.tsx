import Link from "next/link";

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
    <nav className="mx-auto flex w-full justify-center space-x-14 py-6">
      {NavigationMenuItems.map((item) => (
        <Link
          key={item.name}
          href={item.link}
          className="text-md text-gray-800 hover:text-gray-400"
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}
