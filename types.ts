
export interface GameStats {
  score: number;
  highScore: number;
  blocksJuggled: number;
  maxCombo: number;
  timeElapsed: number;
}

export interface Challenge {
  title: string;
  description: string;
  gravity: number;
  restitution: number; // bounciness
  spawnRate: number;
  theme: string;
  targetScore: number;
}

export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  GAMEOVER = 'GAMEOVER',
  CHALLENGE_SELECT = 'CHALLENGE_SELECT'
}

export interface ThemeColors {
  background: string;
  platform: string;
  blocks: string[];
  accent: string;
}
