import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: Request) {
  try {
    const { prompt, category } = await req.json()

    if (!prompt) {
      return Response.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Add category context to the system prompt
    let systemPrompt = "You are a helpful AI assistant."

    switch (category) {
      case "Creative":
        systemPrompt = "You are a creative AI assistant specializing in imaginative and artistic content."
        break
      case "Technical":
        systemPrompt =
          "You are a technical AI assistant specializing in programming, engineering, and technical topics."
        break
      case "Business":
        systemPrompt = "You are a business AI assistant specializing in professional advice and business strategies."
        break
      case "Academic":
        systemPrompt = "You are an academic AI assistant specializing in educational content and research."
        break
      // Default system prompt is already set
    }

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      prompt: prompt,
    })

    return Response.json({ text })
  } catch (error) {
    console.error("Error generating text:", error)
    return Response.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
