import Image from "next/image";
import React from "react";

interface StepData {
  stepNumber: string;
  title: string;
  description: string;
}

const stepData: StepData[] = [
  {
    stepNumber: "1",
    title: "Check In",
    description: "Share how you’re feeling and what’s on your mind.",
  },
  {
    stepNumber: "2",
    title: "Reflect Together",
    description:
      "Wally helps you process emotions, conflicts, and milestones with empathy.",
  },
  {
    stepNumber: "3",
    title: "Discover Insights",
    description:
      "See trends and highlights from your past reflections to better understand yourself and your relationships.",
  },
  {
    stepNumber: "4",
    title: "Grow Daily",
    description:
      "Receive personalized suggestions and reminders to strengthen your bonds over time.",
  },
];

export default function WallyDetails() {
  return (
    <div className="max-w-6xl">
      <div className="mx-auto">
        <div className="mb-16 text-center">
          <h1 className="mb-4 flex items-center justify-center gap-3 text-5xl font-bold leading-none text-gray-900 md:text-6xl">
            <span>How</span>
            <span className="sr-only"> WALLY </span>
            <Image
              src="/wally-main-header.svg"
              alt=""
              aria-hidden="true"
              width={400}
              height={100}
              priority
              className="h-[1em] w-auto align-middle"
            />
            <span>Works</span>
          </h1>
        </div>

        <div className="flex items-center justify-between">
          {stepData.map((step, index) => (
            <React.Fragment key={step.stepNumber}>
              <div className="max-w-xs flex-1 text-center">
                <div className="mx-auto mb-6 h-16 w-16 rounded-2xl border-2 border-transparent p-1">
                  <div className="flex h-full w-full items-center justify-center rounded-2xl">
                    <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
                      {step.stepNumber}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="leading-relaxed text-gray-600">
                    {step.description}
                  </p>
                </div>
              </div>

              {index < stepData.length - 1 && (
                <div className="mx-4 flex-shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center">
                    <div className="h-0 w-0 border-b-[8px] border-l-[12px] border-t-[8px] border-b-transparent border-l-purple-500 border-t-transparent"></div>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
