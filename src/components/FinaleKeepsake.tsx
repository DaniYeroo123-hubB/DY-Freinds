import React, { useRef, useState } from 'react';
import { FriendshipProfile } from '../types';
import { Shield, Sparkles, RotateCcw, Award, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../utils/audio';

interface FinaleKeepsakeProps {
  profile: FriendshipProfile;
  cameraZ: number;
  onRewind: () => void;
}

export const FinaleKeepsake: React.FC<FinaleKeepsakeProps> = ({
  profile,
  cameraZ,
  onRewind,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50 });
  const [isHovered, setIsHovered] = useState(false);

  // Relative Z position for the finale keepsake board: at Z = -8400px
  const targetZ = -8400;
  const relativeZ = targetZ + cameraZ;

  // Subtle distance softening: completely sharp (0px blur) across the entire reading zone
  const farDist = Math.max(0, -relativeZ - 600);
  const blurPx = Math.min(1.5, farDist * 0.002);
  const filter = blurPx >= 0.7 ? `blur(${blurPx.toFixed(1)}px)` : 'none';

  let opacity = 1;
  let pointerEvents: 'auto' | 'none' = 'auto';

  if (relativeZ < -2400) {
    opacity = Math.max(0, 1 - (-relativeZ - 2400) / 800);
  } else if (relativeZ > 200) {
    opacity = Math.max(0, 1 - (relativeZ - 200) / 250);
  }

  if (relativeZ > 380 || opacity < 0.05) {
    return null;
  }

  if (relativeZ > 250 || relativeZ < -1600) {
    pointerEvents = 'none';
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const tiltX = -((y - rect.height / 2) / (rect.height / 2)) * 10;
    const tiltY = ((x - rect.width / 2) / (rect.width / 2)) * 10;
    setTilt({
      x: tiltX,
      y: tiltY,
      glareX: (x / rect.width) * 100,
      glareY: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50 });
  };

  const triggerConfetti = () => {
    soundEngine.playMilestoneChord();
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#38bdf8', '#f59e0b', '#10b981', '#ffffff', '#6366f1'],
    });
  };

  const transform = `translate3d(0px, 0px, ${targetZ}px)`;

  return (
    <div
      id="finale-keepsake-board"
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[94vw] max-w-[640px] transition-opacity duration-200 select-none"
      style={{
        transform,
        opacity,
        filter,
        pointerEvents,
        transformStyle: 'preserve-3d',
        willChange: 'transform, opacity, filter',
      }}
    >
      <div
        ref={cardRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-zinc-950/95 via-zinc-900/95 to-zinc-950/98 backdrop-blur-2xl border-2 border-amber-500/40 shadow-2xl shadow-amber-500/15 text-center transition-transform duration-150 ease-out"
        style={{
          transformStyle: 'preserve-3d',
          transform: isHovered
            ? `rotateX(${tilt.x.toFixed(2)}deg) rotateY(${tilt.y.toFixed(2)}deg) translateZ(30px)`
            : 'rotateX(0deg) rotateY(0deg) translateZ(0px)',
          boxShadow: isHovered
            ? '0 35px 70px rgba(0, 0, 0, 0.8), 0 0 50px rgba(245, 158, 11, 0.25)'
            : '0 25px 50px rgba(0, 0, 0, 0.7)',
        }}
      >
        {/* Dynamic Holographic Glare */}
        {isHovered && (
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-200"
            style={{
              background: `radial-gradient(circle 320px at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.1), transparent 80%)`,
            }}
          />
        )}

        {/* Decorative Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm"
          style={{ transform: 'translateZ(30px)' }}
        >
          <Award className="w-4 h-4 text-amber-400" />
          <span>Certificate of Lifelong Brotherhood</span>
        </div>

        {/* Real Photo of Daniel Kidanu and Yerosen Desalegn */}
        <div
          className="relative mx-auto my-3 w-48 sm:w-56 aspect-[3/4] rounded-2xl overflow-hidden border-2 border-amber-400/50 shadow-2xl bg-zinc-900 group"
          style={{ transform: 'translateZ(45px)' }}
        >
          <img
            src="/founder-image-wrap.jpg"
            alt="Daniel Kidanu and Yerosen Desalegn"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-top filter contrast-105 group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-2.5 text-center">
            <span className="text-[11px] font-mono text-amber-300 font-bold bg-black/60 px-2.5 py-0.5 rounded-full border border-amber-400/30">
              Daniel &amp; Yerosen &bull; Brothers
            </span>
          </div>
        </div>

        <h2
          className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight mb-1"
          style={{ transform: 'translateZ(35px)' }}
        >
          {profile.person1} &amp; {profile.person2}
        </h2>
        <p
          className="text-amber-300/90 text-xs sm:text-sm font-medium italic mb-5"
          style={{ transform: 'translateZ(30px)' }}
        >
          &ldquo;{profile.tagline}&rdquo;
        </p>

        {/* Milestone Grid */}
        <div
          className="grid grid-cols-3 gap-2.5 my-4 text-center"
          style={{ transform: 'translateZ(30px)' }}
        >
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400">Gr. 6 → 9</div>
            <div className="text-[10px] sm:text-[11px] text-zinc-400 font-medium mt-0.5">School Journey</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">100%</div>
            <div className="text-[10px] sm:text-[11px] text-zinc-400 font-medium mt-0.5">Pact Kept</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400">&infin;</div>
            <div className="text-[10px] sm:text-[11px] text-zinc-400 font-medium mt-0.5">Unfiltered Laughs</div>
          </div>
        </div>

        {/* Brotherhood Oath */}
        <div
          className="p-4 rounded-2xl bg-black/50 border border-white/10 text-xs text-zinc-300 leading-relaxed text-left space-y-1.5 mb-5 shadow-inner"
          style={{ transform: 'translateZ(25px)' }}
        >
          <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[11px] uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5 fill-amber-400/20" />
            <span>The Brotherhood Code</span>
          </div>
          <p>
            &quot;Blood makes you related, but loyalty and shared battles make you brothers for life. I promise to always have your back in every room, roast you without mercy in every conversation, celebrate your triumphs as our own, and stand shoulder-to-shoulder with you all the way to the top.&quot;
          </p>
        </div>

        {/* Action Buttons */}
        <div
          className="flex flex-wrap items-center justify-center gap-3"
          style={{ transform: 'translateZ(30px)' }}
        >
          <button
            onClick={triggerConfetti}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-blue-500 hover:from-amber-600 hover:to-blue-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/25 transition-transform hover:scale-105 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Celebrate Our Brotherhood!</span>
          </button>
          <button
            onClick={onRewind}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-medium text-xs sm:text-sm border border-white/15 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Rewind to Day 1</span>
          </button>
        </div>
      </div>
    </div>
  );
};
