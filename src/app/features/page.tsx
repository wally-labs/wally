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
    <div className="min-h-screen bg-white px-4 py-16">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-5xl font-bold text-gray-900 md:text-6xl">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-purple-600 bg-clip-text text-transparent">
              WALLY
            </span>
          </h1>
        </div>

        {/* Cards Grid */}
        <div className="flex gap-8 md:gap-12">
          {featureCardData.map((card) => (
            <div key={card.id} className="flex-1 text-center">
              {/* Icon Container */}
              <div className="mx-auto mb-6 rounded-2xl p-3 shadow-lg">
                Placeholder for logo image
              </div>

              {/* Card Content */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  {card.title}
                </h3>
                <p className="mx-auto max-w-sm leading-relaxed text-gray-600">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
