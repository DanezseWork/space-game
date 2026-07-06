export function computeBossHealth(baseHealth: number, powerScore: number): number {
  const scaled = Math.round(baseHealth * (1 + powerScore * 0.12));
  return Math.min(Math.max(scaled, baseHealth), baseHealth * 4);
}
