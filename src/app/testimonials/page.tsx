import Image from "next/image";

interface StoryData {
  id: number;
  names: string;
  testimonial: string;
  rating: number;
  avatar: React.ReactNode;
}

const storyData: StoryData[] = [
  {
    id: 1,
    names: "Aisha",
    testimonial:
      "Wally helped me recognize patterns in my communication I’d never noticed before. It’s like having a coach who actually listens.",
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
    names: "Daniel",
    testimonial:
      "I use Wally as a daily journal, and it’s made me more mindful in my relationship with my partner.",
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
    names: "Jamie",
    testimonial:
      "The reminders are subtle but powerful. I’ve become more intentional in showing appreciation to the people I love.",
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
    <div className="max-w-6xl">
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

                <h3 className="text-xl font-bold text-gray-900">
                  {story.names}
                </h3>
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
