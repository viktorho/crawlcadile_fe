// This is a simplified version of what would typically be an AI-powered service
// In a real application, this would call an API endpoint that uses NLP or LLMs

// Keywords to categories mapping
const keywordMap: Record<string, string[]> = {
  // Technical categories
  code: ["Programming", "Development", "Technical"],
  programming: ["Programming", "Development", "Technical"],
  javascript: ["JavaScript", "Programming", "Web Development"],
  python: ["Python", "Programming", "Data Science"],
  api: ["API", "Development", "Technical"],
  database: ["Database", "Technical", "Data"],
  sql: ["SQL", "Database", "Technical"],
  html: ["HTML", "Web Development", "Frontend"],
  css: ["CSS", "Web Development", "Design"],
  react: ["React", "JavaScript", "Frontend"],
  node: ["Node.js", "JavaScript", "Backend"],

  // Creative categories
  design: ["Design", "Creative", "Visual"],
  story: ["Writing", "Creative", "Content"],
  write: ["Writing", "Content", "Creative"],
  art: ["Art", "Creative", "Visual"],
  music: ["Music", "Creative", "Audio"],
  video: ["Video", "Creative", "Content"],
  image: ["Image", "Visual", "Creative"],

  // Business categories
  business: ["Business", "Professional", "Strategy"],
  marketing: ["Marketing", "Business", "Strategy"],
  sales: ["Sales", "Business", "Revenue"],
  startup: ["Startup", "Business", "Entrepreneurship"],
  finance: ["Finance", "Business", "Money"],
  investment: ["Investment", "Finance", "Business"],

  // Academic categories
  research: ["Research", "Academic", "Science"],
  science: ["Science", "Academic", "Research"],
  history: ["History", "Academic", "Humanities"],
  math: ["Mathematics", "Academic", "Science"],
  physics: ["Physics", "Science", "Academic"],
  biology: ["Biology", "Science", "Academic"],
  chemistry: ["Chemistry", "Science", "Academic"],
  literature: ["Literature", "Academic", "Humanities"],

  // AI specific
  ai: ["AI", "Machine Learning", "Technical"],
  "machine learning": ["Machine Learning", "AI", "Data Science"],
  neural: ["Neural Networks", "AI", "Machine Learning"],
  gpt: ["GPT", "AI", "Language Models"],

  // General topics
  help: ["Help", "Assistance", "General"],
  explain: ["Explanation", "Learning", "General"],
  "how to": ["How-to", "Tutorial", "Learning"],
  "what is": ["Definition", "Learning", "General"],
  why: ["Explanation", "Learning", "General"],
}

export async function extractCategories(prompt: string): Promise<string[]> {
  // Convert prompt to lowercase for case-insensitive matching
  const lowerPrompt = prompt.toLowerCase()

  // Set to store unique categories
  const categoriesSet = new Set<string>()

  // Check for each keyword in the prompt
  Object.entries(keywordMap).forEach(([keyword, categories]) => {
    if (lowerPrompt.includes(keyword)) {
      // Add the first (most relevant) category from the mapping
      categoriesSet.add(categories[0])

      // Optionally add the second category if available
      if (categories.length > 1) {
        categoriesSet.add(categories[1])
      }
    }
  })

  // If no categories were found, return default ones
  if (categoriesSet.size === 0) {
    return ["General", "Question", "Information"]
  }

  // Convert set to array and limit to 5 categories
  return Array.from(categoriesSet).slice(0, 5)
}

// For more advanced implementations, you could:
// 1. Use TF-IDF to find important keywords
// 2. Use embeddings to find semantic similarity to category descriptions
// 3. Call an actual LLM to analyze the text and suggest categories
