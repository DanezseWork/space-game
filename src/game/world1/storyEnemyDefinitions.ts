import type { StoryEnemyAppearanceId } from './storyEnemyAppearances';

export type StoryEnemyBehavior =
  | 'driftLaser'
  | 'homing'
  | 'zigzagDive'
  | 'playerDive'
  | 'lateralLaser'
  | 'spreadFire'
  | 'fanFire'
  | 'patrolDash'
  | 'hybridHunter';

export interface StoryEnemyDefinition {
  level: number;
  enemyName: string;
  themeId: string;
  textureKey: string;
  appearanceId: StoryEnemyAppearanceId;
  health: number;
  bodyDamage: number;
  points: number;
  hitRadius: number;
  behavior: StoryEnemyBehavior;
  spawnIntervalMs: number;
  maxOnScreen: number;
  moveSpeed: number;
  fireCooldownMs?: number;
  spreadDeg?: number;
  shotCount?: number;
}

export const STORY_ENEMY_DEFINITIONS: Record<number, StoryEnemyDefinition> = {
  1: {
    level: 1,
    enemyName: 'Orbital Probe',
    themeId: 'earth',
    textureKey: 'story-enemy-earth',
    appearanceId: 'orbitalProbe',
    health: 1,
    bodyDamage: 3,
    points: 12,
    hitRadius: 10,
    behavior: 'driftLaser',
    spawnIntervalMs: 9000,
    maxOnScreen: 2,
    moveSpeed: 55,
    fireCooldownMs: 2800,
  },
  2: {
    level: 2,
    enemyName: 'Lunar Mite',
    themeId: 'moon',
    textureKey: 'story-enemy-moon',
    appearanceId: 'lunarMite',
    health: 1,
    bodyDamage: 3,
    points: 14,
    hitRadius: 10,
    behavior: 'homing',
    spawnIntervalMs: 8500,
    maxOnScreen: 2,
    moveSpeed: 70,
  },
  3: {
    level: 3,
    enemyName: 'Acid Skimmer',
    themeId: 'venus',
    textureKey: 'story-enemy-venus',
    appearanceId: 'acidSkimmer',
    health: 1,
    bodyDamage: 4,
    points: 16,
    hitRadius: 10,
    behavior: 'zigzagDive',
    spawnIntervalMs: 8000,
    maxOnScreen: 3,
    moveSpeed: 110,
  },
  4: {
    level: 4,
    enemyName: 'Solar Dart',
    themeId: 'mercury',
    textureKey: 'story-enemy-mercury',
    appearanceId: 'solarDart',
    health: 1,
    bodyDamage: 4,
    points: 18,
    hitRadius: 9,
    behavior: 'playerDive',
    spawnIntervalMs: 7500,
    maxOnScreen: 3,
    moveSpeed: 140,
  },
  5: {
    level: 5,
    enemyName: 'Dust Strider',
    themeId: 'mars',
    textureKey: 'story-enemy-mars',
    appearanceId: 'dustStrider',
    health: 2,
    bodyDamage: 4,
    points: 20,
    hitRadius: 12,
    behavior: 'lateralLaser',
    spawnIntervalMs: 8000,
    maxOnScreen: 2,
    moveSpeed: 45,
    fireCooldownMs: 3000,
    spreadDeg: 12,
    shotCount: 2,
  },
  6: {
    level: 6,
    enemyName: 'Shard Stalker',
    themeId: 'beltEntry',
    textureKey: 'story-enemy-belt-entry',
    appearanceId: 'shardStalker',
    health: 2,
    bodyDamage: 4,
    points: 22,
    hitRadius: 11,
    behavior: 'homing',
    spawnIntervalMs: 7000,
    maxOnScreen: 3,
    moveSpeed: 100,
  },
  7: {
    level: 7,
    enemyName: 'Rock Spitter',
    themeId: 'vesta',
    textureKey: 'story-enemy-vesta',
    appearanceId: 'rockSpitter',
    health: 2,
    bodyDamage: 4,
    points: 25,
    hitRadius: 12,
    behavior: 'spreadFire',
    spawnIntervalMs: 7500,
    maxOnScreen: 2,
    moveSpeed: 40,
    fireCooldownMs: 3200,
    spreadDeg: 18,
    shotCount: 3,
  },
  8: {
    level: 8,
    enemyName: 'Silk Weaver',
    themeId: 'pallas',
    textureKey: 'story-enemy-pallas',
    appearanceId: 'silkWeaver',
    health: 2,
    bodyDamage: 5,
    points: 28,
    hitRadius: 12,
    behavior: 'fanFire',
    spawnIntervalMs: 7000,
    maxOnScreen: 2,
    moveSpeed: 35,
    fireCooldownMs: 3000,
    spreadDeg: 10,
    shotCount: 5,
  },
  9: {
    level: 9,
    enemyName: 'Frost Leech',
    themeId: 'ceres',
    textureKey: 'story-enemy-ceres',
    appearanceId: 'frostLeech',
    health: 2,
    bodyDamage: 5,
    points: 30,
    hitRadius: 11,
    behavior: 'patrolDash',
    spawnIntervalMs: 6500,
    maxOnScreen: 3,
    moveSpeed: 60,
  },
  10: {
    level: 10,
    enemyName: 'Belt Raider',
    themeId: 'beltFinale',
    textureKey: 'story-enemy-belt-finale',
    appearanceId: 'beltRaider',
    health: 3,
    bodyDamage: 5,
    points: 35,
    hitRadius: 12,
    behavior: 'hybridHunter',
    spawnIntervalMs: 6000,
    maxOnScreen: 3,
    moveSpeed: 80,
    fireCooldownMs: 3500,
  },
};

export function getStoryEnemyDefinition(level: number): StoryEnemyDefinition {
  return STORY_ENEMY_DEFINITIONS[level] ?? STORY_ENEMY_DEFINITIONS[1];
}
