import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config';

export const TURRET_HEALTH = 2;
export const TURRET_POINTS = 30;
export const TURRET_BODY_DAMAGE = 4;
export const TURRET_FIRE_COOLDOWN = 3200;
export const TURRET_SPREAD_DEG = 18;

export type TurretFireCallback = (x: number, y: number, angle: number) => void;

export interface PlasmaTurretConfig {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
}

export class PlasmaTurret extends Phaser.Physics.Arcade.Sprite {
  health = TURRET_HEALTH;
  readonly points = TURRET_POINTS;
  private lastFired = 0;

  constructor(
    scene: Phaser.Scene,
    config: PlasmaTurretConfig,
    private onFire: TurretFireCallback,
  ) {
    super(scene, config.x, config.y, 'plasma-turret');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCircle(14);
    this.setDepth(6);
    this.setVelocity(config.velocityX, config.velocityY);
  }

  static randomConfig(): PlasmaTurretConfig {
    const fromLeft = Math.random() < 0.5;
    return {
      x: fromLeft ? Phaser.Math.Between(40, 120) : Phaser.Math.Between(GAME_WIDTH - 120, GAME_WIDTH - 40),
      y: Phaser.Math.Between(-50, GAME_HEIGHT * 0.25),
      velocityX: fromLeft ? 35 : -35,
      velocityY: Phaser.Math.Between(25, 45),
    };
  }

  tryFire(time: number, targetX: number, targetY: number): void {
    if (time < this.lastFired + TURRET_FIRE_COOLDOWN) return;

    this.lastFired = time;
    const baseAngle = Phaser.Math.Angle.Between(this.x, this.y, targetX, targetY);
    const spread = (TURRET_SPREAD_DEG * Math.PI) / 180;

    this.onFire(this.x, this.y, baseAngle - spread);
    this.onFire(this.x, this.y, baseAngle);
    this.onFire(this.x, this.y, baseAngle + spread);
  }

  takeDamage(amount: number): boolean {
    this.health -= amount;
    this.setTint(0xcc88ff);
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
