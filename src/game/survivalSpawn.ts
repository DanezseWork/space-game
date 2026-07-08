import Phaser from 'phaser';
import { getEscalationLevel } from './difficulty';
import { getStoryEnemyDefinition } from './world1/storyEnemyDefinitions';
import type { StoryEnemyDefinition } from './world1/storyEnemyDefinitions';

const STORY_ENEMY_UNLOCK_SCORES: Record<number, number> = {
  1: 3000,
  2: 5000,
  3: 7000,
  4: 9000,
  5: 11000,
  6: 13000,
  7: 15000,
  8: 17000,
  9: 19000,
  10: 21000,
};

const SURVIVAL_BOSS_FIRST_SCORE = 8000;
const SURVIVAL_BOSS_SCORE_STEP = 4000;
const SURVIVAL_BOSS_MAX_LEVEL = 10;

const SURVIVAL_BOSS_BASE_DELAY_MS = 90_000;
const SURVIVAL_BOSS_MIN_DELAY_MS = 45_000;
const STORY_ENEMY_BASE_INTERVAL_MS = 10_000;
const STORY_ENEMY_MIN_INTERVAL_MS = 5000;

function getStoryEnemyScale(score: number): number {
  const escalation = getEscalationLevel(score);
  return Math.min(2, 1 + escalation * 0.1);
}

export function getUnlockedStoryEnemyLevels(score: number): number[] {
  const levels: number[] = [];
  for (let level = 1; level <= 10; level++) {
    if (score >= STORY_ENEMY_UNLOCK_SCORES[level]) {
      levels.push(level);
    }
  }
  return levels;
}

export function getMaxStoryEnemiesOnScreen(level: number, score: number): number {
  const base = getStoryEnemyDefinition(level).maxOnScreen;
  const bonus = Math.floor(getEscalationLevel(score) / 2);
  return base + bonus;
}

export function getStoryEnemySpawnInterval(score: number): number {
  const escalation = getEscalationLevel(score);
  return Math.max(STORY_ENEMY_MIN_INTERVAL_MS, STORY_ENEMY_BASE_INTERVAL_MS - escalation * 800);
}

function getStoryEnemyWeight(level: number, score: number): number {
  const unlocked = getUnlockedStoryEnemyLevels(score);
  if (!unlocked.includes(level)) return 0;

  const index = unlocked.indexOf(level);
  const tierBonus = index + 1;
  const escalation = getEscalationLevel(score);
  return 2 + tierBonus + Math.floor(escalation / 2);
}

export function pickStoryEnemyToSpawn(
  score: number,
  countsByLevel: Record<number, number>,
): number | null {
  const unlocked = getUnlockedStoryEnemyLevels(score);
  if (unlocked.length === 0) return null;

  const candidates = unlocked.filter(
    (level) => (countsByLevel[level] ?? 0) < getMaxStoryEnemiesOnScreen(level, score),
  );
  if (candidates.length === 0) return null;

  const weighted: number[] = [];
  for (const level of candidates) {
    const weight = getStoryEnemyWeight(level, score);
    for (let i = 0; i < weight; i++) weighted.push(level);
  }

  if (weighted.length === 0) return null;
  return weighted[Phaser.Math.Between(0, weighted.length - 1)];
}

export function scaleStoryEnemyDefinition(
  definition: StoryEnemyDefinition,
  score: number,
): StoryEnemyDefinition {
  const scale = getStoryEnemyScale(score);
  return {
    ...definition,
    health: Math.max(1, Math.round(definition.health * scale)),
    bodyDamage: Math.max(1, Math.round(definition.bodyDamage * scale)),
    moveSpeed: Math.round(definition.moveSpeed * Math.min(1.5, scale)),
  };
}

export function getMaxUnlockedBossLevel(score: number): number {
  if (score < SURVIVAL_BOSS_FIRST_SCORE) return 0;
  const unlocked = 1 + Math.floor((score - SURVIVAL_BOSS_FIRST_SCORE) / SURVIVAL_BOSS_SCORE_STEP);
  return Math.min(SURVIVAL_BOSS_MAX_LEVEL, unlocked);
}

export function getSurvivalBossSpawnDelayMs(score: number, _bossesDefeated: number): number {
  const escalation = getEscalationLevel(score);
  return Math.max(SURVIVAL_BOSS_MIN_DELAY_MS, SURVIVAL_BOSS_BASE_DELAY_MS - escalation * 5000);
}

export function pickSurvivalBossLevel(score: number, _bossesDefeated: number): number | null {
  const maxLevel = getMaxUnlockedBossLevel(score);
  if (maxLevel === 0) return null;

  const weighted: number[] = [];
  for (let level = 1; level <= maxLevel; level++) {
    const weight = 1 + Math.floor(level / 2);
    for (let i = 0; i < weight; i++) weighted.push(level);
  }

  if (weighted.length === 0) return null;
  return weighted[Phaser.Math.Between(0, weighted.length - 1)];
}

export function getStoryEnemyUnlockScore(level: number): number {
  return STORY_ENEMY_UNLOCK_SCORES[level] ?? 0;
}

export function getSurvivalBossUnlockScore(level: number): number {
  if (level <= 0 || level > SURVIVAL_BOSS_MAX_LEVEL) return 0;
  return SURVIVAL_BOSS_FIRST_SCORE + (level - 1) * SURVIVAL_BOSS_SCORE_STEP;
}

export function computeSurvivalBossPoints(basePoints: number, score: number): number {
  const escalation = getEscalationLevel(score);
  const bonus = Math.floor(basePoints * escalation * 0.08);
  return basePoints + bonus;
}
