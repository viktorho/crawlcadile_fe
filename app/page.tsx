"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Send, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { extractCategories } from "@/lib/category-extractor"

// Default categories as fallback
const defaultCategories = ["General", "Creative", "Technical", "Business", "Academic"]

export default function Home() {
  const [prompt, setPrompt] = useState("")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [suggestedCategories, setSuggestedCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState("General")
  const [conversation, setConversation] = useState<Array<{ role: string; content: string; category?: string }>>([])

  // Analyze prompt for categories when it changes
  useEffect(() => {
    const analyzePrompt = async () => {
      if (prompt.trim().length > 10) {
        setIsAnalyzing(true)

        // In a real app, this would call an AI service
        // For now, we'll simulate with our local function
        const categories = await extractCategories(prompt)
        setSuggestedCategories(categories)

        setIsAnalyzing(false)
      } else {
        setSuggestedCategories([])
      }
    }

    const debounceTimer = setTimeout(analyzePrompt, 500)
    return () => clearTimeout(debounceTimer)
  }, [prompt])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!prompt.trim()) return

    setIsLoading(true)

    // Add user message to conversation
    setConversation((prev) => [
      ...prev,
      {
        role: "user",
        content: prompt,
        category: selectedCategory,
      },
    ])

    try {
      // Here you would integrate with your AI backend
      // For demonstration, we'll simulate a response
      setTimeout(() => {
        const aiResponse = `Here's my response to your ${selectedCategory.toLowerCase()} query about "${prompt}". I've analyzed your question and provided relevant information based on the context.`

        // Add AI response to conversation
        setConversation((prev) => [
          ...prev,
          {
            role: "assistant",
            content: aiResponse,
          },
        ])

        setResponse(aiResponse)
        setIsLoading(false)
        setPrompt("")

        // Reset categories after submission
        setSuggestedCategories([])
      }, 1000)
    } catch (error) {
      console.error("Error generating response:", error)
      setResponse("Sorry, there was an error processing your request.")
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-3xl p-6 shadow-lg mb-4">
        <h1 className="text-2xl font-bold text-center mb-6">AI Assistant</h1>

        {/* Conversation History */}
        <div className="mb-6 space-y-4 max-h-[400px] overflow-y-auto">
          {conversation.map((message, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${
                message.role === "user" ? "bg-blue-50 dark:bg-blue-900/20 ml-8" : "bg-gray-50 dark:bg-gray-800 mr-8"
              }`}
            >
              <div className="flex items-center mb-1">
                <span className="font-medium">{message.role === "user" ? "You" : "AI Assistant"}</span>
                {message.category && (
                  <Badge variant="outline" className="ml-2 text-xs">
                    {message.category}
                  </Badge>
                )}
              </div>
              <p className="text-sm">{message.content}</p>
            </div>
          ))}
          {isLoading && (
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg mr-8">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-150"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-300"></div>
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Category Selection */}
        {suggestedCategories.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <Sparkles className="h-4 w-4 mr-2 text-yellow-500" />
              <h2 className="text-sm font-medium">Suggested categories:</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestedCategories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="rounded-full text-xs"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Prompt Input */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Textarea
              placeholder="Enter your prompt here..."
              className="min-h-[120px] resize-none pr-12"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            {isAnalyzing && (
              <div className="absolute top-2 right-12">
                <div className="w-4 h-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
              </div>
            )}
            <Button
              type="submit"
              size="icon"
              className="absolute bottom-3 right-3"
              disabled={isLoading || !prompt.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </Card>
    </main>
  )
}
