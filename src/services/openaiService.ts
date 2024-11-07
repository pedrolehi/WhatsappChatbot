import OpenAI from "openai";
import { openAIResponseSchema } from "@/schemas/openaiSchema";
import { z } from "zod";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function getOpenAIResponse(userMessage: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: "chatgpt-4o-latest",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: userMessage },
      ],
    });

    const responseMessage = completion.choices[0]?.message?.content;

    const validResponse = openAIResponseSchema.parse(responseMessage);

    return validResponse;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation error: ", error.errors);
    }
    console.error("Error trying to retrieve OpenAI answer: ", error);
    throw new Error("Error trying to retrieve OpenAI answer.");
  }
}
