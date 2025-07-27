import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@components/ui/navigation-menu";

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
    link: "/how-it-works",
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
    <div className="mx-auto flex w-full justify-center py-6">
      <NavigationMenu>
        <NavigationMenuList>
          {NavigationMenuItems.map((item) => {
            return (
              <NavigationMenuItem key={item.name}>
                <NavigationMenuTrigger>{item.name}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <NavigationMenuLink>{item.link}</NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
            );
          })}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
