const STORAGE_KEY = 'star-blaster-auto-fire';

function defaultAutoFire(): boolean {
  return typeof window !== 'undefined' && 'ontouchstart' in window;
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
