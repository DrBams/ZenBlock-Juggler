
import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { Challenge, GameStats } from '../types';
import { THEMES } from '../constants';

interface GameCanvasProps {
  challenge: Challenge;
  onGameOver: (stats: GameStats) => void;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ challenge, onGameOver }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const statsRef = useRef<GameStats>({
    score: 0,
    highScore: 0,
    blocksJuggled: 0,
    maxCombo: 1,
    timeElapsed: 0
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Events, Body, Vector } = Matter;
    
    // Create engine
    const engine = Engine.create();
    engineRef.current = engine;
    engine.gravity.y = challenge.gravity;

    // Create renderer
    const width = window.innerWidth;
    const height = window.innerHeight;
    const render = Render.create({
      element: containerRef.current,
      engine: engine,
      options: {
        width,
        height,
        wireframes: false,
        background: 'transparent',
        pixelRatio: window.devicePixelRatio,
      }
    });
    renderRef.current = render;

    // Boundaries
    const ground = Bodies.rectangle(width / 2, height + 50, width * 2, 100, { 
      isStatic: true,
      label: 'floor'
    });
    const leftWall = Bodies.rectangle(-50, height / 2, 100, height, { isStatic: true });
    const rightWall = Bodies.rectangle(width + 50, height / 2, 100, height, { isStatic: true });

    // Juggling Platform (The player balances this?)
    // Actually, let's make a static platform in the middle and the player has to juggle blocks around it.
    const themeColors = THEMES[challenge.theme] || THEMES.NEON;
    const platform = Bodies.rectangle(width / 2, height * 0.75, width * 0.6, 20, { 
      isStatic: true, 
      render: { fillStyle: themeColors.platform },
      chamfer: { radius: 10 },
      label: 'platform'
    });

    Composite.add(engine.world, [ground, leftWall, rightWall, platform]);

    // Mouse control for direct block interaction (Juggling)
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });

    Composite.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    // Game Loop Variables
    let lastSpawnTime = 0;
    let frameId: number;

    const spawnBlock = () => {
      const size = 40 + Math.random() * 40;
      const x = (width * 0.2) + Math.random() * (width * 0.6);
      const color = themeColors.blocks[Math.floor(Math.random() * themeColors.blocks.length)];
      
      const block = Bodies.rectangle(x, -50, size, size, {
        restitution: challenge.restitution,
        friction: 0.1,
        render: { fillStyle: color },
        label: 'block'
      });
      
      Composite.add(engine.world, block);
    };

    // Events
    Events.on(engine, 'collisionStart', (event) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;
        
        // Check for Game Over (Block hits floor)
        if (bodyA.label === 'floor' && bodyB.label === 'block') {
          Composite.remove(engine.world, bodyB);
          stopGame();
        } else if (bodyB.label === 'floor' && bodyA.label === 'block') {
          Composite.remove(engine.world, bodyA);
          stopGame();
        }

        // Scoring: Block hits platform
        if ((bodyA.label === 'platform' && bodyB.label === 'block') || (bodyB.label === 'platform' && bodyA.label === 'block')) {
          statsRef.current.score += 10;
        }
      });
    });

    // Handle clicks for "Juggling" force
    Events.on(mouseConstraint, 'mousedown', (event) => {
      const clickedBody = mouseConstraint.body;
      if (clickedBody && clickedBody.label === 'block') {
        // Apply upward force on click
        Body.applyForce(clickedBody, clickedBody.position, { x: (Math.random() - 0.5) * 0.1, y: -0.2 });
        statsRef.current.score += 5;
        statsRef.current.blocksJuggled += 1;
      }
    });

    const stopGame = () => {
      Runner.stop(runner);
      onGameOver({ ...statsRef.current });
    };

    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    const gameUpdate = (time: number) => {
      if (time - lastSpawnTime > challenge.spawnRate * 1000) {
        spawnBlock();
        lastSpawnTime = time;
      }
      statsRef.current.timeElapsed += 1/60;
      frameId = requestAnimationFrame(gameUpdate);
    };

    frameId = requestAnimationFrame(gameUpdate);

    return () => {
      cancelAnimationFrame(frameId);
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
      if (render.canvas) {
        render.canvas.remove();
      }
    };
  }, [challenge, onGameOver]);

  return <div ref={containerRef} className="w-full h-full game-canvas" />;
};

export default GameCanvas;
