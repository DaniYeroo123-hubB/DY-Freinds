import React, { useEffect, useState, useRef } from 'react';
import { HeartHandshake, Link2, Sparkles, RotateCw, Volume2 } from 'lucide-react';

export type CursorMode = 'default' | 'brotherhood' | 'artifact' | 'echo' | 'action';

export const CustomCursor: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [cursorMode, setCursorMode] = useState<CursorMode>('default');
  const [cursorLabel, setCursorLabel] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(false);

  // Smooth trailing position for outer ring
  const trailPosRef = useRef({ x: -100, y: -100 });
  const targetPosRef = useRef({ x: -100, y: -100 });
  const ringElementRef = useRef<HTMLDivElement>(null);
  const dotElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only enable on non-touch desktop environments
    const media = window.matchMedia('(pointer: fine)');
    setIsFinePointer(media.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsFinePointer(e.matches);
    };
    media.addEventListener('change', handleMediaChange);

    if (!media.matches) {
      return () => media.removeEventListener('change', handleMediaChange);
    }

    document.documentElement.classList.add('custom-cursor-enabled');

    let animId: number;

    const handleMouseMove = (e: MouseEvent) => {
      targetPosRef.current = { x: e.clientX, y: e.clientY };
      setMousePos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Check hovered element
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorTarget = target.closest('[data-cursor]') as HTMLElement | null;
      if (cursorTarget) {
        const mode = cursorTarget.getAttribute('data-cursor') as CursorMode;
        const label = cursorTarget.getAttribute('data-cursor-label') || '';
        setCursorMode(mode);
        setCursorLabel(label);
      } else {
        // Fallback for interactive elements like buttons
        const isInteractive = target.closest('button, a, input, textarea, select, [role="button"]');
        if (isInteractive) {
          setCursorMode('action');
          setCursorLabel('');
        } else {
          setCursorMode('default');
          setCursorLabel('');
        }
      }
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Smooth spring/lerp loop for the trailing ring
    const render = () => {
      const target = targetPosRef.current;
      const trail = trailPosRef.current;

      // Fast responsive lerp for the outer ring
      trail.x += (target.x - trail.x) * 0.28;
      trail.y += (target.y - trail.y) * 0.28;

      if (ringElementRef.current) {
        ringElementRef.current.style.transform = `translate3d(${trail.x}px, ${trail.y}px, 0)`;
      }
      if (dotElementRef.current) {
        dotElementRef.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      media.removeEventListener('change', handleMediaChange);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.documentElement.classList.remove('custom-cursor-enabled');
    };
  }, [isVisible]);

  if (!isFinePointer || !isVisible) {
    return null;
  }

  const isBrotherhood = cursorMode === 'brotherhood';
  const isArtifact = cursorMode === 'artifact';
  const isEcho = cursorMode === 'echo';
  const isAction = cursorMode === 'action';

  return (
    <div
      id="custom-mouse-cursor"
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Precision Core Dot */}
      <div
        ref={dotElementRef}
        className={`fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-150 ${
          isBrotherhood
            ? 'opacity-0 scale-0'
            : isMouseDown
            ? 'w-2 h-2 bg-amber-300 scale-75'
            : 'w-2 h-2 bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]'
        }`}
        style={{ willChange: 'transform' }}
      />

      {/* Trailing Morphing Halo / Brotherhood Link Icon */}
      <div
        ref={ringElementRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ease-out flex items-center justify-center"
        style={{ willChange: 'transform' }}
      >
        {/* State 1: Brotherhood Link transformation (when hovering 3D Chapter Cards) */}
        {isBrotherhood ? (
          <div
            className={`relative flex flex-col items-center justify-center transition-all duration-300 ${
              isMouseDown ? 'scale-90' : 'scale-100 animate-pulse'
            }`}
          >
            {/* Outer rotating radiant glow aura */}
            <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500/20 via-black/80 to-cyan-500/25 border-2 border-amber-400/90 shadow-[0_0_28px_rgba(245,158,11,0.5),inset_0_0_12px_rgba(56,189,248,0.3)] backdrop-blur-md">
              {/* Spinning orbital dash ring */}
              <div
                className="absolute -inset-1 rounded-full border border-dashed border-amber-300/40 animate-spin"
                style={{ animationDuration: '8s' }}
              />

              {/* Interlocking Brotherhood Icons: Handshake + Chain Link */}
              <div className="relative flex items-center justify-center">
                <HeartHandshake className="w-6 h-6 text-amber-300 drop-shadow-[0_0_6px_rgba(245,158,11,0.9)]" />
                <Link2 className="w-3.5 h-3.5 text-cyan-300 absolute -bottom-1 -right-1 drop-shadow-[0_0_4px_rgba(56,189,248,0.8)]" />
              </div>
            </div>

            {/* Glowing Micro-Pill Tag */}
            <div className="mt-2 px-2.5 py-0.5 rounded-full bg-black/85 border border-amber-400/60 shadow-[0_0_12px_rgba(245,158,11,0.3)] text-[10px] font-bold tracking-widest text-amber-300 uppercase whitespace-nowrap flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              <span>{cursorLabel || 'Brotherhood Link'}</span>
            </div>
          </div>
        ) : isArtifact ? (
          /* State 2: 3D Memory Artifact Inspect Cursor */
          <div className="flex flex-col items-center justify-center">
            <div
              className={`w-11 h-11 rounded-full border border-amber-400/70 bg-black/70 backdrop-blur-sm flex items-center justify-center shadow-[0_0_18px_rgba(245,158,11,0.35)] ${
                isMouseDown ? 'scale-90' : 'scale-100'
              }`}
            >
              <RotateCw className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div className="mt-1 px-2 py-0.5 rounded-full bg-black/80 border border-amber-500/40 text-[9px] text-amber-300 font-medium whitespace-nowrap">
              {cursorLabel || 'Inspect 3D'}
            </div>
          </div>
        ) : isEcho ? (
          /* State 3: Friendship Echo Whisper Cursor */
          <div className="flex flex-col items-center justify-center">
            <div
              className={`w-10 h-10 rounded-full border border-cyan-400/70 bg-black/70 backdrop-blur-sm flex items-center justify-center shadow-[0_0_18px_rgba(56,189,248,0.35)] ${
                isMouseDown ? 'scale-90' : 'scale-100'
              }`}
            >
              <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
            </div>
            <div className="mt-1 px-2 py-0.5 rounded-full bg-black/80 border border-cyan-500/40 text-[9px] text-cyan-300 font-medium whitespace-nowrap">
              {cursorLabel || 'Memory Echo'}
            </div>
          </div>
        ) : isAction ? (
          /* State 4: Interactive Action / Button Magnet Cursor */
          <div
            className={`w-9 h-9 rounded-full border border-amber-400/50 bg-amber-400/10 backdrop-blur-xs transition-transform duration-150 ${
              isMouseDown ? 'scale-75 bg-amber-400/30' : 'scale-100'
            }`}
          />
        ) : (
          /* State 5: Default Ambient Trailing Ring */
          <div
            className={`w-7 h-7 rounded-full border border-amber-400/30 bg-amber-400/5 transition-all duration-200 ${
              isMouseDown ? 'scale-75 border-amber-400/70' : 'scale-100'
            }`}
          />
        )}
      </div>
    </div>
  );
};
