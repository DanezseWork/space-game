import Phaser from 'phaser';

export const MAX_HP = 20;
export const BAR_COUNT = 10;
export const HP_PER_BAR = 2;

const BOX_WIDTH = 28;
const BOX_HEIGHT = 14;
const BOX_GAP = 4;
const PADDING = 2;

const COLOR_BORDER = 0x556677;
const COLOR_BG = 0x1a1f3a;
const COLOR_GRAY = 0x555566;
const COLOR_RED = 0xff4466;

export class HealthBar extends Phaser.GameObjects.Container {
  private segmentGraphics: Phaser.GameObjects.Graphics[] = [];

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    const totalWidth = BAR_COUNT * BOX_WIDTH + (BAR_COUNT - 1) * BOX_GAP;
    const startX = -totalWidth / 2;

    for (let i = 0; i < BAR_COUNT; i++) {
      const g = scene.add.graphics();
      g.x = startX + i * (BOX_WIDTH + BOX_GAP);
      this.segmentGraphics.push(g);
      this.add(g);
    }

    scene.add.existing(this);
    this.setScrollFactor(0);
    this.setDepth(100);
    this.setHp(MAX_HP);
  }

  setHp(hp: number): void {
    const clamped = Phaser.Math.Clamp(hp, 0, MAX_HP);

    for (let i = 0; i < BAR_COUNT; i++) {
      const fillLevel = Math.min(HP_PER_BAR, Math.max(0, clamped - i * HP_PER_BAR));
      this.drawSegment(this.segmentGraphics[i], fillLevel);
    }
  }

  private drawSegment(g: Phaser.GameObjects.Graphics, fillLevel: number): void {
    g.clear();

    g.lineStyle(1, COLOR_BORDER, 1);
    g.fillStyle(COLOR_BG, 1);
    g.fillRect(0, 0, BOX_WIDTH, BOX_HEIGHT);
    g.strokeRect(0, 0, BOX_WIDTH, BOX_HEIGHT);

    const innerX = PADDING;
    const innerY = PADDING;
    const innerW = BOX_WIDTH - PADDING * 2;
    const innerH = BOX_HEIGHT - PADDING * 2;
    const halfW = innerW / 2;

    if (fillLevel === 0) {
      g.fillStyle(COLOR_GRAY, 1);
      g.fillRect(innerX, innerY, innerW, innerH);
    } else if (fillLevel === 1) {
      g.fillStyle(COLOR_RED, 1);
      g.fillRect(innerX, innerY, halfW, innerH);
      g.fillStyle(COLOR_GRAY, 1);
      g.fillRect(innerX + halfW, innerY, halfW, innerH);
    } else {
      g.fillStyle(COLOR_RED, 1);
      g.fillRect(innerX, innerY, innerW, innerH);
    }
  }
}
