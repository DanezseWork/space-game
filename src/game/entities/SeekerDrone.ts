import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config';

export const SEEKER_HEALTH = 1;
export const SEEKER_POINTS = 15;
export const SEEKER_BODY_DAMAGE = 3;
export const SEEKER_MAX_SPEED = 120;

export interface SeekerDroneConfig {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
}

export class SeekerDrone extends Phaser.Physics.Arcade.Sprite {
  health = SEEKER_HEALTH;
  readonly points = SEEKER_POINTS;

  constructor(scene: Phaser.Scene, config: SeekerDroneConfig) {
    super(scene, config.x, config.y, 'seeker-drone');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCircle(10);
    this.setDepth(6);
    this.setVelocity(config.velocityX, config.velocityY);
  }

  static randomConfig(): SeekerDroneConfig {
    const x = Phaser.Math.Between(40, GAME_WIDTH - 40);
    const y = Phaser.Math.Between(-60, -20);
    return {
      x,
      y,
      velocityX: Phaser.Math.Between(-30, 30),
      velocityY: Phaser.Math.Between(50, 80),
    };
  }

  updateSeeker(playerX: number, playerY: number, _delta: number): void {
    const angle = Phaser.Math.Angle.Between(this.x, this.y, playerX, playerY);
    const body = this.body as Phaser.Physics.Arcade.Body;
    const accel = 180;
    body.setAcceleration(Math.cos(angle) * accel, Math.sin(angle) * accel);

    const speed = body.velocity.length();
    if (speed > SEEKER_MAX_SPEED) {
      body.velocity.normalize().scale(SEEKER_MAX_SPEED);
    }
  }

  takeDamage(amount: number): boolean {
    this.health -= amount;
    this.setTint(0xffaa66);
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
