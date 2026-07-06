import Phaser from 'phaser';
import type { BackgroundTheme } from '../world1/backgrounds';

export interface StoryBackgroundLayers {
  sky: Phaser.GameObjects.Graphics;
  planet: Phaser.GameObjects.Graphics;
}

export function applyStoryBackground(
  scene: Phaser.Scene,
  width: number,
  height: number,
  theme: BackgroundTheme,
): StoryBackgroundLayers {
  const sky = scene.add.graphics().setDepth(-3);
  sky.fillGradientStyle(theme.skyTop, theme.skyTop, theme.skyBottom, theme.skyBottom, 1);
  sky.fillRect(0, 0, width, height);

  const planet = scene.add.graphics().setDepth(-2);
  if (theme.planetSize > 0) {
    const px = width * theme.planetX;
    const py = height * 0.38;
    const r = theme.planetSize / 2;

    planet.fillStyle(theme.planetColor, 0.35);
    planet.fillCircle(px, py, r + 8);
    planet.fillStyle(theme.planetColor, 0.9);
    planet.fillCircle(px, py, r);
    planet.fillStyle(0xffffff, 0.12);
    planet.fillCircle(px - r * 0.25, py - r * 0.25, r * 0.35);
  }

  return { sky, planet };
}
