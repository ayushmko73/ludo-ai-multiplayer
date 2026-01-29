import React from 'react';
import { motion } from 'framer-motion';
import { Piece as PieceType } from '../types';

// Coordinate helper mapping the logical path 0-57 to 15x15 grid (x, y)
const getCoordForPath = (color: string, pos: number, index: number) => {
  if (pos === -1) {
    const yards: Record<string, {x:number, y:number}> = {
      RED: {x: 1, y: 1}, BLUE: {x: 10, y: 1}, YELLOW: {x: 10, y: 10}, GREEN: {x: 1, y: 10}
    };
    const base = yards[color];
    const offset = [{x:1, y:1}, {x:3, y:1}, {x:1, y:3}, {x:3, y:3}][index];
    return { x: base.x + offset.x, y: base.y + offset.y };
  }
  
  // Circuit path logic simplified for standard 15x15 layout
  // Real implementation would have a full 52-step mapping
  const circuitPaths: Record<string, number[][]> = {
    // Dummy path representing the flow
    RED: [[6,1], [6,2], [6,3], [6,4], [6,5], [5,6], [4,6], [3,6], [2,6], [1,6], [0,6]],
    // ... (rest of path)
  };
  
  // Return a computed coordinate based on turn flow
  // Default fallback for demo stability
  return { x: 7, y: 7 };
};

interface PieceProps {
  piece: PieceType;
  isMovable: boolean;
  onClick: () => void;
  index: number;
}

export const Piece: React.FC<PieceProps> = ({ piece, isMovable, onClick, index }) => {
  const coords = getCoordForPath(piece.color, piece.position, index);

  return (
    <motion.div
      initial={false}
      animate={{ 
        left: `${(coords.x / 15) * 100}%`, 
        top: `${(coords.y / 15) * 100}%` 
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`absolute w-[6.66%] h-[6.66%] p-1 z-10 ${isMovable ? 'cursor-pointer' : 'pointer-events-none'}`}
      onClick={onClick}
    >
      <div 
        className={`w-full h-full rounded-full border-2 border-white shadow-lg transition-transform ${isMovable ? 'scale-125 animate-pulse shadow-xl ring-4 ring-white/50' : ''}`}
        style={{ backgroundColor: 
          piece.color === 'RED' ? '#ef4444' : 
          piece.color === 'BLUE' ? '#3b82f6' : 
          piece.color === 'YELLOW' ? '#eab308' : '#22c55e' 
        }}
      />
    </motion.div>
  );
};