import Anthropic from '@anthropic-ai/sdk';
import { AnalysisResult } from '@/types';

export const client = new Anthropic();

export const FOOD_ANALYSIS_PROMPT = `You are a precise nutritional analysis assistant. Analyze the food in this image and identify every distinct food item visible.

For each food item, estimate:
- The name of the food
- The quantity/portion size (be specific: "1 cup", "200g", "1 medium slice", "2 tablespoons")
- Calories (kcal)
- Protein in grams
- Carbohydrates in grams
- Fat in grams
- Your confidence level (0.0 = very uncertain, 1.0 = very certain)

Important rules:
1. Base estimates on typical restaurant/home serving sizes visible in the image
2. If you can see a plate, hand, or utensil for scale reference, use it
3. When uncertain about a sauce, dressing, or cooking oil, include a conservative estimate as a separate item
4. Do NOT make up foods that are not clearly visible
5. Be realistic about portion sizes — don't over-estimate
6. Respond ONLY with valid JSON in this exact format, with no preamble or trailing text:

\`\`\`json
{
  "foodItems": [
    {
      "name": "Grilled chicken breast",
      "quantity": "1 medium (170g)",
      "calories": 280,
      "proteinG": 53,
      "carbsG": 0,
      "fatG": 6,
      "confidence": 0.9
    }
  ],
  "overallConfidence": 0.85,
  "notes": "Portion size estimated from plate context."
}
\`\`\``;

export function parseClaudeResponse(rawText: string): AnalysisResult {
  // Try JSON code block first
  const codeBlockMatch = rawText.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
  if (codeBlockMatch) {
    try {
      return JSON.parse(codeBlockMatch[1]);
    } catch {}
  }

  // Try bare JSON object
  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch {}
  }

  throw new Error('Could not parse nutrition data from AI response. Please try a clearer photo.');
}
