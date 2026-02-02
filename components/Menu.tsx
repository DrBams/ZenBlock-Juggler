
import React from 'react';
import { Play, Trophy, Sparkles, Loader2 } from 'lucide-react';

interface MenuProps {
  onStart: (diff: string) => void;
  highScore: number;
  isLoading: boolean;
}

const Menu: React.FC<MenuProps> = ({ onStart, highScore, isLoading }) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white text-center">
      <div className="mb-12 animate-bounce-slow">
        <div className="relative inline-block">
          <h1 className="text-7xl font-black italic tracking-tighter drop-shadow-2xl">
            ZEN<span className="text-sky-500">BLOCK</span>
          </h1>
          <div className="absolute -right-8 -top-4 text-sky-400 animate-pulse">
            <Sparkles size={32} />
          </div>
        </div>
        <p className="text-slate-400 mt-2 font-medium tracking-widest uppercase">The AI Juggling Experience</p>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-4">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <Loader2 className="animate-spin text-sky-500" size={48} />
            <p className="text-sky-200 animate-pulse">AI is crafting your challenge...</p>
          </div>
        ) : (
          <>
            <button 
              onClick={() => onStart("Easy")}
              className="group relative w-full py-5 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-2xl font-bold text-xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-emerald-900/40"
            >
              <span className="flex items-center justify-center gap-2">
                <Play fill="white" size={24} /> Zen Mode
              </span>
            </button>
            <button 
              onClick={() => onStart("Insane")}
              className="group relative w-full py-5 bg-gradient-to-r from-sky-600 to-indigo-500 rounded-2xl font-bold text-xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-sky-900/40"
            >
              <span className="flex items-center justify-center gap-2">
                AI Challenge
              </span>
            </button>
          </>
        )}
      </div>

      <div className="mt-16 flex flex-col items-center">
        <div className="flex items-center gap-2 text-slate-400 mb-2">
          <Trophy size={18} />
          <span className="text-sm font-bold tracking-widest uppercase">Personal Best</span>
        </div>
        <span className="text-4xl font-black text-white">{highScore}</span>
      </div>

      <div className="mt-12 text-slate-500 text-xs max-w-xs leading-relaxed">
        Click on blocks to juggle them. Keep them on the platform or in the air. 
        Don't let them touch the floor!
      </div>
    </div>
  );
};

export default Menu;
