import { createGroq } from "@ai-sdk/groq";

const apiKey = process.env.GROQ_API_KEY || process.env.GROQ_API;

if (!apiKey) {
  throw new Error("Missing Groq API Key environment variable (GROQ_API_KEY or GROQ_API) in configuration.");
}

// Export the Groq provider instance configured with the correct key
export const groq = createGroq({
  apiKey,
});
