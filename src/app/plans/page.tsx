import { CheckIcon } from "lucide-react";
import { cn } from "~/lib/utils";

const tiers: Tier[] = [
  {
    name: "Personal",
    id: "tier-personal",
    href: "#",
    priceMonthly: "$29",
    description:
      "The perfect plan if you're just getting started with our product.",
    features: [
      "25 profiles",
      "Up to 10,000 messages",
      "Advanced, well-crafted responses",
      "24-hour support response time",
    ],
    featured: false,
  },
  {
    name: "Enterprise",
    id: "tier-enterprise",
    href: "#",
    priceMonthly: "$199",
    description: "Dedicated support and infrastructure for your company.",
    features: [
      "Unlimited profiles",
      "Unlimited subscribers",
      "Advanced analytics",
      "Dedicated support representative",
      "Marketing automations",
      "Custom integrations",
    ],
    featured: true,
  },
];

interface Tier {
  name: string;
  id: string;
  href: string;
  priceMonthly: string;
  description: string;
  features: string[];
  featured: boolean;
}

export default function Plans() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-20 bg-gradient-to-b from-[white] to-[#f7faff] py-12 text-black">
      <div className="px-6 py-24 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2
            className="text-xl font-semibold text-amberTheme-darker"
            data-cy="pricing-header"
          >
            Pricing
          </h2>
          <p className="mt-2 text-balance text-5xl font-semibold tracking-tight text-amberTheme sm:text-6xl">
            Choose the right plan for you
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-center text-lg font-medium text-gray-600 sm:text-xl/8">
          Unfortunately, you are not signed in to use Wally, Click on the
          &apos;Sign Up&apos; button above for free Beta access now!
        </p>
        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
          {tiers.map((tier, tierIdx) => (
            <div
              key={tier.id}
              className={cn(
                tier.featured
                  ? "relative bg-gray-900 shadow-2xl"
                  : "bg-white/60 sm:mx-8 lg:mx-0",
                tier.featured
                  ? ""
                  : tierIdx === 0
                    ? "rounded-t-3xl sm:rounded-b-none lg:rounded-bl-3xl lg:rounded-tr-none"
                    : "sm:rounded-t-none lg:rounded-bl-none lg:rounded-tr-3xl",
                "rounded-3xl p-8 ring-1 ring-gray-900/10 sm:p-10",
              )}
            >
              <h3
                id={tier.id}
                className={cn(
                  tier.featured ? "text-amberTheme" : "text-amberTheme-darker",
                  "text-base/7 font-semibold",
                )}
                data-cy="tier-headers"
              >
                {tier.name}
              </h3>
              <p className="mt-4 flex items-baseline gap-x-2">
                <span
                  className={cn(
                    tier.featured ? "text-white" : "text-gray-900",
                    "text-5xl font-semibold tracking-tight",
                  )}
                >
                  {tier.priceMonthly}
                </span>
                <span
                  className={cn(
                    tier.featured ? "text-gray-400" : "text-gray-500",
                    "text-base",
                  )}
                >
                  /month
                </span>
              </p>
              <p
                className={cn(
                  tier.featured ? "text-gray-300" : "text-gray-600",
                  "mt-6 text-base/7",
                )}
              >
                {tier.description}
              </p>
              <ul
                role="list"
                className={cn(
                  tier.featured ? "text-gray-300" : "text-gray-600",
                  "mt-8 space-y-3 text-sm/6 sm:mt-10",
                )}
                data-cy="tier-lists"
              >
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon
                      aria-hidden="true"
                      className={cn(
                        tier.featured
                          ? "text-amberTheme"
                          : "text-amberTheme-darker",
                        "h-6 w-5 flex-none",
                      )}
                      data-cy="tier-list-items"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href={tier.href}
                aria-describedby={tier.id}
                className={cn(
                  tier.featured
                    ? "shadow-xs hover:amberTheme bg-amberTheme-darker text-white focus-visible:outline-amberTheme"
                    : "text-amberTheme ring-1 ring-inset ring-amberTheme hover:ring-amberTheme-darker focus-visible:outline-amberTheme-darker",
                  "mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10",
                )}
                data-cy="purchase-link"
              >
                Get started today
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
