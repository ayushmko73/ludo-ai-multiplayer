import React from 'react';
import { PlayerColor } from '../types';
import { Star } from 'lucide-react';

interface CellProps {
  x: number;
  y: number;
  type: 'path' | 'home' | 'safe' | 'yard' | 'end';
  color?: PlayerColor | 'neutral';
}

export const Cell: React.FC<CellProps> = ({ x, y, type, color }) => {
  const getBgColor = () => {
    if (type === 'yard' || type === 'home') {
       switch(color) {
         case 'RED': return 'bg-red-500';
         case 'BLUE': return 'bg-blue-500';
         case 'YELLOW': return 'bg-yellow-500';
         case 'GREEN': return 'bg-green-500';
         default: return 'bg-zinc-100';
       }
    }
    if (type === 'safe') return 'bg-zinc-200';
    if (type === 'end') return 'bg-zinc-800';
    return 'bg-white';
  };

  return (
    <div 
      className={`w-full h-full border-[0.5px] border-zinc-200 flex items-center justify-center ${getBgColor()}`}
      style={{ gridColumnStart: x + 1, gridRowStart: y + 1 }}
    >
      {type === 'safe' && <Star size={12} className="text-zinc-400" />}
    </div>
  );
};