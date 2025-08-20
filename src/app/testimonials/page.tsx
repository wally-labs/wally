import Image from "next/image";

interface StoryData {
  id: number;
  names: string;
  matchedTime: string;
  testimonial: string;
  rating: number;
  avatar: React.ReactNode;
}

const storyData: StoryData[] = [
  {
    id: 1,
    names: "Jessica & Mark",
    matchedTime: "Matched 8 mths ago",
    testimonial:
      "Wally AI matched us based on our love for indie films and cooking. We've been inseparable since our first date!",
    rating: 5,
    avatar: (
      <Image
        src={"/wally-testimonial-logo.png"}
        alt="Wally Testimonial Logo"
        height={64}
        width={64}
      />
    ),
  },
  {
    id: 2,
    names: "David & Sarah",
    matchedTime: "Matched 1 year ago",
    testimonial:
      "I was skeptical about AI matching, but Wally found me someone who truly gets me. We're planning our wedding now!",
    rating: 5,
    avatar: (
      <Image
        src={"/wally-testimonial-logo.png"}
        alt="Wally Testimonial Logo"
        height={64}
        width={64}
      />
    ),
  },
  {
    id: 3,
    names: "Micheal & Jamie",
    matchedTime: "Matched 6 mths ago",
    testimonial:
      "After years of dating apps that didn't work, Wally AI found me someone who shares my values and quirky sense of humor.",
    rating: 5,
    avatar: (
      <Image
        src={"/wally-testimonial-logo.png"}
        alt="Wally Testimonial Logo"
        height={64}
        width={64}
      />
    ),
  },
];

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="mt-4 flex gap-1">
      {Array.from({ length: 5 }, (_, index) => (
        <div key={index} className="h-6 w-6">
          {index < rating ? (
            // Filled star - replace later with actual star icon
            <div
              className="h-6 w-6 bg-yellow-400"
              style={{
                clipPath:
                  "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
              }}
            ></div>
          ) : (
            // Empty star - replace with actual star icon
            <div
              className="h-6 w-6 bg-gray-300"
              style={{
                clipPath:
                  "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
              }}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default function Testimonials() {
  return (
    <div>
      <div className="mx-auto">
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-5xl font-bold text-gray-900 md:text-6xl">
            Success Stories
          </h1>
        </div>

        <div className="flex gap-8 md:gap-12">
          {storyData.map((story) => (
            <div
              key={story.id}
              className="flex-1 rounded-2xl bg-white p-6 text-left shadow-sm"
            >
              <div className="mb-6 flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-purple-600 p-0.5">
                  <div className="h-full w-full rounded-full bg-white p-1">
                    <div className="h-full w-full overflow-hidden rounded-full">
                      {story.avatar}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {story.names}
                  </h3>
                  <p className="text-sm text-gray-500">{story.matchedTime}</p>
                </div>
              </div>

              <blockquote className="mb-4 leading-relaxed text-gray-700">
                {story.testimonial}
              </blockquote>

              <StarRating rating={story.rating} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
