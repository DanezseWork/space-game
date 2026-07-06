import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config';

export const LASER_DAMAGE = 1;
export const LASER_SPEED = 180;

export interface EnemyLaserOptions {
  damage?: number;
  speed?: number;
  isSpecial?: boolean;
}

export type EnemyLaserSprite = Phaser.Physics.Arcade.Sprite;

export function spawnEnemyLaser(
  group: Phaser.Physics.Arcade.Group,
  x: number,
  y: number,
  angle: number,
  options: EnemyLaserOptions = {},
): EnemyLaserSprite | null {
  const laser = group.create(x, y, 'enemy-laser') as EnemyLaserSprite | null;
  if (!laser) return null;

  const damage = options.damage ?? LASER_DAMAGE;
  const speed = options.speed ?? LASER_SPEED;

  laser.setActive(true);
  laser.setVisible(true);
  laser.setRotation(angle + Math.PI / 2);
  laser.setDepth(7);
  laser.setData('damage', damage);

  if (options.isSpecial) {
    laser.setTint(0xff44ff);
    laser.setScale(1.6);
    laser.setData('isSpecial', true);
  }

  const body = laser.body as Phaser.Physics.Arcade.Body;
  body.setAllowGravity(false);
  body.setCircle(options.isSpecial ? 5 : 3);

  laser.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
  return laser;
}

export function isEnemyLaserOffScreen(laser: EnemyLaserSprite): boolean {
  const margin = 40;
  return (
    laser.x < -margin ||
    laser.x > GAME_WIDTH + margin ||
    laser.y < -margin ||
    laser.y > GAME_HEIGHT + margin
  );
}
