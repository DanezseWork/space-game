import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config';

export const HEART_HEAL = 2;

export class Heart extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'heart');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCircle(10);
    this.setDepth(6);
    this.setVelocity(
      Phaser.Math.Between(-30, 30),
      Phaser.Math.Between(25, 55),
    );

    scene.tweens.add({
      targets: this,
      scale: { from: 0.9, to: 1.15 },
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  static randomSpawnPosition(): { x: number; y: number } {
    return {
      x: Phaser.Math.Between(40, GAME_WIDTH - 40),
      y: Phaser.Math.Between(-60, GAME_HEIGHT * 0.5),
    };
  }

  isOffScreen(): boolean {
    const margin = 60;
    return (
      this.x < -margin ||
      this.x > GAME_WIDTH + margin ||
      this.y < -margin ||
      this.y > GAME_HEIGHT + margin
    );
  }
}
