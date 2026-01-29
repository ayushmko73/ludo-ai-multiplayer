import { PlayerColor } from './types';

export const PLAYER_COLORS: PlayerColor[] = ['RED', 'BLUE', 'YELLOW', 'GREEN'];

export const BOARD_PATH_LENGTH = 52;
export const HOME_STRETCH_LENGTH = 6;

export const PLAYER_CONFIG = {
  RED: { startPos: 0, homeEntrance: 50, color: '#ef4444' },
  BLUE: { startPos: 13, homeEntrance: 11, color: '#3b82f6' },
  YELLOW: { startPos: 26, homeEntrance: 24, color: '#eab308' },
  GREEN: { startPos: 39, homeEntrance: 37, color: '#22c55e' }
};

export const SAFE_POSITIONS = [0, 8, 13, 21, 26, 34, 39, 47];

// 15x15 grid mapping
export const GRID_MAP: Record<number, { x: number, y: number }> = {
  // Red Home Area
  // ... will be computed by a helper function to keep JSON slim
};