import { getStoryEnemyDefinition } from './world1/storyEnemyDefinitions';

export function getStoryEnemySpawnInterval(level: number): number {
  return getStoryEnemyDefinition(level).spawnIntervalMs;
}

export function getStoryEnemyMaxOnScreen(level: number): number {
  return getStoryEnemyDefinition(level).maxOnScreen;
}

export function canSpawnStoryEnemy(level: number, activeCount: number): boolean {
  return activeCount < getStoryEnemyMaxOnScreen(level);
}
