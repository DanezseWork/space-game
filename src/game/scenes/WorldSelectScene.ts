import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config';
import { formatCoinsLabel } from '../coins';
import { WORLDS } from '../worlds';
import {
  createWorldOverviewCard,
  getWorldOverviewCardHeight,
  getWorldOverviewCardWidth,
} from '../ui/WorldOverviewCard';
import { createMenuButton } from '../ui/MenuButtons';

export class WorldSelectScene extends Phaser.Scene {
  constructor() {
    super({ key: 'WorldSelectScene' });
  }

  create(): void {
    this.cameras.main.fadeIn(400, 0, 0, 0);

    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x0a0e27);

    this.add.text(GAME_WIDTH / 2, 72, 'SELECT WORLD', {
      fontFamily: 'Orbitron, sans-serif',
      fontSize: '28px',
      fontStyle: '900',
      color: '#00d4ff',
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 108, formatCoinsLabel(), {
      fontFamily: 'Orbitron, sans-serif',
      fontSize: '14px',
      color: '#ffcc00',
    }).setOrigin(0.5);

    const cardW = getWorldOverviewCardWidth();
    const cardH = getWorldOverviewCardHeight();
    const colGap = 16;
    const rowGap = 20;
    const gridW = cardW * 2 + colGap;
    const startX = GAME_WIDTH / 2 - gridW / 2 + cardW / 2;
    const startY = 168 + cardH / 2;

    WORLDS.forEach((world, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = startX + col * (cardW + colGap);
      const y = startY + row * (cardH + rowGap);

      createWorldOverviewCard(this, {
        x,
        y,
        world,
        onClick: world.locked
          ? undefined
          : () => this.transitionTo('LevelSelectScene', { worldId: world.id }),
      });
    });

    const backY = startY + 2 * (cardH + rowGap) + 24;
    const { container: backBtn } = createMenuButton(this, {
      label: 'BACK',
      y: backY,
      color: 0x8899bb,
      onClick: () => this.transitionTo('ModeSelectScene'),
    });
    backBtn.setX(GAME_WIDTH / 2);
  }

  private transitionTo(sceneKey: string, data?: object): void {
    this.cameras.main.fadeOut(300, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start(sceneKey, data);
    });
  }
}
