const STORAGE_KEY = 'star-blaster-auto-fire';
const SOUND_VOLUME_KEY = 'star-blaster-sound-volume';
const MUSIC_VOLUME_KEY = 'star-blaster-music-volume';

const MIN_VOLUME = 0;
const MAX_VOLUME = 100;
const DEFAULT_VOLUME = 100;

function defaultAutoFire(): boolean {
  return typeof window !== 'undefined' && 'ontouchstart' in window;
}

function clampVolume(value: number): number {
  return Math.max(MIN_VOLUME, Math.min(MAX_VOLUME, Math.round(value)));
}

function readVolume(key: string): number {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return DEFAULT_VOLUME;
    const parsed = Number.parseInt(raw, 10);
    if (Number.isNaN(parsed)) return DEFAULT_VOLUME;
    return clampVolume(parsed);
  } catch {
    return DEFAULT_VOLUME;
  }
}

function writeVolume(key: string, value: number): void {
  try {
    localStorage.setItem(key, String(clampVolume(value)));
  } catch {
    // ignore storage errors
  }
}

export function getAutoFire(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return defaultAutoFire();
    return raw === 'true';
  } catch {
    return defaultAutoFire();
  }
}

export function setAutoFire(value: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY, String(value));
  } catch {
    // ignore storage errors
  }
}

export function toggleAutoFire(): boolean {
  const next = !getAutoFire();
  setAutoFire(next);
  return next;
}

export function getFireModeLabel(): string {
  return getAutoFire() ? 'AUTO' : 'MANUAL';
}

export function getSoundVolume(): number {
  return readVolume(SOUND_VOLUME_KEY);
}

export function setSoundVolume(value: number): number {
  const next = clampVolume(value);
  writeVolume(SOUND_VOLUME_KEY, next);
  return next;
}

export function getMusicVolume(): number {
  return readVolume(MUSIC_VOLUME_KEY);
}

export function setMusicVolume(value: number): number {
  const next = clampVolume(value);
  writeVolume(MUSIC_VOLUME_KEY, next);
  return next;
}
