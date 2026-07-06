import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config';

export const WASP_HEALTH = 1;
export const WASP_POINTS = 12;
export const WASP_BODY_DAMAGE = 4;

export interface KamikazeWaspConfig {
  x: number;
  y: number;
  velocityY: number;
  phase: number;
}

export class KamikazeWasp extends Phaser.Physics.Arcade.Sprite {
  health = WASP_HEALTH;
  readonly points = WASP_POINTS;
  private readonly phase: number;
  private zigzagTime = 0;

  constructor(scene: Phaser.Scene, config: KamikazeWaspConfig) {
    super(scene, config.x, config.y, 'kamikaze-wasp');

    this.phase = config.phase;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCircle(10);
    this.setDepth(6);
    this.setVelocity(0, config.velocityY);
  }

  static randomConfig(): KamikazeWaspConfig {
    return {
      x: Phaser.Math.Between(50, GAME_WIDTH - 50),
      y: Phaser.Math.Between(-70, -25),
      velocityY: Phaser.Math.Between(90, 130),
      phase: Phaser.Math.FloatBetween(0, Math.PI * 2),
    };
  }

  updateWasp(_time: number, delta: number): void {
    this.zigzagTime += delta / 1000;
    const zigzagX = Math.sin(this.zigzagTime * 4 + this.phase) * 140;
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocityX(zigzagX);
  }

  takeDamage(amount: number): boolean {
    this.health -= amount;
    this.setTint(0xffff88);
    this.scene.time.delayedCall(80, () => this.clearTint());

    if (this.health <= 0) {
      this.destroy();
      return true;
    }
    return false;
  }

  isOffScreen(): boolean {
    const margin = 80;
    return (
      this.x < -margin ||
      this.x > GAME_WIDTH + margin ||
      this.y < -margin ||
      this.y > GAME_HEIGHT + margin
    );
  }
}
