import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config';

export const LASER_DAMAGE = 1;
export const LASER_SPEED = 180;

export type EnemyLaserSprite = Phaser.Physics.Arcade.Sprite;

export function spawnEnemyLaser(
  group: Phaser.Physics.Arcade.Group,
  x: number,
  y: number,
  angle: number,
): EnemyLaserSprite | null {
  const laser = group.create(x, y, 'enemy-laser') as EnemyLaserSprite | null;
  if (!laser) return null;

  laser.setActive(true);
  laser.setVisible(true);
  laser.setRotation(angle + Math.PI / 2);
  laser.setDepth(7);

  const body = laser.body as Phaser.Physics.Arcade.Body;
  body.setAllowGravity(false);
  body.setCircle(3);

  laser.setVelocity(Math.cos(angle) * LASER_SPEED, Math.sin(angle) * LASER_SPEED);
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
