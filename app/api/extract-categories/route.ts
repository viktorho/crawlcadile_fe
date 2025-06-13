import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    if (!prompt) {
      return Response.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Use AI to extract categories from the prompt
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system:
        "You are a helpful assistant that extracts 3-5 relevant categories from user prompts. Return ONLY a JSON array of strings with no explanation.",
      prompt: `Extract 3-5 relevant categories from this prompt: "${prompt}"`,
    })

    // Parse the response as JSON
    let categories: string[] = []
    try {
      // Clean the response in case it has markdown code blocks or extra text
      const jsonText = text.replace(/```json|```|\n/g, "").trim()
      categories = JSON.parse(jsonText)
    } catch (error) {
      console.error("Failed to parse categories:", error)
      categories = ["General", "Question", "Information"]
    }

    return Response.json({ categories })
  } catch (error) {
    console.error("Error extracting categories:", error)
    return Response.json({ error: "Failed to extract categories" }, { status: 500 })
  }
}
