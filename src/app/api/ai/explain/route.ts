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
    const { content } = await req.json();
    if (!content) {
      return NextResponse.json(
        { error: "Content required" },
        { status: 400 }
      );
    }
    const truncated = content.slice(0, 12000);
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful teacher. Explain this blog post in simple words that anyone can understand. Use analogies and avoid jargon. Keep it to 2-3 short paragraphs.",
        },
        { role: "user", content: truncated },
      ],
      max_tokens: 500,
    });
    const explanation =
      completion.choices[0]?.message?.content?.trim() ||
      "Unable to generate explanation.";
    return NextResponse.json({ explanation });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to generate explanation" },
      { status: 500 }
    );
  }
}
