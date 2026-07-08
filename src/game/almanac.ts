import {
  SPIDER_BODY_DAMAGE,
  SPIDER_HEALTH,
  SPIDER_POINTS,
} from './entities/SpiderShip';
import {
  SEEKER_BODY_DAMAGE,
  SEEKER_HEALTH,
  SEEKER_POINTS,
} from './entities/SeekerDrone';
import {
  WASP_BODY_DAMAGE,
  WASP_HEALTH,
  WASP_POINTS,
} from './entities/KamikazeWasp';
import {
  TURRET_BODY_DAMAGE,
  TURRET_HEALTH,
  TURRET_POINTS,
} from './entities/PlasmaTurret';
import { ASTEROID_DAMAGE, ASTEROID_DATA, GOLD_ASTEROID_HEALTH, GOLD_ASTEROID_TEXTURES, type AsteroidSize } from './entities/Asteroid';
import { getGoldAsteroidCoinReward } from './coinDrops';
import { BOSS_DEFINITIONS } from './world1/bosses';
import { STORY_ENEMY_DEFINITIONS, type StoryEnemyBehavior } from './world1/storyEnemyDefinitions';
import { getStoryEnemyUnlockScore, getSurvivalBossUnlockScore } from './survivalSpawn';

export type AlmanacCategory = 'asteroid' | 'goldAsteroid' | 'storyEnemy' | 'enemy' | 'boss';

export interface AlmanacEntry {
  id: string;
  category: AlmanacCategory;
  name: string;
  textureKey: string;
  textureScale?: number;
  subtitle?: string;
  description: string;
  stats: string;
}

const ASTEROID_NAMES: Record<AsteroidSize, string> = {
  lg: 'Large Asteroid',
  md: 'Medium Asteroid',
  sm: 'Small Asteroid',
};

const ASTEROID_DESCRIPTIONS: Record<AsteroidSize, string> = {
  lg: 'Slow, massive rock. Takes multiple hits to destroy.',
  md: 'Mid-sized drifting hazard with moderate speed.',
  sm: 'Fast fragment. Easy to break but dangerous on contact.',
};

const ASTEROID_SCALES: Record<AsteroidSize, number> = {
  lg: 1.15,
  md: 1,
  sm: 0.85,
};

function buildAsteroidEntries(): AlmanacEntry[] {
  const sizes: AsteroidSize[] = ['lg', 'md', 'sm'];
  return sizes.map((size) => {
    const data = ASTEROID_DATA[size];
    return {
      id: `asteroid-${size}`,
      category: 'asteroid',
      name: ASTEROID_NAMES[size],
      textureKey: data.texture,
      textureScale: ASTEROID_SCALES[size],
      description: ASTEROID_DESCRIPTIONS[size],
      stats: `HP ${data.health} · DMG ${ASTEROID_DAMAGE[size]} · ${data.points} pts`,
    };
  });
}

function buildGoldAsteroidEntries(): AlmanacEntry[] {
  const sizes: AsteroidSize[] = ['lg', 'md', 'sm'];
  const names: Record<AsteroidSize, string> = {
    lg: 'Large Gold Asteroid',
    md: 'Medium Gold Asteroid',
    sm: 'Small Gold Asteroid',
  };

  return sizes.map((size) => {
    const data = ASTEROID_DATA[size];
    const coins = getGoldAsteroidCoinReward(size);
    return {
      id: `gold-asteroid-${size}`,
      category: 'goldAsteroid',
      name: names[size],
      textureKey: GOLD_ASTEROID_TEXTURES[size],
      textureScale: ASTEROID_SCALES[size],
      description: 'Rare golden rock. Destroy with lasers or by ramming it to earn coins.',
      stats: `HP ${GOLD_ASTEROID_HEALTH[size]} · DMG ${ASTEROID_DAMAGE[size]} · ${data.points} pts · +${coins} coins`,
    };
  });
}

const SURVIVAL_ENEMY_DESCRIPTION_SUFFIX = ' Generic survival enemy — unlocks as your score rises.';

const STORY_SURVIVAL_SUFFIX = ' Also unlocks in Survival mode at higher scores.';

const ENEMY_ENTRIES: AlmanacEntry[] = [
  {
    id: 'enemy-spider',
    category: 'enemy',
    name: 'Spider Ship',
    textureKey: 'spider-ship',
    textureScale: 1.1,
    subtitle: 'Survival · 1000+ score',
    description: `Eight-legged raider that fires aimed lasers.${SURVIVAL_ENEMY_DESCRIPTION_SUFFIX}`,
    stats: `HP ${SPIDER_HEALTH} · DMG ${SPIDER_BODY_DAMAGE} · ${SPIDER_POINTS} pts`,
  },
  {
    id: 'enemy-seeker',
    category: 'enemy',
    name: 'Seeker Drone',
    textureKey: 'seeker-drone',
    subtitle: 'Survival · 2000+ score',
    description: `Homing drone that accelerates toward your ship.${SURVIVAL_ENEMY_DESCRIPTION_SUFFIX}`,
    stats: `HP ${SEEKER_HEALTH} · DMG ${SEEKER_BODY_DAMAGE} · ${SEEKER_POINTS} pts`,
  },
  {
    id: 'enemy-wasp',
    category: 'enemy',
    name: 'Kamikaze Wasp',
    textureKey: 'kamikaze-wasp',
    subtitle: 'Survival · 4000+ score',
    description: `Zigzagging dive bomber built for ram attacks.${SURVIVAL_ENEMY_DESCRIPTION_SUFFIX}`,
    stats: `HP ${WASP_HEALTH} · DMG ${WASP_BODY_DAMAGE} · ${WASP_POINTS} pts`,
  },
  {
    id: 'enemy-turret',
    category: 'enemy',
    name: 'Plasma Turret',
    textureKey: 'plasma-turret',
    subtitle: 'Survival · 5000+ score',
    description: `Slow-floating gun platform with triple-spread shots.${SURVIVAL_ENEMY_DESCRIPTION_SUFFIX}`,
    stats: `HP ${TURRET_HEALTH} · DMG ${TURRET_BODY_DAMAGE} · ${TURRET_POINTS} pts`,
  },
];

const STORY_BEHAVIOR_DESCRIPTIONS: Record<StoryEnemyBehavior, string> = {
  driftLaser: 'Drifts inward and fires aimed lasers.',
  homing: 'Homing pursuer that accelerates toward your ship.',
  zigzagDive: 'Zigzagging dive bomber built for ram attacks.',
  playerDive: 'Launches in a straight rush aimed at your position.',
  lateralLaser: 'Enters from the side and fires spread shots.',
  spreadFire: 'Slow floater that fires a three-shot spread.',
  fanFire: 'Weaver platform that fires a wide fan of lasers.',
  patrolDash: 'Patrols slowly, then dashes at your ship.',
  hybridHunter: 'Chases your ship and fires periodic lasers.',
};

function buildStoryEnemyEntries(): AlmanacEntry[] {
  return Object.values(STORY_ENEMY_DEFINITIONS)
    .sort((a, b) => a.level - b.level)
    .map((enemy) => {
      const unlockScore = getStoryEnemyUnlockScore(enemy.level);
      return {
        id: `story-enemy-${enemy.level}`,
        category: 'storyEnemy',
        name: enemy.enemyName,
        textureKey: enemy.textureKey,
        textureScale: 1,
        subtitle: `Story L${enemy.level} · Survival ${unlockScore}+ score`,
        description: `${STORY_BEHAVIOR_DESCRIPTIONS[enemy.behavior]} Story levels use this enemy exclusively.${STORY_SURVIVAL_SUFFIX}`,
        stats: `HP ${enemy.health} · DMG ${enemy.bodyDamage} · ${enemy.points} pts`,
      };
    });
}

function buildBossEntries(): AlmanacEntry[] {
  return Object.values(BOSS_DEFINITIONS)
    .sort((a, b) => a.level - b.level)
    .map((boss) => {
      const survivalUnlock = getSurvivalBossUnlockScore(boss.level);
      return {
        id: `boss-${boss.level}`,
        category: 'boss',
        name: boss.bossName,
        textureKey: boss.textureKey,
        textureScale: boss.baseScale ?? 1,
        subtitle: `Story L${boss.level} · Survival ${survivalUnlock}+ score`,
        description: `Special: ${boss.special.name}. Story: defeating ends the level. Survival: awards points and coins, then the run continues.`,
        stats: `HP ${boss.baseHealth} · DMG ${boss.bodyDamage} · ${boss.points} pts`,
      };
    });
}

export const ALMANAC_ENTRIES: AlmanacEntry[] = [
  ...buildAsteroidEntries(),
  ...buildGoldAsteroidEntries(),
  ...buildStoryEnemyEntries(),
  ...ENEMY_ENTRIES,
  ...buildBossEntries(),
];

export const ALMANAC_SECTIONS: { label: string; category: AlmanacCategory }[] = [
  { label: 'ASTEROIDS', category: 'asteroid' },
  { label: 'GOLD ASTEROIDS', category: 'goldAsteroid' },
  { label: 'STORY ENEMIES', category: 'storyEnemy' },
  { label: 'SURVIVAL ENEMIES', category: 'enemy' },
  { label: 'BOSSES', category: 'boss' },
];
