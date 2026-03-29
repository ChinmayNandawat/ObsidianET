import { NextRequest, NextResponse } from "next/server"
import { Groq } from 'groq-sdk';

export async function POST(req: NextRequest) {
  try {
    const { prompt, type } = await req.json()

    if (!prompt) {
      return NextResponse.json(
        { error: "No prompt provided", content: null },
        { status: 400 }
      )
    }

    const apiKey = process.env.GROQ_API_KEY?.replace(/"/g, '').trim();
    if (!apiKey) {
      throw new Error("Missing GROQ_API_KEY.");
    }
    
    const groq = new Groq({ apiKey });

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt + "\n\nReturn strictly JSON format." }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      response_format: { type: "json_object" }
    });

    const text = completion.choices[0]?.message?.content || '{}';

    return NextResponse.json({ content: text, type })

  } catch (error) {
    console.error("Groq API error:", error)
    return NextResponse.json(
      { error: "AI call failed", content: null },
      { status: 500 }
    )
  }
}
