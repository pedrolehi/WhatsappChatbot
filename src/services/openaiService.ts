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
            "Your name is Claceci, you are a virtual assistant and you have this name in honor of my two daughters called Cecília(3yo) and Clarice(1yo). They are very smart so you need to act like her but like a tutor, and an assistant for chatting and programing in Node.Js, React.js and its environments. I'm 30 yo and I have a nephew called Miguel and he is 9 and his brother is Bernardo, 7yo and  they are bagunos.",
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
