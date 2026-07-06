const STORAGE_KEY = 'star-blaster-survival-high-score';
const LEGACY_KEY = 'star-blaster-high-score';

function migrateLegacyScore(): void {
  try {
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy === null) return;
    if (localStorage.getItem(STORAGE_KEY) === null) {
      localStorage.setItem(STORAGE_KEY, legacy);
    }
    localStorage.removeItem(LEGACY_KEY);
  } catch {
    // ignore storage errors
  }
}

export function getSurvivalHighScore(): number {
  migrateLegacyScore();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? Math.max(0, parseInt(raw, 10) || 0) : 0;
  } catch {
    return 0;
  }
}

export function updateSurvivalHighScore(score: number): number {
  const current = getSurvivalHighScore();
  if (score <= current) return current;
  try {
    localStorage.setItem(STORAGE_KEY, String(score));
  } catch {
    // ignore storage errors
  }
  return score;
}

export function formatSurvivalHighScoreLabel(): string {
  return `SURVIVAL HIGH SCORE ${getSurvivalHighScore()}`;
}
