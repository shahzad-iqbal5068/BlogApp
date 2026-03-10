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
    const { content, title } = await req.json();
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
            "You are a helpful assistant. Suggest 3-6 relevant tags for this blog post. Return ONLY a JSON array of tag names (lowercase, hyphenated for multi-word). Example: [\"react\", \"nextjs\", \"tutorial\"]",
        },
        {
          role: "user",
          content: `Title: ${title || "Untitled"}\n\nContent:\n${truncated}`,
        },
      ],
      max_tokens: 150,
    });
    const raw = completion.choices[0]?.message?.content?.trim() || "[]";
    let tags: string[] = [];
    try {
      tags = JSON.parse(raw.replace(/```json?\n?|\n?```/g, ""));
      if (!Array.isArray(tags)) tags = [];
    } catch {
      tags = raw.split(",").map((t) => t.trim().replace(/^["']|["']$/g, ""));
    }
    return NextResponse.json({ tags });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to generate tags" },
      { status: 500 }
    );
  }
}
