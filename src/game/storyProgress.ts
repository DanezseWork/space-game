const STORAGE_KEY = 'star-blaster-story-progress';
const MAX_LEVEL = 10;

function readUnlocked(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [1];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [1];
    const levels = parsed
      .map((n) => parseInt(String(n), 10))
      .filter((n) => n >= 1 && n <= MAX_LEVEL);
    if (!levels.includes(1)) levels.unshift(1);
    return [...new Set(levels)].sort((a, b) => a - b);
  } catch {
    return [1];
  }
}

function writeUnlocked(levels: number[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...new Set(levels)].sort((a, b) => a - b)));
  } catch {
    // ignore storage errors
  }
}

export function getUnlockedLevels(): number[] {
  return readUnlocked();
}

export function isLevelUnlocked(level: number): boolean {
  return readUnlocked().includes(level);
}

export function unlockLevel(level: number): void {
  if (level < 1 || level > MAX_LEVEL) return;
  const levels = readUnlocked();
  if (!levels.includes(level)) {
    levels.push(level);
    writeUnlocked(levels);
  }
}

export function getMaxLevelSlots(): number {
  return MAX_LEVEL;
}
