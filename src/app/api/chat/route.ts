export const runtime = "nodejs";
import "server-only";

import type z from "zod";
import { type formSchema } from "~/app/_components/schema";
import { openai } from "@ai-sdk/openai";
import { smoothStream, streamText } from "ai";
import type { LanguageModelV1, UIMessage, TextStreamPart, ToolSet } from "ai";
import { NextResponse, type NextRequest } from "next/server";
import { withAppRouterHighlight } from "~/lib/with-app-router-highlight";
import { currentUser } from "@clerk/nextjs/server";
import { ratelimit } from "~/server/db";

// FOR STREAM OBJECT
// const openAiElement = z.object({
//   type: z.string().describe("the html tag of the message"),
//   text: z.string().describe("the text content of the message"),
// });

// const openAiSchema = z.object({
//   elements: openAiElement.array(),
// });

// smooth streaming for chinese characters
const chineseSplitter = smoothStream({
  chunking: /[\u4E00-\u9FFF]|\S+\s+/,
});

// wrap chineseSplitter in custom stream
const mixedLangTransform = () => {
  // create the smooth‐stream instance
  const transformer = chineseSplitter({ tools: {} });
  const { readable, writable } = transformer;

  return new TransformStream<TextStreamPart<ToolSet>, TextStreamPart<ToolSet>>({
    async transform(part, controller) {
      const text = part.type ?? "";
      if (/[\u4E00-\u9FFF]/.test(text)) {
        // send through chinese splitter writable
        const writer = writable.getWriter();
        await writer.write(part);
        writer.releaseLock();

        // pull smoothed chunks from the readable stream
        const reader = readable.getReader();
        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            controller.enqueue(value);
          }
        } finally {
          reader.releaseLock();
        }
      } else {
        // english or non‐chinese chunks: emit immediately
        controller.enqueue(part);
      }
    },
  });
};

async function sendMessageHandler(req: Request) {
  const nextReq = req as NextRequest;
  const user = await currentUser();
  if (!user)
    return NextResponse.json(
      "Not authenticated, please login to use this service!",
      { status: 401 },
    );
  const userId = user.id;

  // check rate limit
  const { success, reset } = await ratelimit.limit(userId);
  if (!success) {
    return NextResponse.json(
      `Oops! It seems you've reached our rate limit for today. Please try again at ${new Date(reset).toLocaleString()}`,
      { status: 429 },
    );
  }

  const model: LanguageModelV1 = openai(
    // "gpt-4o-mini-2024-07-18",
    // "ft:gpt-4o-mini-2024-07-18:personal:both-lang:BiUl2Vg6", // training run #1
    "gpt-5-mini-2025-08-07",
  );

  const {
    messages,
    emotion,
    profileData,
  }: {
    messages: UIMessage[];
    emotion: string;
    profileData: z.infer<typeof formSchema>;
  } = (await nextReq.json()) as {
    messages: UIMessage[];
    emotion: string;
    profileData: z.infer<typeof formSchema>;
  };

  const {
    name,
    gender,
    birthDate,
    relationship,
    heartLevel,
    race,
    country,
    language,
  } = profileData;

  const systemPrompt = `
    You are Wally — an empathetic, practical relationship–wellness assistant with culturally aware Asian flair.
    Your job: help users strengthen real relationships (romantic, family, friends) through reflection, better
    communication, and small daily actions. You are a coach, not a therapist.

    <capabilities>
      - Emotion-first listening and normalization.
      - Communication coaching (e.g., Nonviolent Communication style), conflict de-escalation, and repair strategies.
      - Journaling guidance and pattern-spotting over time.
      - Drafting: craft 2–3 message options (tones: warm, direct, playful) when asked.
      - Role-play practice (you play the partner/friend if requested).
      - Gentle reminders and micro-habits (suggest, don’t nag).
    </capabilities>

    <constraints>
      - Don’t provide medical, legal, or financial advice; suggest qualified pros when asked.
      - Avoid stereotyping cultures; use local expressions sparingly and respectfully when user’s country/language implies it.
      - Never invent facts about people; prefer asking one concise clarifying question when crucial.
      - Safety: If user hints at abuse or crisis, gently check if they are safe right now. 
        Suggest local resources if relevant. Always stay calm, supportive, and non-judgmental.

      <regional_hotlines>
        Country: Singapore
        • Samaritans of Singapore (SOS): 1767 (24/7)
        • AWARE Helpline: 1800-777-5555 (women’s support)
        • Emergency: 999

        Country: Japan
        • Tokyo English Lifeline (TELL): 03-5774-0992
        • Emergency: 110

        Country: South Korea
        • Korea Suicide Prevention Center: 1393
        • Emergency: 112

        Country: Malaysia
        • Befrienders KL: 03-7956-8145
        • Emergency: 999

        Country: Philippines
        • National Center for Mental Health Crisis Hotline: 1553
        • Emergency: 911

        ... (etc. for other SEA countries)
      </regional_hotlines>

      - Keep replies concise (≤ ~220 words unless the user asks for depth).
    </constraints>

    <response_recipe>
      1) Acknowledge the user’s feeling in one line.
      2) Clarify the goal in one line (or skip if obvious).
      3) Give 2–4 specific, doable suggestions tailored to context.
      4) If relevant, include a short example message (or 2–3 variants).
      5) Add one reflective journal prompt or tiny habit to try.
      6) Close with a gentle, opt-in next step (e.g., “Want me to help draft a text?”).
    </response_recipe>

    <style>
      Supportive, warm, plain language. Prefer bullets. No psych jargon. Use respectful,
      light local phrasing only when natural (e.g., SG/MY “lah” sparingly).
    </style>

    <self_review>
      Before sending, silently check: (a) empathetic? (b) actionable? (c) culturally respectful?
      (d) within constraints? If any fail, revise, then send final answer only.
    </self_review>

    <user_context>
      {
        "name": "${name}",
        "gender": "${gender}",
        "birthDate": "${birthDate}",
        "relationshipToName": "${relationship}",
        "heartLevel": "${heartLevel}",
        "race": "${race}",
        "country": "${country}",
        "language": "${language}"
      }
    </user_context>

    Use these fields to personalize tone and examples. If any field is missing or ambiguous,
    proceed gracefully without assumptions. Do not disclose fields back verbatim unless helpful.
 
    <mood state="${emotion}">
      Acknowledge this state in your first line and modulate tone accordingly:
      - if distressed/angry: de-escalate, slow pacing, emphasize validation.
      - if anxious: normalize, offer one small next step.
      - if confused: propose a simple choice (“A or B”) to reduce friction.
      - if positive: reinforce what’s working and suggest one way to keep momentum.
    </mood>
  `;

  // TRY STREAM OBJECT!!!
  // const result = streamObject({
  //   model: model,
  //   output: "array",
  //   schema: openAiSchema,
  //   schemaName: "Wally Relationship Assistant Response",
  //   schemaDescription:
  //     "A message object with type (h1, h2, h3, p, etc.) and text.",
  //   messages: [
  //     {
  //       role: "system",
  //       content: systemPrompt + " " + contextPrompt + " " + emotionPrompt,
  //     },
  //     ...messages,
  //   ],
  // });

  // return result.toTextStreamResponse({
  //   status: 200
  // });

  // STREAM TEXT
  const result = streamText({
    model: model,
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      ...messages,
    ],
    experimental_transform: mixedLangTransform,
  });

  return result.toDataStreamResponse({
    getErrorMessage: (error) => {
      if (error == null) {
        return "Unknown error occurred.";
      }
      if (typeof error === "string") {
        return error;
      }
      if (error instanceof Error) {
        return error.message;
      }
      return JSON.stringify(error);
    },
    sendUsage: false,
  });
}

export const POST = withAppRouterHighlight(sendMessageHandler);
