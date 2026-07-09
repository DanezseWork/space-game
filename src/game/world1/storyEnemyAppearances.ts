import Phaser from 'phaser';
import { getBackgroundTheme } from './backgrounds';

export type StoryEnemyAppearanceId =
  | 'orbitalProbe'
  | 'lunarMite'
  | 'acidSkimmer'
  | 'solarDart'
  | 'dustStrider'
  | 'shardStalker'
  | 'rockSpitter'
  | 'silkWeaver'
  | 'frostLeech'
  | 'beltRaider';

export interface StoryEnemyAppearancePalette {
  hull: number;
  hullDark: number;
  trim: number;
  core: number;
  glow: number;
}

const CX = 16;
const CY = 18;

function darkenColor(color: number, factor: number): number {
  const r = Math.floor(((color >> 16) & 0xff) * factor);
  const g = Math.floor(((color >> 8) & 0xff) * factor);
  const b = Math.floor((color & 0xff) * factor);
  return (r << 16) | (g << 8) | b;
}

export function getStoryEnemyAppearancePalette(themeId: string): StoryEnemyAppearancePalette {
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

function drawOrbitalProbe(g: Phaser.GameObjects.Graphics, p: StoryEnemyAppearancePalette): void {
  g.fillStyle(p.hullDark, 1);
  g.fillCircle(CX, CY, 10);
  g.fillStyle(p.hull, 1);
  g.fillCircle(CX, CY, 7);
  g.lineStyle(2, p.trim, 0.9);
  g.strokeCircle(CX, CY, 10);
  g.fillStyle(p.glow, 0.9);
  g.fillCircle(CX, CY - 2, 3);
  g.fillStyle(p.trim, 0.8);
  g.fillRect(CX - 1, CY - 14, 2, 6);
}

function drawLunarMite(g: Phaser.GameObjects.Graphics, p: StoryEnemyAppearancePalette): void {
  g.fillStyle(p.hullDark, 1);
  g.fillEllipse(CX, CY + 2, 20, 10);
  g.fillStyle(p.hull, 1);
  g.fillEllipse(CX, CY, 16, 8);
  g.fillStyle(p.trim, 0.85);
  g.fillCircle(CX, CY - 1, 4);
  for (const offset of [-10, -4, 4, 10]) {
    g.lineStyle(2, p.hullDark, 1);
    g.lineBetween(CX + offset, CY + 4, CX + offset - 2, CY + 12);
  }
}

function drawAcidSkimmer(g: Phaser.GameObjects.Graphics, p: StoryEnemyAppearancePalette): void {
  g.fillStyle(p.hullDark, 1);
  g.fillTriangle(CX, CY - 12, CX - 12, CY + 8, CX + 12, CY + 8);
  g.fillStyle(p.hull, 1);
  g.fillTriangle(CX, CY - 8, CX - 8, CY + 4, CX + 8, CY + 4);
  g.fillStyle(p.glow, 0.9);
  g.fillCircle(CX, CY, 3);
  g.lineStyle(2, p.trim, 0.7);
  g.lineBetween(CX - 10, CY + 2, CX - 16, CY - 4);
  g.lineBetween(CX + 10, CY + 2, CX + 16, CY - 4);
}

function drawSolarDart(g: Phaser.GameObjects.Graphics, p: StoryEnemyAppearancePalette): void {
  g.fillStyle(p.trim, 1);
  g.fillTriangle(CX, CY - 14, CX - 6, CY + 10, CX + 6, CY + 10);
  g.fillStyle(p.hull, 1);
  g.fillTriangle(CX, CY - 10, CX - 4, CY + 6, CX + 4, CY + 6);
  g.fillStyle(p.glow, 0.95);
  g.fillCircle(CX, CY - 4, 3);
  g.lineStyle(2, p.hullDark, 0.8);
  g.lineBetween(CX - 8, CY + 4, CX - 12, CY + 10);
  g.lineBetween(CX + 8, CY + 4, CX + 12, CY + 10);
}

function drawDustStrider(g: Phaser.GameObjects.Graphics, p: StoryEnemyAppearancePalette): void {
  g.fillStyle(p.hullDark, 1);
  g.fillRect(CX - 12, CY - 4, 24, 10);
  g.fillStyle(p.hull, 1);
  g.fillRect(CX - 10, CY - 6, 20, 8);
  g.fillStyle(p.trim, 1);
  g.fillRect(CX - 2, CY - 12, 4, 8);
  g.fillStyle(p.glow, 0.9);
  g.fillCircle(CX, CY - 12, 3);
  g.lineStyle(2, p.hullDark, 1);
  g.lineBetween(CX - 12, CY + 4, CX - 16, CY + 10);
  g.lineBetween(CX + 12, CY + 4, CX + 16, CY + 10);
}

function drawShardStalker(g: Phaser.GameObjects.Graphics, p: StoryEnemyAppearancePalette): void {
  g.fillStyle(p.hullDark, 1);
  g.beginPath();
  g.moveTo(CX, CY - 12);
  g.lineTo(CX + 10, CY);
  g.lineTo(CX, CY + 12);
  g.lineTo(CX - 10, CY);
  g.closePath();
  g.fillPath();
  g.fillStyle(p.hull, 1);
  g.fillTriangle(CX, CY - 8, CX + 6, CY, CX - 6, CY);
  g.fillStyle(p.glow, 0.9);
  g.fillCircle(CX, CY - 2, 3);
}

function drawRockSpitter(g: Phaser.GameObjects.Graphics, p: StoryEnemyAppearancePalette): void {
  g.fillStyle(p.hullDark, 1);
  g.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
    const x = CX + Math.cos(angle) * 12;
    const y = CY + Math.sin(angle) * 10;
    if (i === 0) g.moveTo(x, y);
    else g.lineTo(x, y);
  }
  g.closePath();
  g.fillPath();
  g.fillStyle(p.trim, 1);
  g.fillRect(CX - 2, CY - 14, 4, 10);
  g.fillStyle(p.glow, 0.9);
  g.fillCircle(CX, CY - 14, 3);
}

function drawSilkWeaver(g: Phaser.GameObjects.Graphics, p: StoryEnemyAppearancePalette): void {
  g.fillStyle(p.hullDark, 1);
  g.fillCircle(CX, CY, 11);
  g.fillStyle(p.hull, 1);
  g.fillCircle(CX, CY, 8);
  g.lineStyle(2, p.trim, 0.8);
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    g.lineBetween(
      CX + Math.cos(angle) * 5,
      CY + Math.sin(angle) * 5,
      CX + Math.cos(angle) * 13,
      CY + Math.sin(angle) * 13,
    );
  }
  g.fillStyle(p.glow, 0.9);
  g.fillCircle(CX, CY, 3);
}

function drawFrostLeech(g: Phaser.GameObjects.Graphics, p: StoryEnemyAppearancePalette): void {
  g.fillStyle(p.hullDark, 1);
  g.fillEllipse(CX, CY, 14, 18);
  g.fillStyle(p.hull, 1);
  g.fillEllipse(CX, CY - 2, 10, 14);
  g.fillStyle(p.trim, 0.85);
  g.fillCircle(CX, CY - 6, 4);
  g.lineStyle(2, p.glow, 0.7);
  g.strokeEllipse(CX, CY, 14, 18);
  g.fillStyle(p.core, 0.8);
  g.fillCircle(CX - 2, CY - 7, 1.5);
}

function drawBeltRaider(g: Phaser.GameObjects.Graphics, p: StoryEnemyAppearancePalette): void {
  g.fillStyle(p.hullDark, 1);
  g.fillTriangle(CX - 12, CY + 8, CX + 12, CY + 8, CX, CY - 12);
  g.fillStyle(p.hull, 1);
  g.fillTriangle(CX - 8, CY + 4, CX + 8, CY + 4, CX, CY - 8);
  g.lineStyle(2, p.trim, 0.9);
  g.lineBetween(CX - 10, CY + 2, CX - 14, CY + 10);
  g.lineBetween(CX + 10, CY + 2, CX + 14, CY + 10);
  g.fillStyle(p.glow, 0.9);
  g.fillCircle(CX, CY - 2, 4);
}

const DRAWERS: Record<StoryEnemyAppearanceId, (g: Phaser.GameObjects.Graphics, p: StoryEnemyAppearancePalette) => void> = {
  orbitalProbe: drawOrbitalProbe,
  lunarMite: drawLunarMite,
  acidSkimmer: drawAcidSkimmer,
  solarDart: drawSolarDart,
  dustStrider: drawDustStrider,
  shardStalker: drawShardStalker,
  rockSpitter: drawRockSpitter,
  silkWeaver: drawSilkWeaver,
  frostLeech: drawFrostLeech,
  beltRaider: drawBeltRaider,
};

export function drawStoryEnemyAppearance(
  g: Phaser.GameObjects.Graphics,
  appearanceId: StoryEnemyAppearanceId,
  palette: StoryEnemyAppearancePalette,
): void {
  DRAWERS[appearanceId](g, palette);
}
