import { GoogleGenerativeAI } from '@google/generative-ai';

export async function generateRoadmap(topic: string, apiKey: string) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

  const prompt = `
    You are an expert academic curator. Generate an EXHAUSTIVE and RIGOROUS academic reading roadmap for the topic: "${topic}".
    
    The roadmap must trace a path from absolute fundamentals to cutting-edge research.
    
    Requirements for Content:
    1. PEDAGOGICAL: Include the definitive, gold-standard textbooks and classic courses for each level.
    2. SEMINAL: Include the foundational, history-making papers or books that established the field.
    3. BREAKTHROUGH: Include the key papers that significantly advanced or pivoted the field in the last 20-30 years.
    4. RESEARCH: Include specialized, advanced papers that represent the current research frontier.

    Difficulty Levels to Use:
    - "beginner": Core fundamentals, undergraduate level.
    - "intermediate": Specialized undergraduate or early graduate level.
    - "advanced": Late graduate level, deep mastery.
    - "research": Cutting-edge papers, current frontier, specialized sub-topics.

    Structure the roadmap as a Directed Acyclic Graph (DAG). Edges MUST represent logical learning dependencies (e.g., you must understand A to appreciate B).
    
    Provide at least 15-25 nodes for a truly comprehensive roadmap.

    Return ONLY a valid JSON object with the following structure:
    {
      "nodes": [
        {
          "id": "unique_id",
          "label": "Full Title of the Work",
          "author": "Full Author List",
          "year": "Publication Year",
          "type": "seminal" | "breakthrough" | "pedagogical" | "research",
          "level": "beginner" | "intermediate" | "advanced" | "research",
          "description": "A detailed 2-3 sentence explanation of why this work is essential."
        }
      ],
      "edges": [
        { "source": "node_id_1", "target": "node_id_2" }
      ],
      "gapAnalysis": {
        "omissions": [
          { "title": "Work Title", "reason": "Why it was omitted (e.g., too specialized, redundant with X, etc.)" }
        ],
        "alternativePaths": [
          { "standard": "Book A", "alternative": "Book B", "note": "Why one might prefer the alternative" }
        ],
        "researchFrontiers": [
          "List of 3-5 ultra-niche or very recent topics not covered in the main graph"
        ]
      },
      "canonAssurance": {
        "coverageScore": "An honest percentage based ONLY on the works selected vs the theoretical ideal of a complete mastery path.",
        "corePillars": [
          { "pillar": "Name of fundamental sub-concept", "coveredBy": "Title of work in the nodes", "status": "verified" | "partial" }
        ],
        "expertConfidence": "A percentage representing your genuine confidence as an expert curator. Be critical—if the topic is emerging or controversial, the score should be lower.",
        "criticalEvaluation": "A 2-3 sentence candid assessment of the bibliography's limitations. Explain exactly why the coverage score is not 100%."
      }
    }

    CRITICAL INSTRUCTION: Do not default to high scores like 95%+. If a field is vast, emerging, or has no single consensus, reflect that with lower, more realistic scores. Be a skeptical, elite academic peer-reviewer.
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  console.log('Gemini raw response:', text);
  
  // Extract JSON from potential markdown formatting
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error('Failed to find JSON in response');
    throw new Error('Failed to parse JSON from Gemini response');
  }
  
  try {
    const parsed = JSON.parse(jsonMatch[0]);
    console.log('Parsed Roadmap Data:', JSON.stringify(parsed, null, 2));
    return parsed;
  } catch (e) {
    console.error('JSON Parse Error:', e);
    throw new Error('Invalid JSON structure returned from AI');
  }
}
