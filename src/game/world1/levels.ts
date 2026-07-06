export interface World1LevelMeta {
  level: number;
  location: string;
  themeId: string;
  bossName: string;
}

export const WORLD1_LEVELS: World1LevelMeta[] = [
  { level: 1, location: 'Earth', themeId: 'earth', bossName: 'Orbital Sentinel' },
  { level: 2, location: 'Lunar Transit', themeId: 'moon', bossName: 'Lunar Crawler' },
  { level: 3, location: 'Venus', themeId: 'venus', bossName: 'Venusian Swarm Queen' },
  { level: 4, location: 'Mercury', themeId: 'mercury', bossName: 'Solar Flare Golem' },
  { level: 5, location: 'Mars', themeId: 'mars', bossName: 'Martian War Titan' },
  { level: 6, location: 'Belt Entry', themeId: 'beltEntry', bossName: 'Belt Marauder' },
  { level: 7, location: 'Vesta Sector', themeId: 'vesta', bossName: 'Vesta Crusher' },
  { level: 8, location: 'Pallas Sector', themeId: 'pallas', bossName: 'Pallas Weaver' },
  { level: 9, location: 'Ceres Approach', themeId: 'ceres', bossName: 'Ceres Guardian' },
  { level: 10, location: 'Asteroid Belt', themeId: 'beltFinale', bossName: 'Belt Overlord' },
];

export function getWorld1Level(level: number): World1LevelMeta {
  return WORLD1_LEVELS[level - 1] ?? WORLD1_LEVELS[0];
}

export function getWorld1LevelCount(): number {
  return WORLD1_LEVELS.length;
}
