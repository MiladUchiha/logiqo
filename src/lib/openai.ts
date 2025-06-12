import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export class DocumentChatService {
  async processQuery(query: string, projectId: string, documentContext?: string) {
    try {
      const systemPrompt = `You are ConstructFlow AI, an expert construction project assistant. You help project managers, foremen, and construction teams understand their project documents and make informed decisions.

${documentContext ? `Context from project documents:\n${documentContext}\n` : ''}

Guidelines:
- Provide clear, actionable answers about construction projects
- Reference specific document sections when available
- Highlight safety considerations when relevant
- Suggest next steps or follow-up actions
- Use construction industry terminology appropriately
- If you're unsure about something, say so and suggest consulting with experts`

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: query
          }
        ],
        temperature: 0.1,
        max_tokens: 1000,
      })

      return response.choices[0].message.content || "I couldn't process your request. Please try again."
    } catch (error) {
      console.error('OpenAI API error:', error)
      throw new Error('Failed to process your question. Please try again.')
    }
  }

  async analyzeDocument(documentText: string, documentType: string) {
    try {
      const prompt = `Analyze this ${documentType} construction document and extract key information:

Document content:
${documentText}

Please provide:
1. Document summary
2. Key dates and deadlines
3. Important specifications or requirements
4. Cost-related information
5. Safety considerations
6. Action items or next steps

Format your response in a clear, structured way.`

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
        max_tokens: 1500,
      })

      return response.choices[0].message.content || "Could not analyze document."
    } catch (error) {
      console.error('Document analysis error:', error)
      throw new Error('Failed to analyze document.')
    }
  }
}

export const documentChatService = new DocumentChatService()