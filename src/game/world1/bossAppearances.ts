import Phaser from 'phaser';
import { getBackgroundTheme } from './backgrounds';

export type BossAppearanceId =
  | 'orbitalSentinel'
  | 'lunarCrawler'
  | 'swarmQueen'
  | 'solarGolem'
  | 'warTitan'
  | 'beltMarauder'
  | 'vestaCrusher'
  | 'pallasWeaver'
  | 'ceresGuardian'
  | 'beltOverlord';

export interface BossAppearancePalette {
  hull: number;
  hullDark: number;
  trim: number;
  core: number;
  glow: number;
}

const CX = 32;
const CY = 34;

function darkenColor(color: number, factor: number): number {
  const r = Math.floor(((color >> 16) & 0xff) * factor);
  const g = Math.floor(((color >> 8) & 0xff) * factor);
  const b = Math.floor((color & 0xff) * factor);
  return (r << 16) | (g << 8) | b;
}

export function getBossAppearancePalette(themeId: string): BossAppearancePalette {
  const theme = getBackgroundTheme(themeId);
  const accent = theme.accentColor;
  const planet = theme.planetColor;
  return {
    hull: planet,
    hullDark: darkenColor(planet, 0.5),
    trim: accent,
    core: 0xffffff,
    glow: accent,
  };
}

function drawOrbitalSentinel(g: Phaser.GameObjects.Graphics, p: BossAppearancePalette): void {
  g.lineStyle(2, p.trim, 0.9);
  g.strokeCircle(CX, CY, 24);

  g.fillStyle(p.hullDark, 1);
  g.fillCircle(CX, CY, 14);
  g.fillStyle(p.hull, 1);
  g.fillCircle(CX, CY, 10);

  g.fillStyle(p.trim, 0.85);
  g.fillRect(CX - 3, CY - 26, 6, 14);
  g.fillStyle(p.core, 0.9);
  g.fillCircle(CX, CY - 28, 5);

  g.lineStyle(2, p.trim, 0.7);
  g.lineBetween(CX - 14, CY, CX - 22, CY + 6);
  g.lineBetween(CX + 14, CY, CX + 22, CY + 6);
}

function drawLunarCrawler(g: Phaser.GameObjects.Graphics, p: BossAppearancePalette): void {
  g.fillStyle(p.hullDark, 1);
  g.fillEllipse(CX, CY + 4, 48, 22);
  g.fillStyle(p.hull, 1);
  g.fillEllipse(CX, CY, 40, 16);
  g.lineStyle(2, p.trim, 0.9);
  g.strokeEllipse(CX, CY, 40, 16);

  g.fillStyle(p.trim, 0.8);
  g.fillCircle(CX, CY - 2, 6);

  const legs = [-22, -12, -2, 8, 18, 28];
  for (const offset of legs) {
    g.lineStyle(2, p.hullDark, 1);
    g.lineBetween(CX + offset, CY + 8, CX + offset - 4, CY + 22);
    g.lineBetween(CX + offset, CY + 8, CX + offset + 4, CY + 22);
  }
}

function drawSwarmQueen(g: Phaser.GameObjects.Graphics, p: BossAppearancePalette): void {
  g.fillStyle(p.hullDark, 1);
  g.fillEllipse(CX, CY, 44, 36);
  g.fillStyle(p.hull, 1);
  g.fillEllipse(CX, CY - 2, 34, 28);
  g.lineStyle(2, p.trim, 0.85);
  g.strokeEllipse(CX, CY - 2, 34, 28);

  g.fillStyle(p.glow, 0.75);
  g.fillCircle(CX, CY - 6, 8);
  g.fillStyle(p.core, 0.9);
  g.fillCircle(CX, CY - 8, 4);

  const pods = [-24, -12, 12, 24];
  for (const offset of pods) {
    g.fillStyle(p.hullDark, 1);
    g.fillEllipse(CX + offset, CY + 6, 12, 16);
    g.fillStyle(p.trim, 0.6);
    g.fillCircle(CX + offset, CY + 10, 4);
  }
}

function drawSolarGolem(g: Phaser.GameObjects.Graphics, p: BossAppearancePalette): void {
  g.fillStyle(p.hullDark, 1);
  g.fillRect(CX - 22, CY - 10, 44, 28);
  g.fillStyle(p.hull, 1);
  g.fillRect(CX - 18, CY - 6, 36, 20);
  g.lineStyle(2, p.trim, 0.9);
  g.strokeRect(CX - 18, CY - 6, 36, 20);

  g.fillStyle(p.trim, 0.9);
  for (let i = -2; i <= 2; i++) {
    g.fillTriangle(CX + i * 8, CY - 22, CX + i * 8 - 5, CY - 8, CX + i * 8 + 5, CY - 8);
  }

  g.fillStyle(p.glow, 0.85);
  g.fillCircle(CX, CY + 2, 7);
  g.fillStyle(p.core, 0.9);
  g.fillCircle(CX, CY, 3);
}

function drawWarTitan(g: Phaser.GameObjects.Graphics, p: BossAppearancePalette): void {
  g.fillStyle(p.hullDark, 1);
  g.fillTriangle(CX, CY - 24, CX - 28, CY + 16, CX + 28, CY + 16);
  g.fillStyle(p.hull, 1);
  g.fillTriangle(CX, CY - 18, CX - 22, CY + 12, CX + 22, CY + 12);
  g.lineStyle(3, p.trim, 0.9);
  g.strokeTriangle(CX, CY - 18, CX - 22, CY + 12, CX + 22, CY + 12);

  g.fillStyle(p.hullDark, 1);
  g.fillRect(CX - 30, CY - 4, 10, 18);
  g.fillRect(CX + 20, CY - 4, 10, 18);
  g.fillStyle(p.trim, 0.85);
  g.fillRect(CX - 28, CY + 10, 6, 8);
  g.fillRect(CX + 22, CY + 10, 6, 8);

  g.fillStyle(p.glow, 0.8);
  g.fillCircle(CX, CY - 4, 6);
}

function drawBeltMarauder(g: Phaser.GameObjects.Graphics, p: BossAppearancePalette): void {
  g.fillStyle(p.hullDark, 1);
  g.fillTriangle(CX - 8, CY - 20, CX - 26, CY + 14, CX + 10, CY + 14);
  g.fillStyle(p.hull, 1);
  g.fillTriangle(CX, CY - 16, CX - 18, CY + 10, CX + 20, CY + 8);
  g.lineStyle(2, p.trim, 0.9);
  g.strokeTriangle(CX, CY - 16, CX - 18, CY + 10, CX + 20, CY + 8);

  g.lineStyle(3, p.trim, 1);
  g.lineBetween(CX + 20, CY - 4, CX + 30, CY + 18);
  g.fillStyle(p.glow, 0.75);
  g.fillCircle(CX - 6, CY, 5);
}

function drawVestaCrusher(g: Phaser.GameObjects.Graphics, p: BossAppearancePalette): void {
  g.fillStyle(p.hullDark, 1);
  g.fillRect(CX - 26, CY - 6, 52, 18);
  g.fillStyle(p.hull, 1);
  g.fillRect(CX - 22, CY - 2, 44, 12);
  g.lineStyle(2, p.trim, 0.9);
  g.strokeRect(CX - 22, CY - 2, 44, 12);

  g.fillStyle(p.hullDark, 1);
  g.fillRect(CX - 10, CY - 22, 20, 16);
  g.fillStyle(p.trim, 0.85);
  g.fillRect(CX - 6, CY - 26, 12, 8);

  g.lineStyle(2, p.hullDark, 1);
  g.lineBetween(CX - 18, CY + 10, CX - 24, CY + 22);
  g.lineBetween(CX + 18, CY + 10, CX + 24, CY + 22);
}

function drawPallasWeaver(g: Phaser.GameObjects.Graphics, p: BossAppearancePalette): void {
  g.fillStyle(p.hull, 1);
  g.fillCircle(CX, CY, 10);
  g.fillStyle(p.hullDark, 1);
  g.fillCircle(CX, CY, 6);

  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
    const x2 = CX + Math.cos(angle) * 24;
    const y2 = CY + Math.sin(angle) * 24;
    g.lineStyle(2, p.trim, 0.85);
    g.lineBetween(CX, CY, x2, y2);
    g.fillStyle(p.hullDark, 1);
    g.fillCircle(x2, y2, 5);
    g.fillStyle(p.glow, 0.6);
    g.fillCircle(x2, y2, 2);
  }

  g.lineStyle(1, p.trim, 0.4);
  g.strokeCircle(CX, CY, 18);
}

function drawCeresGuardian(g: Phaser.GameObjects.Graphics, p: BossAppearancePalette): void {
  g.fillStyle(p.hullDark, 1);
  g.fillCircle(CX, CY, 22);
  g.fillStyle(p.hull, 1);
  g.fillCircle(CX, CY, 16);
  g.lineStyle(3, p.trim, 0.9);
  g.strokeCircle(CX, CY, 16);

  g.lineStyle(4, p.trim, 0.7);
  g.beginPath();
  g.arc(CX, CY + 8, 20, Math.PI * 1.15, Math.PI * 1.85, false);
  g.strokePath();

  g.fillStyle(p.hullDark, 1);
  g.fillRect(CX - 4, CY - 20, 8, 14);
  g.fillStyle(p.glow, 0.85);
  g.fillCircle(CX, CY - 22, 5);
}

function drawBeltOverlord(g: Phaser.GameObjects.Graphics, p: BossAppearancePalette): void {
  g.fillStyle(p.hullDark, 1);
  g.fillEllipse(CX, CY + 2, 54, 40);
  g.fillStyle(p.hull, 1);
  g.fillEllipse(CX, CY, 46, 32);
  g.lineStyle(3, p.trim, 0.95);
  g.strokeEllipse(CX, CY, 46, 32);

  g.fillStyle(p.trim, 1);
  g.fillTriangle(CX - 14, CY - 22, CX, CY - 32, CX + 14, CY - 22);
  g.fillStyle(p.glow, 0.85);
  g.fillCircle(CX, CY - 26, 4);

  g.lineStyle(2, p.hullDark, 1);
  g.lineBetween(CX - 30, CY + 4, CX - 44, CY + 18);
  g.lineBetween(CX + 30, CY + 4, CX + 44, CY + 18);
  g.fillStyle(p.trim, 0.7);
  g.fillCircle(CX, CY - 2, 8);
  g.fillStyle(p.core, 0.9);
  g.fillCircle(CX, CY - 4, 4);
}

const DRAWERS: Record<BossAppearanceId, (g: Phaser.GameObjects.Graphics, p: BossAppearancePalette) => void> = {
  orbitalSentinel: drawOrbitalSentinel,
  lunarCrawler: drawLunarCrawler,
  swarmQueen: drawSwarmQueen,
  solarGolem: drawSolarGolem,
  warTitan: drawWarTitan,
  beltMarauder: drawBeltMarauder,
  vestaCrusher: drawVestaCrusher,
  pallasWeaver: drawPallasWeaver,
  ceresGuardian: drawCeresGuardian,
  beltOverlord: drawBeltOverlord,
};

export function drawBossAppearance(
  g: Phaser.GameObjects.Graphics,
  appearanceId: BossAppearanceId,
  palette: BossAppearancePalette,
): void {
  DRAWERS[appearanceId](g, palette);
}
