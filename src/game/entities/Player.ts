import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config';
import {
  buildFirePattern,
  computePlayerPowerScore,
  createDefaultLoadout,
  getWeaponById,
  type BulletSpawn,
  type WeaponLoadout,
} from '../weapons';

export class Player extends Phaser.Physics.Arcade.Sprite {
  private readonly baseMaxSpeed = 280;
  private readonly drag = 600;
  private lastFired = 0;
  private thruster?: Phaser.GameObjects.Particles.ParticleEmitter;
  private isMoving = false;

  private invincible = false;
  private invincibleTimer?: Phaser.Time.TimerEvent;
  private rainbowGlow?: Phaser.GameObjects.Graphics;
  private rainbowTween?: Phaser.Tweens.Tween;
  private glowHue = 0;

  private loadout: WeaponLoadout = createDefaultLoadout();
  private ownedWeaponIds: string[] = [];

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'rocket');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.setDrag(this.drag);
    this.applySpeedMultiplier();
    this.setSize(20, 36);
    this.setOffset(6, 8);
    this.setDepth(10);

    this.createThruster();
  }

  private applySpeedMultiplier(): void {
    this.setMaxVelocity(this.baseMaxSpeed * this.loadout.speedMultiplier);
  }

  getOwnedWeaponIds(): string[] {
    return [...this.ownedWeaponIds];
  }

  getOwnedWeaponNames(): string[] {
    return this.ownedWeaponIds
      .map((id) => getWeaponById(id)?.name)
      .filter((name): name is string => name !== undefined);
  }

  addWeapon(weaponId: string): boolean {
    if (this.ownedWeaponIds.includes(weaponId)) return false;
    const weapon = getWeaponById(weaponId);
    if (!weapon) return false;

    weapon.apply(this.loadout);
    this.ownedWeaponIds.push(weaponId);
    this.applySpeedMultiplier();
    return true;
  }

  getFirePattern(): BulletSpawn[] {
    return buildFirePattern(this.loadout);
  }

  getFireCooldownMs(): number {
    return this.loadout.fireCooldownMs;
  }

  getLoadout(): WeaponLoadout {
    return { ...this.loadout };
  }

  getPowerScore(): number {
    return computePlayerPowerScore(this.loadout, this.ownedWeaponIds.length);
  }

  private createThruster(): void {
    this.thruster = this.scene.add.particles(0, 0, 'particle', {
      speed: { min: 40, max: 100 },
      scale: { start: 0.6, end: 0 },
      alpha: { start: 0.8, end: 0 },
      lifespan: 300,
      tint: [0xff6b35, 0xffcc00, 0xff4400],
      angle: { min: 80, max: 100 },
      frequency: -1,
      follow: this,
      followOffset: { x: 0, y: 24 },
    });
    this.thruster.setDepth(9);
  }

  isInvincible(): boolean {
    return this.invincible;
  }

  activateInvincibility(durationMs: number): void {
    this.invincible = true;
    this.invincibleTimer?.remove(false);
    this.invincibleTimer = this.scene.time.delayedCall(durationMs, () => {
      this.deactivateInvincibility();
    });
    this.startRainbowGlow();
  }

  deactivateInvincibility(): void {
    this.invincible = false;
    this.invincibleTimer?.remove(false);
    this.invincibleTimer = undefined;
    this.stopRainbowGlow();
  }

  private startRainbowGlow(): void {
    this.stopRainbowGlow();

    this.rainbowGlow = this.scene.add.graphics();
    this.rainbowGlow.setDepth(9);
    this.drawRainbowGlow();

    this.rainbowTween = this.scene.tweens.add({
      targets: this,
      glowHue: 360,
      duration: 1500,
      repeat: -1,
      onUpdate: () => this.drawRainbowGlow(),
    });
  }

  private stopRainbowGlow(): void {
    this.rainbowTween?.stop();
    this.rainbowTween = undefined;
    this.rainbowGlow?.destroy();
    this.rainbowGlow = undefined;
    this.glowHue = 0;
  }

  private drawRainbowGlow(): void {
    if (!this.rainbowGlow) return;

    const color = Phaser.Display.Color.HSVToRGB(this.glowHue / 360, 1, 1) as Phaser.Display.Color;
    const colorHex = color.color;

    this.rainbowGlow.clear();
    this.rainbowGlow.setPosition(this.x, this.y);

    this.rainbowGlow.fillStyle(colorHex, 0.15);
    this.rainbowGlow.fillCircle(0, 0, 36);

    this.rainbowGlow.lineStyle(3, colorHex, 0.7);
    this.rainbowGlow.strokeCircle(0, 0, 28);

    this.rainbowGlow.lineStyle(2, colorHex, 0.4);
    this.rainbowGlow.strokeCircle(0, 0, 34);
  }

  moveByVector(vx: number, vy: number): void {
    const len = Math.sqrt(vx * vx + vy * vy);
    if (len < 0.1) {
      this.isMoving = false;
      return;
    }

    this.isMoving = true;
    const nx = vx / len;
    const ny = vy / len;
    this.setAcceleration(nx * 800, ny * 800);

    const angle = Phaser.Math.RadToDeg(Math.atan2(ny, nx)) + 90;
    this.setRotation(Phaser.Math.DegToRad(angle));
  }

  stopMove(): void {
    this.setAcceleration(0, 0);
    this.isMoving = false;
  }

  updateThruster(_time: number, _delta: number): void {
    if (this.isMoving && this.thruster) {
      this.thruster.emitParticle();
    }
    if (this.invincible && this.rainbowGlow) {
      this.drawRainbowGlow();
    }
  }

  canFire(time: number): boolean {
    return time > this.lastFired + this.loadout.fireCooldownMs;
  }

  consumeFire(time: number): void {
    this.lastFired = time;
  }

  getBulletSpawnPoint(): { x: number; y: number } {
    return { x: this.x, y: this.y - 26 };
  }

  moveTowardTarget(tx: number, ty: number, strength = 1): void {
    const dx = tx - this.x;
    const dy = ty - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 8) {
      this.stopMove();
      return;
    }

    this.moveByVector((dx / dist) * strength, (dy / dist) * strength);
  }

  clampToBounds(): void {
    this.x = Phaser.Math.Clamp(this.x, 20, GAME_WIDTH - 20);
    this.y = Phaser.Math.Clamp(this.y, 40, GAME_HEIGHT - 40);
  }

  destroy(fromScene?: boolean): void {
    this.deactivateInvincibility();
    this.thruster?.destroy();
    super.destroy(fromScene);
  }
}
