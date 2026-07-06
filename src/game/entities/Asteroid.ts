import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config';

export type AsteroidSize = 'lg' | 'md' | 'sm';

export interface AsteroidConfig {
  size: AsteroidSize;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
}

const ASTEROID_DATA: Record<AsteroidSize, { texture: string; points: number; health: number; speed: number }> = {
  lg: { texture: 'asteroid-lg', points: 30, health: 3, speed: 110 },
  md: { texture: 'asteroid-md', points: 20, health: 2, speed: 150 },
  sm: { texture: 'asteroid-sm', points: 10, health: 1, speed: 200 },
};

export const ASTEROID_DAMAGE: Record<AsteroidSize, number> = {
  sm: 2,
  md: 4,
  lg: 6,
};

export class Asteroid extends Phaser.Physics.Arcade.Sprite {
  readonly size: AsteroidSize;
  health: number;
  readonly points: number;

  constructor(scene: Phaser.Scene, config: AsteroidConfig) {
    const data = ASTEROID_DATA[config.size];
    super(scene, config.x, config.y, data.texture);

    this.size = config.size;
    this.health = data.health;
    this.points = data.points;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCircle(this.width * 0.35);
    if (config.size === 'lg') {
      this.setScale(1.15);
    }
    this.setVelocity(config.velocityX, config.velocityY);
    this.setAngularVelocity(Phaser.Math.Between(-120, 120));
    this.setDepth(5);
  }

  takeHit(): boolean {
    this.health -= 1;
    this.setTint(0xff6666);
    this.scene.time.delayedCall(80, () => this.clearTint());

    if (this.health <= 0) {
      this.destroy();
      return true;
    }
    return false;
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

  static randomConfig(forcedSize?: AsteroidSize): AsteroidConfig {
    const roll = Math.random();
    const size: AsteroidSize =
      forcedSize ?? (roll < 0.35 ? 'lg' : roll < 0.65 ? 'md' : 'sm');
    const data = ASTEROID_DATA[size];
    const speed = data.speed * Phaser.Math.FloatBetween(0.85, 1.15);

    const spawnFromTop = Math.random() < 0.75;
    let x: number;
    let y: number;
    let velocityX: number;
    let velocityY: number;

    if (spawnFromTop) {
      x = Phaser.Math.Between(30, GAME_WIDTH - 30);
      y = Phaser.Math.Between(-80, -20);
      velocityX = Phaser.Math.Between(-60, 60);
      velocityY = speed;
    } else {
      const fromLeft = Math.random() < 0.5;
      x = fromLeft ? -40 : GAME_WIDTH + 40;
      y = Phaser.Math.Between(40, GAME_HEIGHT * 0.6);
      velocityX = fromLeft ? speed * 0.7 : -speed * 0.7;
      velocityY = Phaser.Math.Between(speed * 0.4, speed * 0.9);
    }

    return { size, x, y, velocityX, velocityY };
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
