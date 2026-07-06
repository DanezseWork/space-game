const STORAGE_KEY = 'star-blaster-coins';

export function getCoins(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? Math.max(0, parseInt(raw, 10) || 0) : 0;
  } catch {
    return 0;
  }
}

export function addCoins(amount: number): number {
  const next = getCoins() + Math.max(0, amount);
  try {
    localStorage.setItem(STORAGE_KEY, String(next));
  } catch {
    // ignore storage errors
  }
  return next;
}

export function formatCoinsLabel(): string {
  return `COINS: ${getCoins()}`;
}
