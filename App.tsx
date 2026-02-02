
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, GameStats, Challenge } from './types';
import { INITIAL_STATS, THEMES } from './constants';
import GameCanvas from './components/GameCanvas';
import UIOverlay from './components/UIOverlay';
import Menu from './components/Menu';
import { generateChallenge, getAIFeedback } from './services/geminiService';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [stats, setStats] = useState<GameStats>(INITIAL_STATS);
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [aiCoachMsg, setAiCoachMsg] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem('zenblock_highscore');
    if (saved) {
      setStats(prev => ({ ...prev, highScore: parseInt(saved) }));
    }
  }, []);

  const handleStartGame = useCallback(async (difficulty: string = "Normal") => {
    setIsLoading(true);
    try {
      const challenge = await generateChallenge(difficulty);
      setCurrentChallenge(challenge);
      setStats(prev => ({ ...prev, score: 0, blocksJuggled: 0, maxCombo: 1 }));
      setGameState(GameState.PLAYING);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleGameOver = useCallback(async (finalStats: GameStats) => {
    setStats(prev => {
      const newHighScore = Math.max(prev.highScore, finalStats.score);
      localStorage.setItem('zenblock_highscore', newHighScore.toString());
      return { ...finalStats, highScore: newHighScore };
    });
    setGameState(GameState.GAMEOVER);
    
    // Get AI Feedback
    const feedback = await getAIFeedback(finalStats);
    setAiCoachMsg(feedback);
  }, []);

  const goToMenu = () => setGameState(GameState.MENU);

  return (
    <div className={`relative w-full h-screen overflow-hidden ${currentChallenge ? THEMES[currentChallenge.theme]?.background : 'bg-slate-950'} transition-colors duration-1000`}>
      {gameState === GameState.MENU && (
        <Menu 
          onStart={handleStartGame} 
          highScore={stats.highScore} 
          isLoading={isLoading} 
        />
      )}

      {gameState === GameState.PLAYING && currentChallenge && (
        <>
          <GameCanvas 
            challenge={currentChallenge} 
            onGameOver={handleGameOver} 
          />
          <UIOverlay 
            score={stats.score} 
            combo={stats.maxCombo} 
            challenge={currentChallenge}
          />
        </>
      )}

      {gameState === GameState.GAMEOVER && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
          <div className="bg-white/10 p-8 rounded-3xl border border-white/20 text-center max-w-md w-full animate-in fade-in zoom-in duration-300">
            <h2 className="text-4xl font-bold text-white mb-2">Game Over</h2>
            <div className="flex justify-between items-center mb-6 px-4">
              <div className="text-left">
                <p className="text-slate-400 text-sm uppercase tracking-widest">Score</p>
                <p className="text-3xl font-extrabold text-white">{stats.score}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-sm uppercase tracking-widest">Best</p>
                <p className="text-3xl font-extrabold text-sky-400">{stats.highScore}</p>
              </div>
            </div>
            
            <div className="bg-sky-500/10 p-4 rounded-xl border border-sky-500/20 mb-8 italic text-sky-200">
              "{aiCoachMsg || "The AI is analyzing your performance..."}"
            </div>

            <div className="flex flex-col gap-4">
              <button 
                onClick={() => handleStartGame()}
                className="w-full py-4 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-2xl transition-all shadow-lg shadow-sky-500/20 active:scale-95"
              >
                Try Again
              </button>
              <button 
                onClick={goToMenu}
                className="w-full py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl transition-all"
              >
                Back to Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
