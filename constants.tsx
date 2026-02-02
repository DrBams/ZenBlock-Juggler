
import { ThemeColors } from './types';

export const THEMES: Record<string, ThemeColors> = {
  NEON: {
    background: 'bg-slate-950',
    platform: '#0ea5e9',
    blocks: ['#f43f5e', '#8b5cf6', '#d946ef', '#10b981'],
    accent: 'text-sky-400'
  },
  PASTEL: {
    background: 'bg-orange-50',
    platform: '#fb923c',
    blocks: ['#fecaca', '#bfdbfe', '#bbf7d0', '#fef08a'],
    accent: 'text-orange-500'
  },
  CYBERPUNK: {
    background: 'bg-purple-950',
    platform: '#f472b6',
    blocks: ['#4ade80', '#fbbf24', '#f87171', '#2dd4bf'],
    accent: 'text-pink-500'
  }
};

export const INITIAL_STATS = {
  score: 0,
  highScore: 0,
  blocksJuggled: 0,
  maxCombo: 1,
  timeElapsed: 0
};
