import { GoogleGenerativeAI } from '@google/generative-ai';

export async function generateRoadmap(topic: string, apiKey: string) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
    Generate a detailed academic reading roadmap for the topic: "${topic}".
    The roadmap should include:
    1. Seminal works (foundational papers or books).
    2. Breakthrough works (key advancements).
    3. Pedagogical resources (textbooks, classic courses).
    
    Structure the roadmap as a directed acyclic graph (DAG) representing a learning path from Beginner to Intermediate to Advanced.
    
    Return ONLY a valid JSON object with the following structure:
    {
      "nodes": [
        {
          "id": "unique_id",
          "label": "Title of work/resource",
          "author": "Author(s)",
          "year": "Year of publication",
          "type": "seminal" | "breakthrough" | "pedagogical",
          "level": "beginner" | "intermediate" | "advanced",
          "description": "Brief summary of importance"
        }
      ],
      "edges": [
        { "source": "node_id_1", "target": "node_id_2" }
      ]
    }
    
    Ensure the edges represent logical learning dependencies (e.g., read A before B).
    Provide at least 8-12 nodes for a comprehensive roadmap.
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  // Extract JSON from potential markdown formatting
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse JSON from Gemini response');
  }
  
  return JSON.parse(jsonMatch[0]);
}
