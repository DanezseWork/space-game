import Phaser from 'phaser';

export type RocketSkinAppearanceId =
  | 'classic'
  | 'crimson'
  | 'emerald'
  | 'solar'
  | 'violet'
  | 'arctic'
  | 'neon';

export interface RocketSkinPalette {
  hull: number;
  accent: number;
  exhaustPrimary: number;
  exhaustSecondary: number;
}

const PALETTES: Record<RocketSkinAppearanceId, RocketSkinPalette> = {
  classic: {
    hull: 0x1a1f3a,
    accent: 0x00d4ff,
    exhaustPrimary: 0xff6b35,
    exhaustSecondary: 0xffcc00,
  },
  crimson: {
    hull: 0x3a1018,
    accent: 0xff4466,
    exhaustPrimary: 0xff6b35,
    exhaustSecondary: 0xffcc00,
  },
  emerald: {
    hull: 0x0f2a1a,
    accent: 0x33dd77,
    exhaustPrimary: 0x22aa55,
    exhaustSecondary: 0x88ffaa,
  },
  solar: {
    hull: 0x2a2208,
    accent: 0xffcc00,
    exhaustPrimary: 0xff9900,
    exhaustSecondary: 0xffee66,
  },
  violet: {
    hull: 0x1a1030,
    accent: 0xaa66ff,
    exhaustPrimary: 0x8844cc,
    exhaustSecondary: 0xdd99ff,
  },
  arctic: {
    hull: 0x1a2838,
    accent: 0xaaddff,
    exhaustPrimary: 0x66bbee,
    exhaustSecondary: 0xeeffff,
  },
  neon: {
    hull: 0x18082a,
    accent: 0xff44cc,
    exhaustPrimary: 0x00ffcc,
    exhaustSecondary: 0xff66dd,
  },
};

export function getRocketSkinPalette(appearanceId: RocketSkinAppearanceId): RocketSkinPalette {
  return PALETTES[appearanceId];
}

export function drawRocketSkin(
  g: Phaser.GameObjects.Graphics,
  appearanceId: RocketSkinAppearanceId,
): void {
  const p = getRocketSkinPalette(appearanceId);

  g.fillStyle(p.hull, 1);
  g.fillTriangle(16, 0, 0, 40, 32, 40);
  g.fillStyle(p.accent, 1);
  g.fillTriangle(16, 8, 6, 36, 26, 36);
  g.fillStyle(p.exhaustPrimary, 1);
  g.fillTriangle(10, 40, 16, 52, 22, 40);
  g.fillStyle(p.exhaustSecondary, 1);
  g.fillTriangle(13, 42, 16, 50, 19, 42);
}
