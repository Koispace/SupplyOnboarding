/**
 * Deterministic mock for AI extraction pipeline (Phase 2B v1).
 * Returns a consistent payload for parsed label data to avoid invalid product analysis.
 */
export function getMockAIExtractionResult() {
  return {
    nutrition: {
      energyKcal: 350,
      proteinG: 25,
      carbsG: 45,
      sugarsG: 2,
      addedSugarG: 0,
      fibreG: 8,
      totalFatG: 5,
      sodiumMg: 150
    },
    ingredients: [
      "Whey Protein Isolate",
      "Oat Flour",
      "Almond Butter",
      "Stevia Extract",
      "Natural Flavor"
    ],
    flags: [
      {
        severity: "warning",
        message: "Check 'Zero Added Sugar' claim against Stevia Extract presence."
      }
    ],
    confidence: 0.94,
    healthScore: 85
  }
}
