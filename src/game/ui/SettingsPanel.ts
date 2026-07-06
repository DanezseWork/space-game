import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config';
import { getAutoFire, getFireModeLabel, toggleAutoFire } from '../settings';
import { createMenuButton } from './MenuButtons';

export interface SettingsPanelOptions {
  onBack: () => void;
  onAutoFireChange?: (autoFire: boolean) => void;
}

export interface SettingsPanelResult {
  root: Phaser.GameObjects.Container;
  destroy: () => void;
}

export function createSettingsPanel(
  scene: Phaser.Scene,
  depth: number,
  options: SettingsPanelOptions,
): SettingsPanelResult {
  const root = scene.add.container(0, 0).setDepth(depth);

  const overlay = scene.add.rectangle(
    GAME_WIDTH / 2,
    GAME_HEIGHT / 2,
    GAME_WIDTH,
    GAME_HEIGHT,
    0x000000,
    0.85,
  );
  root.add(overlay);

  const title = scene.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 120, 'SETTINGS', {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '32px',
    fontStyle: '900',
    color: '#00d4ff',
  }).setOrigin(0.5);
  root.add(title);

  root.add(
    scene.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 50, 'Firing mode', {
      fontFamily: 'Orbitron, sans-serif',
      fontSize: '14px',
      color: '#8899bb',
    }).setOrigin(0.5),
  );

  const modeText = scene.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 20, getFireModeLabel(), {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '20px',
    fontStyle: '700',
    color: '#ffcc00',
  }).setOrigin(0.5);
  root.add(modeText);

  const hint = scene.add.text(
    GAME_WIDTH / 2,
    GAME_HEIGHT / 2 + 90,
    getAutoFire() ? 'Ship fires continuously' : 'Press Space or tap FIRE to shoot',
    {
      fontFamily: 'Orbitron, sans-serif',
      fontSize: '12px',
      color: '#556677',
      align: 'center',
    },
  ).setOrigin(0.5);
  root.add(hint);

  const { container: toggleBtn } = createMenuButton(scene, {
    label: 'TOGGLE AUTO / MANUAL',
    y: GAME_HEIGHT / 2 + 30,
    color: 0xffcc00,
    onClick: () => {
      const autoFire = toggleAutoFire();
      modeText.setText(getFireModeLabel());
      hint.setText(
        autoFire ? 'Ship fires continuously' : 'Press Space or tap FIRE to shoot',
      );
      options.onAutoFireChange?.(autoFire);
    },
  });
  toggleBtn.setX(GAME_WIDTH / 2);
  root.add(toggleBtn);

  const { container: backBtn } = createMenuButton(scene, {
    label: 'BACK',
    y: GAME_HEIGHT / 2 + 160,
    onClick: () => options.onBack(),
  });
  backBtn.setX(GAME_WIDTH / 2);
  root.add(backBtn);

  return {
    root,
    destroy: () => root.destroy(),
  };
}
