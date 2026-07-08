import type { AsteroidSize } from './entities/Asteroid';

export const GOLD_ASTEROID_SPAWN_CHANCE = 0.025;
export const MAX_GOLD_ASTEROIDS_ON_SCREEN = 1;

export const GOLD_ASTEROID_COINS: Record<AsteroidSize, number> = {
  sm: 3,
  md: 6,
  lg: 10,
};

export const ENEMY_COIN_DROP_CHANCE = 0.1;
export const ENEMY_COIN_REWARD = 5;

export function getGoldAsteroidCoinReward(size: AsteroidSize): number {
  return GOLD_ASTEROID_COINS[size];
}

export function rollEnemyCoinDrop(): number | null {
  if (Math.random() < ENEMY_COIN_DROP_CHANCE) {
    return ENEMY_COIN_REWARD;
  }
  return null;
}
