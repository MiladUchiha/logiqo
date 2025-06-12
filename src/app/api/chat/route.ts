import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { query, projectId, documentContext } = await request.json()

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

    const systemPrompt = `You are ConstructFlow AI, an expert construction project assistant. You help project managers, foremen, and construction teams understand their project documents and make informed decisions.

${documentContext ? `Context from project documents:\n${documentContext}\n` : ''}

Guidelines:
- Provide clear, actionable answers about construction projects
- Reference specific document sections when available
- Highlight safety considerations when relevant
- Suggest next steps or follow-up actions
- Use construction industry terminology appropriately
- If you're unsure about something, say so and suggest consulting with experts`

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1000,
      temperature: 0.1,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: query
        }
      ]
    })

    const content = response.content[0]
    const responseText = content.type === 'text' 
      ? content.text 
      : "I couldn't process your request. Please try again."

    return NextResponse.json({ response: responseText })

  } catch (error) {
    console.error('Claude API error:', error)
    return NextResponse.json(
      { error: 'Failed to process your question. Please try again.' },
      { status: 500 }
    )
  }
}