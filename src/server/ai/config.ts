import "server-only";

import { OpenAI } from "openai";
import { env } from "~/env-server";

const openAi = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export default openAi;
