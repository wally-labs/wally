import openAi from "./config";

export async function embedVector(text: string) {
  const embedding = await openAi.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });

  return embedding;
}
