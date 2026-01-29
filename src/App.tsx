import React, { useState, useEffect, useCallback } from 'react';
import { Board } from './components/Board';
import { Dice } from './components/Dice';
import { GameState, PlayerColor, Piece, PlayerType } from './types';
import { PLAYER_COLORS, PLAYER_CONFIG } from './constants';
import { Trophy, Users, Cpu, RotateCcw, MessageSquare } from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const players: any = {};
    PLAYER_COLORS.forEach(color => {
      players[color] = {
        color,
        type: color === 'RED' ? 'HUMAN' : 'AI',
        pieces: Array.from({ length: 4 }, (_, i) => ({ id: color.charCodeAt(0) + i, color, position: -1, isHome: false })),
        ...PLAYER_CONFIG[color]
      };
    });

    return {
      players,
      currentTurn: 'RED',
      diceValue: null,
      isRolling: false,
      gameStatus: 'IDLE',
      winner: null,
      logs: ['Game started. Red\'s turn.']
    };
  });

  const addLog = (msg: string) => {
    setGameState(prev => ({ ...prev, logs: [msg, ...prev.logs].slice(0, 5) }));
  };

  const rollDice = useCallback(() => {
    if (gameState.gameStatus !== 'IDLE' || gameState.isRolling) return;

    setGameState(prev => ({ ...prev, isRolling: true }));
    
    setTimeout(() => {
      const val = Math.floor(Math.random() * 6) + 1;
      setGameState(prev => {
        const canMove = prev.players[prev.currentTurn].pieces.some(p => {
           if (p.position === -1) return val === 6;
           return (p.position + val) <= 57;
        });

        if (!canMove) {
          setTimeout(() => nextTurn(), 1000);
          return { ...prev, diceValue: val, isRolling: false, gameStatus: 'IDLE' };
        }

        return { ...prev, diceValue: val, isRolling: false, gameStatus: 'MOVING' };
      });
      addLog(`${gameState.currentTurn} rolled a ${val}`);
    }, 800);
  }, [gameState]);

  const nextTurn = () => {
    setGameState(prev => {
      const currentIndex = PLAYER_COLORS.indexOf(prev.currentTurn);
      const nextColor = PLAYER_COLORS[(currentIndex + 1) % 4];
      return {
        ...prev,
        currentTurn: nextColor,
        diceValue: null,
        gameStatus: 'IDLE'
      };
    });
  };

  const movePiece = (piece: Piece) => {
    if (gameState.gameStatus !== 'MOVING' || !gameState.diceValue) return;

    setGameState(prev => {
      const newPlayers = { ...prev.players };
      const player = newPlayers[prev.currentTurn];
      const pieceIdx = player.pieces.findIndex(p => p.id === piece.id);
      
      let newPos = piece.position === -1 ? 0 : piece.position + (prev.diceValue || 0);
      
      player.pieces[pieceIdx] = { ...piece, position: newPos, isHome: newPos === 57 };

      // Check win condition
      const win = player.pieces.every(p => p.isHome);

      return {
        ...prev,
        players: newPlayers,
        gameStatus: 'IDLE',
        diceValue: null,
        winner: win ? prev.currentTurn : null,
        currentTurn: prev.diceValue === 6 && !win ? prev.currentTurn : PLAYER_COLORS[(PLAYER_COLORS.indexOf(prev.currentTurn) + 1) % 4]
      };
    });
  };

  // AI Logic
  useEffect(() => {
    if (gameState.players[gameState.currentTurn].type === 'AI' && !gameState.winner) {
      if (gameState.gameStatus === 'IDLE') {
        const timer = setTimeout(rollDice, 1000);
        return () => clearTimeout(timer);
      } else if (gameState.gameStatus === 'MOVING') {
        const timer = setTimeout(() => {
          const movable = gameState.players[gameState.currentTurn].pieces.filter(p => {
             if (p.position === -1) return gameState.diceValue === 6;
             return (p.position + (gameState.diceValue || 0)) <= 57;
          });
          if (movable.length > 0) movePiece(movable[0]);
          else nextTurn();
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [gameState.currentTurn, gameState.gameStatus]);

  const getMovablePieceIds = () => {
    if (gameState.gameStatus !== 'MOVING' || !gameState.diceValue) return [];
    return gameState.players[gameState.currentTurn].pieces
      .filter(p => {
        if (p.position === -1) return gameState.diceValue === 6;
        return (p.position + (gameState.diceValue || 0)) <= 57;
      })
      .map(p => p.id);
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center p-4 md:p-8 font-sans text-zinc-900">
      <header className="w-full max-w-6xl flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-white">
            <Trophy size={24} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">LUDO ELITE</h1>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors font-medium">
            <Users size={18} /> Multiplayer
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors font-medium">
            <Cpu size={18} /> VS AI
          </button>
        </div>
      </header>

      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar Left: Players */}
        <div className="lg:col-span-3 space-y-4">
          {PLAYER_COLORS.map(color => (
            <div 
              key={color} 
              className={`p-4 rounded-xl border-2 transition-all ${
                gameState.currentTurn === color 
                ? 'bg-white border-zinc-900 shadow-lg scale-105' 
                : 'bg-zinc-100 border-transparent opacity-60'
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: PLAYER_CONFIG[color].color }} />
                  <span className="font-bold">{color}</span>
                </div>
                <span className="text-xs font-semibold px-2 py-1 bg-zinc-200 rounded text-zinc-600">
                  {gameState.players[color].type}
                </span>
              </div>
              <div className="mt-3 flex gap-1">
                {gameState.players[color].pieces.map((p, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full ${p.isHome ? 'bg-green-500' : 'bg-zinc-300'}`} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Center: Board */}
        <div className="lg:col-span-6 flex flex-col items-center gap-6">
          <Board 
            pieces={Object.values(gameState.players).flatMap(p => p.pieces)}
            onPieceClick={movePiece}
            movablePieceIds={getMovablePieceIds()}
          />
          <div className="flex items-center gap-8">
            <Dice 
              value={gameState.diceValue}
              isRolling={gameState.isRolling}
              onClick={rollDice}
              disabled={gameState.currentTurn !== 'RED' || gameState.gameStatus !== 'IDLE'}
              color={PLAYER_CONFIG[gameState.currentTurn].color}
            />
          </div>
        </div>

        {/* Sidebar Right: Stats & Logs */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200">
            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <MessageSquare size={16} /> Game Feed
            </h3>
            <div className="space-y-3">
              {gameState.logs.map((log, i) => (
                <div key={i} className="text-sm font-medium text-zinc-700 animate-in fade-in slide-in-from-left-2">
                  {log}
                </div>
              ))}
            </div>
          </div>
          
          <button 
            onClick={() => window.location.reload()} 
            className="w-full flex items-center justify-center gap-2 py-3 bg-zinc-100 text-zinc-600 rounded-xl hover:bg-zinc-200 transition-colors font-bold"
          >
            <RotateCcw size={18} /> Reset Game
          </button>
        </div>
      </main>

      {gameState.winner && (
        <div className="fixed inset-0 bg-zinc-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full text-center">
            <Trophy size={64} className="mx-auto text-yellow-500 mb-6" />
            <h2 className="text-4xl font-black mb-2">{gameState.winner} WINS!</h2>
            <p className="text-zinc-500 mb-8">The board has been conquered by the {gameState.winner.toLowerCase()} champion.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold text-lg hover:bg-zinc-800 transition-all"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;