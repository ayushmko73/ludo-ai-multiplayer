export type PlayerColor = 'RED' | 'BLUE' | 'YELLOW' | 'GREEN';
export type PlayerType = 'HUMAN' | 'AI';

export interface Piece {
  id: number;
  color: PlayerColor;
  position: number; // -1 for yard, 0-51 for board, 52-57 for home stretch
  isHome: boolean;
}

export interface Player {
  color: PlayerColor;
  type: PlayerType;
  pieces: Piece[];
  startPos: number;
  homeEntrance: number;
}

export interface GameState {
  players: Record<PlayerColor, Player>;
  currentTurn: PlayerColor;
  diceValue: number | null;
  isRolling: boolean;
  gameStatus: 'IDLE' | 'ROLLING' | 'MOVING' | 'FINISHED';
  winner: PlayerColor | null;
  logs: string[];
}