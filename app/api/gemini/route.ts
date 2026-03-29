import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextRequest, NextResponse } from "next/server"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-04-17" })

export async function POST(req: NextRequest) {
  try {
    const { prompt, type } = await req.json()
    
    if (!prompt) {
      return NextResponse.json(
        { error: "No prompt provided", content: null },
        { status: 400 }
      )
    }

    const result = await model.generateContent(prompt)
    const text = result.response.text()
    
    return NextResponse.json({ content: text, type })
    
  } catch (error) {
    console.error("Gemini API error:", error)
    return NextResponse.json(
      { error: "Gemini call failed", content: null },
      { status: 500 }
    )
  }
}
