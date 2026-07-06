import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config';

export const SPIDER_HEALTH = 2;
export const SPIDER_POINTS = 25;
export const SPIDER_FIRE_COOLDOWN = 2800;
export const SPIDER_BODY_DAMAGE = 4;

export interface SpiderShipConfig {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
}

export type SpiderFireCallback = (x: number, y: number, angle: number) => void;

export class SpiderShip extends Phaser.Physics.Arcade.Sprite {
  health = SPIDER_HEALTH;
  readonly points = SPIDER_POINTS;
  private lastFired = 0;

  constructor(
    scene: Phaser.Scene,
    config: SpiderShipConfig,
    private onFire: SpiderFireCallback,
  ) {
    super(scene, config.x, config.y, 'spider-ship');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCircle(14);
    this.setDepth(6);
    this.setVelocity(config.velocityX, config.velocityY);
    this.setAngularVelocity(Phaser.Math.Between(-40, 40));
  }

  static randomConfig(): SpiderShipConfig {
    const fromTop = Math.random() < 0.6;
    let x: number;
    let y: number;

    if (fromTop) {
      x = Phaser.Math.Between(50, GAME_WIDTH - 50);
      y = Phaser.Math.Between(-60, -20);
    } else {
      const fromLeft = Math.random() < 0.5;
      x = fromLeft ? -40 : GAME_WIDTH + 40;
      y = Phaser.Math.Between(60, GAME_HEIGHT * 0.45);
    }

    const targetX = GAME_WIDTH / 2;
    const targetY = GAME_HEIGHT * 0.55;
    const angle = Phaser.Math.Angle.Between(x, y, targetX, targetY);
    const speed = Phaser.Math.Between(45, 75);

    return {
      x,
      y,
      velocityX: Math.cos(angle) * speed,
      velocityY: Math.sin(angle) * speed,
    };
  }

  tryFire(time: number, targetX: number, targetY: number): void {
    if (time < this.lastFired + SPIDER_FIRE_COOLDOWN) return;

    this.lastFired = time;
    const angle = Phaser.Math.Angle.Between(this.x, this.y, targetX, targetY);
    this.onFire(this.x, this.y, angle);
  }

  takeHit(): boolean {
    this.health -= 1;
    this.setTint(0xff8888);
    this.scene.time.delayedCall(80, () => this.clearTint());

    if (this.health <= 0) {
      this.destroy();
      return true;
    }
    return false;
  }

  takeDamage(amount: number): boolean {
    this.health -= amount;
    this.setTint(0xff8888);
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
