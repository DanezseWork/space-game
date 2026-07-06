import { updateSurvivalHighScore, getSurvivalHighScore, formatSurvivalHighScoreLabel } from './survivalHighScore';
import type { GameMode } from './gameMode';

export function goToTitleScreen(scene: Phaser.Scene): void {
  scene.time.paused = false;
  scene.tweens.resumeAll();

  scene.cameras.main.fadeOut(300, 0, 0, 0);
  scene.cameras.main.once('camerafadeoutcomplete', () => {
    scene.scene.start('MenuScene');
  });
}

export function goToLevelSelect(scene: Phaser.Scene): void {
  scene.time.paused = false;
  scene.tweens.resumeAll();

  scene.cameras.main.fadeOut(300, 0, 0, 0);
  scene.cameras.main.once('camerafadeoutcomplete', () => {
    scene.scene.start('LevelSelectScene');
  });
}

export function restartGame(scene: Phaser.Scene, score: number, mode: GameMode, level: number): void {
  if (mode === 'survival') {
    updateSurvivalHighScore(score);
  }
  scene.scene.restart({ mode, level });
}

export function saveScoreAndGoToTitle(scene: Phaser.Scene, score: number, mode: GameMode): void {
  if (mode === 'survival') {
    updateSurvivalHighScore(score);
  }
  goToTitleScreen(scene);
}

export function formatHighScoreLabel(): string {
  return formatSurvivalHighScoreLabel();
}

export { getSurvivalHighScore as getHighScore, updateSurvivalHighScore as updateHighScore };
export { quitGame } from './quitGame';
