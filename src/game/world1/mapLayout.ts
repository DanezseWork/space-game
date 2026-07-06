export type MapNodeStyle = 'planet' | 'moon' | 'asteroid' | 'star';

export interface MapNodeLayout {
  level: number;
  /** 0 = left edge, 1 = right edge of map area. */
  x: number;
  /** 0 = top, 1 = bottom of map area. */
  y: number;
  orbitIndex: number;
  nodeStyle: MapNodeStyle;
}

/** Sun anchor in normalized map coordinates. */
export const SUN_POSITION = { x: 0.92, y: 0.48 };

/** Orbit ellipse radii as fractions of map width/height (inner → outer). */
export const WORLD1_ORBITS = [
  { rx: 0.1, ry: 0.08 },
  { rx: 0.18, ry: 0.14 },
  { rx: 0.28, ry: 0.22 },
  { rx: 0.38, ry: 0.3 },
  { rx: 0.5, ry: 0.38 },
];

export const WORLD1_MAP_NODES: MapNodeLayout[] = [
  { level: 1, x: 0.58, y: 0.42, orbitIndex: 2, nodeStyle: 'planet' },
  { level: 2, x: 0.52, y: 0.38, orbitIndex: 2, nodeStyle: 'moon' },
  { level: 3, x: 0.48, y: 0.52, orbitIndex: 3, nodeStyle: 'planet' },
  { level: 4, x: 0.68, y: 0.35, orbitIndex: 1, nodeStyle: 'moon' },
  { level: 5, x: 0.42, y: 0.45, orbitIndex: 4, nodeStyle: 'planet' },
  { level: 6, x: 0.34, y: 0.5, orbitIndex: 4, nodeStyle: 'moon' },
  { level: 7, x: 0.24, y: 0.44, orbitIndex: 4, nodeStyle: 'asteroid' },
  { level: 8, x: 0.18, y: 0.55, orbitIndex: 4, nodeStyle: 'asteroid' },
  { level: 9, x: 0.12, y: 0.4, orbitIndex: 4, nodeStyle: 'moon' },
  { level: 10, x: 0.06, y: 0.48, orbitIndex: 4, nodeStyle: 'star' },
];

export function getWorld1MapNode(level: number): MapNodeLayout {
  return WORLD1_MAP_NODES[level - 1] ?? WORLD1_MAP_NODES[0];
}

export function getWorld1MapRouteLevels(): number[] {
  return WORLD1_MAP_NODES.map((node) => node.level);
}
