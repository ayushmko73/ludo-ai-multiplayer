import React from 'react';
import { Cell } from './Cell';
import { Piece as PieceComponent } from './Piece';
import { PlayerColor, Piece } from '../types';

interface BoardProps {
  pieces: Piece[];
  onPieceClick: (piece: Piece) => void;
  movablePieceIds: number[];
}

export const Board: React.FC<BoardProps> = ({ pieces, onPieceClick, movablePieceIds }) => {
  const renderCells = () => {
    const cells = [];
    // 15x15 Ludo layout logic
    for (let y = 0; y < 15; y++) {
      for (let x = 0; x < 15; x++) {
        let type: 'path' | 'yard' | 'home' | 'safe' | 'end' = 'path';
        let color: PlayerColor | 'neutral' = 'neutral';

        // Yards
        if (x < 6 && y < 6) { type = 'yard'; color = 'RED'; }
        else if (x > 8 && y < 6) { type = 'yard'; color = 'BLUE'; }
        else if (x < 6 && y > 8) { type = 'yard'; color = 'GREEN'; }
        else if (x > 8 && y > 8) { type = 'yard'; color = 'YELLOW'; }
        // Paths and Home stretches
        else if (x >= 6 && x <= 8 && y >= 6 && y <= 8) { type = 'end'; }
        else {
          if (x === 7 && y > 0 && y < 6) { type = 'home'; color = 'RED'; }
          if (x === 7 && y > 8 && y < 14) { type = 'home'; color = 'YELLOW'; }
          if (y === 7 && x > 0 && x < 6) { type = 'home'; color = 'GREEN'; }
          if (y === 7 && x > 8 && x < 14) { type = 'home'; color = 'BLUE'; }
        }

        cells.push(<Cell key={`${x}-${y}`} x={x} y={y} type={type} color={color} />);
      }
    }
    return cells;
  };

  return (
    <div className="relative w-full aspect-square max-w-[600px] bg-white rounded-xl shadow-2xl border-8 border-zinc-800 overflow-hidden grid grid-cols-15 grid-rows-15">
      {renderCells()}
      {pieces.map((piece, idx) => (
        <PieceComponent 
          key={piece.id} 
          piece={piece} 
          isMovable={movablePieceIds.includes(piece.id)} 
          onClick={() => onPieceClick(piece)}
          index={idx % 4}
        />
      ))}
    </div>
  );
};