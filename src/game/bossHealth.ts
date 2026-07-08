export function computeBossHealth(baseHealth: number, powerScore: number): number {
  const scaled = Math.round(baseHealth * (1 + powerScore * 0.12));
  return Math.min(Math.max(scaled, baseHealth), baseHealth * 4);
}

export function computeSurvivalBossHealth(
  baseHealth: number,
  powerScore: number,
  score: number,
): number {
  const powerScaled = computeBossHealth(baseHealth, powerScore);
  const scoreFactor = 1 + Math.floor(score / 5000) * 0.05;
  const scaled = Math.round(powerScaled * Math.min(scoreFactor, 1.5));
  return Math.min(Math.max(scaled, baseHealth), baseHealth * 6);
}
