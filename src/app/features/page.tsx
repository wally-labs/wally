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
    title: "Reflect & Journal",
    description:
      "Capture your daily thoughts and emotions. Wally helps you uncover patterns in how you connect and communicate.",
  },
  {
    id: 2,
    title: "Personalized Insights",
    description:
      "Get AI-powered feedback on your relationship dynamics, from communication styles to emotional well-being.",
  },
  {
    id: 3,
    title: "Continuous Support",
    description:
      "Wally remembers your journey, offering gentle nudges and reminders to help you stay present and connected.",
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
