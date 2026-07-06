import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config';
import { formatCoinsLabel } from '../coins';
import { getMaxLevelSlots, isLevelUnlocked } from '../storyProgress';
import { createMenuButton } from '../ui/MenuButtons';

export class LevelSelectScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LevelSelectScene' });
  }

  create(): void {
    this.cameras.main.fadeIn(400, 0, 0, 0);

    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x0a0e27);

    this.add.text(GAME_WIDTH / 2, 100, 'SELECT LEVEL', {
      fontFamily: 'Orbitron, sans-serif',
      fontSize: '28px',
      fontStyle: '900',
      color: '#00d4ff',
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 140, formatCoinsLabel(), {
      fontFamily: 'Orbitron, sans-serif',
      fontSize: '14px',
      color: '#ffcc00',
    }).setOrigin(0.5);

    const maxLevels = getMaxLevelSlots();
    const startY = 220;
    const gap = 52;

    for (let level = 1; level <= maxLevels; level++) {
      const unlocked = isLevelUnlocked(level);
      const y = startY + (level - 1) * gap;

      if (unlocked) {
        const { container } = createMenuButton(this, {
          label: `LEVEL ${level}`,
          y,
          color: 0x00d4ff,
          onClick: () => this.startLevel(level),
        });
        container.setX(GAME_WIDTH / 2);
      } else {
        this.add.text(GAME_WIDTH / 2, y, `LEVEL ${level}  LOCKED`, {
          fontFamily: 'Orbitron, sans-serif',
          fontSize: '16px',
          color: '#445566',
        }).setOrigin(0.5);
      }
    }

    const backY = startY + maxLevels * gap + 20;
    const { container: backBtn } = createMenuButton(this, {
      label: 'BACK',
      y: backY,
      color: 0x8899bb,
      onClick: () => this.transitionTo('MenuScene'),
    });
    backBtn.setX(GAME_WIDTH / 2);
  }

  private startLevel(level: number): void {
    this.transitionTo('GameScene', { mode: 'story', level });
  }

  private transitionTo(sceneKey: string, data?: object): void {
    this.cameras.main.fadeOut(300, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start(sceneKey, data);
    });
  }
}
