import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY, dangerouslyAllowBrowser: true
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

      return response.content[0].type === 'text' 
        ? response.content[0].text 
        : "I couldn't process your request. Please try again."
    } catch (error) {
      console.error('Claude API error:', error)
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

      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1500,
        temperature: 0.2,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })

      return response.content[0].type === 'text' 
        ? response.content[0].text 
        : "Could not analyze document."
    } catch (error) {
      console.error('Document analysis error:', error)
      throw new Error('Failed to analyze document.')
    }
  }

  async generateProjectInsights(projectData: any) {
    try {
      const prompt = `Analyze this construction project data and provide insights:

Project: ${projectData.name}
Status: ${projectData.status}
Budget: ${projectData.budget}
Timeline: ${projectData.timeline}
Team: ${projectData.team}
Recent Activity: ${JSON.stringify(projectData.recentActivity)}

Provide:
1. Project health assessment
2. Risk identification
3. Optimization recommendations
4. Next steps suggestions`

      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1200,
        temperature: 0.3,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })

      return response.content[0].type === 'text' 
        ? response.content[0].text 
        : "Could not generate insights."
    } catch (error) {
      console.error('Project insights error:', error)
      throw new Error('Failed to generate project insights.')
    }
  }
}

export const documentChatService = new DocumentChatService()