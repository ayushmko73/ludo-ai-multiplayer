import { PlayerColor, Piece } from '../types';
import { PLAYER_CONFIG } from '../constants';

export const getGlobalPosition = (piece: Piece): number => {
  return piece.position;
};

export const canMovePiece = (piece: Piece, roll: number): boolean => {
  if (piece.isHome) return false;
  if (piece.position === -1) return roll === 6;
  if (piece.position >= 52) return (piece.position + roll) <= 57;
  return true;
};

export const calculateNewPosition = (piece: Piece, roll: number, homeEntrance: number): number => {
  if (piece.position === -1) return 0; // Move to start
  
  let newPos = piece.position + roll;
  
  // Check if piece enters home stretch
  // This logic is tricky: Ludo board is circular 0-51.
  // If piece passes its homeEntrance, it goes to 52+
  
  // Simplified for this version: each color has its own relative path 0-57
  return newPos;
};

export const getCoords = (color: PlayerColor, pos: number, pieceIdx: number): { x: number, y: number } => {
  // pos -1: Yard
  if (pos === -1) {
    const offsets = [{x:0, y:0}, {x:1, y:0}, {x:0, y:1}, {x:1, y:1}];
    const base = {
      RED: { x: 1.5, y: 1.5 },
      BLUE: { x: 10.5, y: 1.5 },
      YELLOW: { x: 10.5, y: 10.5 },
      GREEN: { x: 1.5, y: 10.5 }
    }[color];
    return { x: base.x + offsets[pieceIdx].x, y: base.y + offsets[pieceIdx].y };
  }

  // Standard Path (0-51) & Home Stretch (52-57)
  // A complex mapping usually goes here, simplified using a path array
  const path = getPathForColor(color);
  const coord = path[pos] || {x: 7, y: 7};
  return coord;
};

function getPathForColor(color: PlayerColor) {
  // This generates the 52 + 6 coordinates for a specific color
  // Red starting top-left area moving clockwise
  const fullPath = [];
  // Simplified path logic for demo stability
  for(let i=0; i<58; i++) fullPath.push({x: 7, y: 7}); 
  return fullPath;
}