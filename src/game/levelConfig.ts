export interface BossLevelConfig {
  spawnMs: number;
  health: number;
  bodyDamage: number;
  fireCooldown: number;
  coinReward: number;
  points: number;
  velocityY: number;
  /** Fire a spread every N shots (0 = never). */
  fanEvery: number;
  fanSpreadDeg: number;
  fanCount: number;
}

export const BOSS_LEVEL_CONFIG: Record<number, BossLevelConfig> = {
  1: {
    spawnMs: 120_000,
    health: 60,
    bodyDamage: 6,
    fireCooldown: 2000,
    coinReward: 100,
    points: 500,
    velocityY: 55,
    fanEvery: 3,
    fanSpreadDeg: 18,
    fanCount: 5,
  },
  2: {
    spawnMs: 180_000,
    health: 70,
    bodyDamage: 6,
    fireCooldown: 1900,
    coinReward: 120,
    points: 600,
    velocityY: 55,
    fanEvery: 3,
    fanSpreadDeg: 18,
    fanCount: 5,
  },
  3: {
    spawnMs: 210_000,
    health: 80,
    bodyDamage: 7,
    fireCooldown: 1800,
    coinReward: 140,
    points: 700,
    velocityY: 58,
    fanEvery: 3,
    fanSpreadDeg: 20,
    fanCount: 5,
  },
  4: {
    spawnMs: 240_000,
    health: 95,
    bodyDamage: 7,
    fireCooldown: 1700,
    coinReward: 160,
    points: 800,
    velocityY: 60,
    fanEvery: 2,
    fanSpreadDeg: 22,
    fanCount: 5,
  },
  5: {
    spawnMs: 300_000,
    health: 120,
    bodyDamage: 8,
    fireCooldown: 1400,
    coinReward: 200,
    points: 1000,
    velocityY: 65,
    fanEvery: 2,
    fanSpreadDeg: 24,
    fanCount: 7,
  },
  6: {
    spawnMs: 330_000,
    health: 88,
    bodyDamage: 7,
    fireCooldown: 1650,
    coinReward: 220,
    points: 1100,
    velocityY: 62,
    fanEvery: 2,
    fanSpreadDeg: 22,
    fanCount: 5,
  },
  7: {
    spawnMs: 360_000,
    health: 91,
    bodyDamage: 7,
    fireCooldown: 1600,
    coinReward: 240,
    points: 1200,
    velocityY: 63,
    fanEvery: 2,
    fanSpreadDeg: 23,
    fanCount: 6,
  },
  8: {
    spawnMs: 390_000,
    health: 94,
    bodyDamage: 8,
    fireCooldown: 1550,
    coinReward: 260,
    points: 1300,
    velocityY: 64,
    fanEvery: 2,
    fanSpreadDeg: 24,
    fanCount: 6,
  },
  9: {
    spawnMs: 420_000,
    health: 98,
    bodyDamage: 8,
    fireCooldown: 1500,
    coinReward: 280,
    points: 1400,
    velocityY: 65,
    fanEvery: 2,
    fanSpreadDeg: 25,
    fanCount: 7,
  },
  10: {
    spawnMs: 480_000,
    health: 160,
    bodyDamage: 9,
    fireCooldown: 1200,
    coinReward: 350,
    points: 1600,
    velocityY: 68,
    fanEvery: 2,
    fanSpreadDeg: 28,
    fanCount: 9,
  },
};

export function getBossConfigForLevel(level: number): BossLevelConfig {
  return BOSS_LEVEL_CONFIG[level] ?? BOSS_LEVEL_CONFIG[1];
}

export function getBossSpawnMsForLevel(level: number): number {
  return getBossConfigForLevel(level).spawnMs;
}

export function formatBossWaitTime(level: number): string {
  const ms = getBossSpawnMsForLevel(level);
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return sec === 0 ? `${min}:00` : `${min}:${sec.toString().padStart(2, '0')}`;
}
