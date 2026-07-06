export type GameMode = 'story' | 'survival';

export interface GameSceneData {
  mode?: GameMode;
  level?: number;
}

export function normalizeGameSceneData(data: GameSceneData = {}): Required<GameSceneData> {
  return {
    mode: data.mode ?? 'survival',
    level: data.level ?? 1,
  };
}
