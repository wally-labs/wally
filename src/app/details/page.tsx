import React from "react";

interface StepData {
  stepNumber: string;
  title: string;
  description: string;
}

const stepData: StepData[] = [
  {
    stepNumber: "1",
    title: "Create Profile",
    description:
      "Tell Wally about yourself, your interests, and what you're looking for",
  },
  {
    stepNumber: "2",
    title: "AI Analysis",
    description:
      "Our AI analyzes your profile to understand your dating preferences",
  },
  {
    stepNumber: "3",
    title: "Get Matches",
    description:
      "Receive highly compatible matches based on your unique profile",
  },
  {
    stepNumber: "4",
    title: "Connect",
    description:
      "Chat, video call, and meet your matches with AI-guided conversation starters",
  },
];

export default function WallyDetails() {
  return (
    <div className="min-h-screen bg-white px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-5xl font-bold text-gray-900 md:text-6xl">
            How{" "}
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-purple-600 bg-clip-text text-transparent">
              WALLY
            </span>{" "}
            Works
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
