import Image from "next/image";
import React from "react";

interface CardData {
  id: number;
  title: string;
  description: string;
}

const featureCardData: CardData[] = [
  {
    id: 1,
    title: "Smart Matching",
    description:
      "Our AI analyzes thousands of data points to find truly compatible matches based on personality, values, and lifestyle.",
  },
  {
    id: 2,
    title: "Date Planning",
    description:
      "Get personalized date ideas based on mutual interests, location, and preferences to create memorable experiences.",
  },
  {
    id: 3,
    title: "Profile Verification",
    description:
      "All profiles are verified through our advanced security system to ensure you're meeting genuine people.",
  },
];

export default function Features() {
  return (
    <div className="max-w-6xl">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="mb-4 flex items-center justify-center gap-3 text-5xl font-bold text-gray-900 md:text-6xl">
            <span>Why Choose</span>
            <span className="sr-only"> WALLY</span>
            <Image
              src="/wally-main-header.svg"
              alt=""
              aria-hidden="true"
              width={400}
              height={100}
              priority
              className="h-[1em] w-auto align-middle"
            />
          </h1>
        </div>

        {/* Cards Grid */}
        <div className="flex gap-12 md:gap-16">
          {featureCardData.map((card) => (
            <div
              key={card.id}
              className="flex-1 rounded-3xl bg-white px-4 py-6 text-center"
            >
              {/* Icon Container */}
              <div className="mx-auto mb-6 flex justify-center">
                <Image
                  src="/wally-feature-logo.svg"
                  alt="Wally Feature Logo"
                  aria-hidden="true"
                  width={72}
                  height={72}
                  priority
                />
              </div>

              {/* Card Content */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  {card.title}
                </h3>
                <p className="mx-auto text-gray-600">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
