export const LOOT_MILESTONE_STEP = 1000;

export function getNextLootMilestone(lastClaimed: number): number {
  return lastClaimed + LOOT_MILESTONE_STEP;
}

export function shouldSpawnLootAtScore(score: number, nextLootMilestone: number): boolean {
  return score >= nextLootMilestone;
}
