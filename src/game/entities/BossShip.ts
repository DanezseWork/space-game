import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config';
import type { BossLevelConfig } from '../levelConfig';

export type BossFireCallback = (x: number, y: number, angle: number) => void;

export class BossShip extends Phaser.Physics.Arcade.Sprite {
  health: number;
  readonly maxHealth: number;
  readonly bodyDamage: number;
  readonly points: number;
  private readonly fireCooldown: number;
  private readonly fanEvery: number;
  private readonly fanSpreadRad: number;
  private readonly fanCount: number;
  private readonly velocityY: number;
  private lastFired = 0;
  private fanShotCounter = 0;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    config: BossLevelConfig,
    private onFire: BossFireCallback,
    healthOverride?: number,
  ) {
    super(scene, x, y, 'boss-ship');

    this.maxHealth = config.health;
    this.health = healthOverride ?? config.health;
    this.velocityY = config.velocityY;
    this.bodyDamage = config.bodyDamage;
    this.points = config.points;
    this.fireCooldown = config.fireCooldown;
    this.fanEvery = config.fanEvery;
    this.fanSpreadRad = (config.fanSpreadDeg * Math.PI) / 180;
    this.fanCount = config.fanCount;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setImmovable(true);

    this.setCircle(28);
    this.setDepth(8);
    this.setVelocity(0, config.velocityY);

    if (config.health >= 150) {
      this.setScale(1.3);
    } else if (config.health >= 100) {
      this.setScale(1.15);
    }
  }

  tryFire(time: number, targetX: number, targetY: number): void {
    if (time < this.lastFired + this.fireCooldown) return;

    this.lastFired = time;
    this.fanShotCounter += 1;

    const baseAngle = Phaser.Math.Angle.Between(this.x, this.y, targetX, targetY);

    if (this.fanEvery > 0 && this.fanShotCounter % this.fanEvery === 0) {
      const half = (this.fanCount - 1) / 2;
      for (let i = 0; i < this.fanCount; i++) {
        const t = half === 0 ? 0 : (i / half) - 1;
        this.onFire(this.x, this.y, baseAngle + t * this.fanSpreadRad);
      }
    } else {
      this.onFire(this.x, this.y, baseAngle);
    }
  }

  takeDamage(amount: number): boolean {
    this.health -= amount;
    this.setTint(0xff6666);
    this.scene.time.delayedCall(80, () => this.clearTint());

    if (this.health <= 0) {
      this.destroy();
      return true;
    }
    return false;
  }

  isOffScreen(): boolean {
    const margin = 100;
    return (
      this.x < -margin ||
      this.x > GAME_WIDTH + margin ||
      this.y < -margin ||
      this.y > GAME_HEIGHT + margin
    );
  }

  respawnFromTop(): void {
    this.setPosition(GAME_WIDTH / 2, -50);
    this.setVelocity(0, this.velocityY);
  }
}
