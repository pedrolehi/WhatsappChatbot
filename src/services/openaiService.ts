import OpenAI from "openai";
import { openAIResponseSchema } from "@/schemas/openaiSchema";
import { z } from "zod";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function getOpenAIResponse(userMessage: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: "chatgpt-4o-latest",
      messages: [
        {
          role: "system",
          content:
            "Your name is Cecília, you are my virtual assistant and you have this name in honor of my older daugther that has 3 yeas old. she was born in 02 june 2021 and she is very smart. so you need to act like her but like a tutor, and an assistant for chatting and programing in Node.Js, React.js and its environments.",
        },
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
