import Phaser from 'phaser';
import { GAME_WIDTH } from '../config';

const BAR_WIDTH = 280;
const BAR_HEIGHT = 14;

export class BossHealthBar extends Phaser.GameObjects.Container {
  private fill!: Phaser.GameObjects.Graphics;
  private label!: Phaser.GameObjects.Text;
  private maxHp = 1;

  constructor(scene: Phaser.Scene, y: number) {
    super(scene, GAME_WIDTH / 2, y);

    this.label = scene.add.text(0, -18, 'BOSS', {
      fontFamily: 'Orbitron, sans-serif',
      fontSize: '11px',
      fontStyle: '700',
      color: '#ff4466',
    }).setOrigin(0.5);

    const bg = scene.add.graphics();
    bg.fillStyle(0x1a1f3a, 1);
    bg.fillRoundedRect(-BAR_WIDTH / 2, -BAR_HEIGHT / 2, BAR_WIDTH, BAR_HEIGHT, 4);
    bg.lineStyle(1, 0xff4466, 0.8);
    bg.strokeRoundedRect(-BAR_WIDTH / 2, -BAR_HEIGHT / 2, BAR_WIDTH, BAR_HEIGHT, 4);

    this.fill = scene.add.graphics();

    this.add([this.label, bg, this.fill]);
    scene.add.existing(this);
    this.setScrollFactor(0);
    this.setDepth(101);
    this.setVisible(false);
  }

  show(maxHp: number, currentHp: number, bossName?: string): void {
    this.maxHp = Math.max(1, maxHp);
    this.label.setText(bossName?.toUpperCase() ?? 'BOSS');
    this.setVisible(true);
    this.setHp(currentHp);
  }

  hide(): void {
    this.setVisible(false);
  }

  setHp(hp: number): void {
    const clamped = Phaser.Math.Clamp(hp, 0, this.maxHp);
    const ratio = clamped / this.maxHp;
    const innerW = BAR_WIDTH - 4;
    const fillW = innerW * ratio;

    this.fill.clear();
    if (fillW > 0) {
      this.fill.fillStyle(0xff2244, 1);
      this.fill.fillRoundedRect(-BAR_WIDTH / 2 + 2, -BAR_HEIGHT / 2 + 2, fillW, BAR_HEIGHT - 4, 2);
    }
  }
}
