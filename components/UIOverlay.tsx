
import React from 'react';
import { Challenge } from '../types';

interface UIOverlayProps {
  score: number;
  combo: number;
  challenge: Challenge;
}

const UIOverlay: React.FC<UIOverlayProps> = ({ score, combo, challenge }) => {
  return (
    <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div className="bg-black/20 backdrop-blur-md p-4 rounded-2xl border border-white/10">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Current Score</p>
          <p className="text-5xl font-black text-white">{score}</p>
        </div>

        <div className="text-right max-w-[200px]">
          <h3 className="text-white font-bold text-lg leading-tight">{challenge.title}</h3>
          <p className="text-slate-400 text-xs mt-1">{challenge.description}</p>
          <div className="mt-2 flex gap-2 justify-end">
             <span className="bg-white/10 px-2 py-1 rounded-lg text-[10px] text-white/50 border border-white/5 uppercase">Target: {challenge.targetScore}</span>
             <span className="bg-sky-500/20 px-2 py-1 rounded-lg text-[10px] text-sky-400 border border-sky-500/20 uppercase">Gravity: {challenge.gravity.toFixed(1)}x</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center mb-8">
        <div className="bg-white/5 backdrop-blur-sm px-6 py-2 rounded-full border border-white/10 flex items-center gap-4">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Bounce Power</span>
            <div className="w-24 h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
               <div className="h-full bg-sky-500 transition-all" style={{ width: '80%' }}></div>
            </div>
          </div>
          <div className="h-4 w-px bg-white/10"></div>
          <div className="text-white font-bold text-sm tracking-widest uppercase">
            Click Blocks To Nudge
          </div>
        </div>
      </div>
    </div>
  );
};

export default UIOverlay;
