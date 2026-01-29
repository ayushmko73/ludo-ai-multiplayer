import React from 'react';
import { motion } from 'framer-motion';
import { LucideDice1, LucideDice2, LucideDice3, LucideDice4, LucideDice5, LucideDice6 } from 'lucide-react';

const Icons = [LucideDice1, LucideDice2, LucideDice3, LucideDice4, LucideDice5, LucideDice6];

interface DiceProps {
  value: number | null;
  isRolling: boolean;
  onClick: () => void;
  disabled: boolean;
  color: string;
}

export const Dice: React.FC<DiceProps> = ({ value, isRolling, onClick, disabled, color }) => {
  const Icon = value ? Icons[value - 1] : LucideDice1;

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.1 }}
      whileTap={{ scale: disabled ? 1 : 0.9 }}
      onClick={onClick}
      disabled={disabled}
      className={`relative p-4 rounded-2xl bg-white shadow-xl border-4 transition-all ${disabled ? 'opacity-50 grayscale' : 'cursor-pointer hover:shadow-2xl'}`}
      style={{ borderColor: color }}
    >
      <motion.div
        animate={isRolling ? {
          rotate: [0, 90, 180, 270, 360],
          scale: [1, 1.2, 1],
          x: [0, -5, 5, -5, 0]
        } : {}}
        transition={{ duration: 0.4, repeat: isRolling ? Infinity : 0 }}
      >
        <Icon size={48} className="text-zinc-800" />
      </motion.div>
      {isRolling && <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-sm font-bold animate-bounce uppercase tracking-widest text-zinc-500">Rolling...</div>}
    </motion.button>
  );
};