export class DocumentChatService {
  async processQuery(query: string, projectId: string, documentContext?: string) {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          projectId,
          documentContext
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get response from AI')
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      return data.response
    } catch (error) {
      console.error('Chat service error:', error)
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

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: prompt,
          projectId: 'analysis'
        })
      })

      if (!response.ok) {
        throw new Error('Failed to analyze document')
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      return data.response
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

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: prompt,
          projectId: projectData.id || 'insights'
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate insights')
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      return data.response
    } catch (error) {
      console.error('Project insights error:', error)
      throw new Error('Failed to generate project insights.')
    }
  }
}

export const documentChatService = new DocumentChatService()