import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OpenAI API key not configured" },
      { status: 503 }
    );
  }
  try {
    const { content, currentTitle } = await req.json();
    if (!content) {
      return NextResponse.json(
        { error: "Content required" },
        { status: 400 }
      );
    }
    const truncated = content.slice(0, 8000);
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an SEO expert. Generate an optimized SEO title (60 chars max) and meta description (155 chars max) for this blog post. Return ONLY valid JSON: {\"title\": \"...\", \"description\": \"...\"}",
        },
        {
          role: "user",
          content: `Current title: ${currentTitle || "Untitled"}\n\nContent:\n${truncated}`,
        },
      ],
      max_tokens: 200,
    });
    const raw = completion.choices[0]?.message?.content?.trim() || "{}";
    let result: { title?: string; description?: string } = {};
    try {
      result = JSON.parse(raw.replace(/```json?\n?|\n?```/g, ""));
    } catch {
      result = {};
    }
    return NextResponse.json({
      title: result.title || currentTitle || "Untitled",
      description: result.description || "",
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to generate SEO" },
      { status: 500 }
    );
  }
}
