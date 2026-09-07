import React, { useRef, useState } from 'react';
import { Chapter, FriendshipProfile } from '../types';
import { Sparkles, Compass, Shield, Flame, HeartHandshake, Infinity as InfinityIcon, MessageCircle, Heart } from 'lucide-react';
import { InteractiveFloatingHeart } from './InteractiveFloatingHeart';

interface ChapterCardProps {
  chapter: Chapter;
  profile: FriendshipProfile;
  cameraZ: number;
  onJumpToNext?: () => void;
  floatingHeart?: React.ReactNode;
}

export const ChapterCard: React.FC<ChapterCardProps> = ({
  chapter,
  profile,
  cameraZ,
  onJumpToNext,
  floatingHeart,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50 });
  const [isHovered, setIsHovered] = useState(false);

  if (!chapter || !chapter.pos) {
    return null;
  }

  // Compute distance from camera
  const relativeZ = chapter.pos.z + cameraZ;

  // Subtle distance softening: completely sharp (0px blur) across the entire reading zone
  const farDist = Math.max(0, -relativeZ - 550);
  const blurPx = Math.min(1.5, farDist * 0.0025);
  const filter = blurPx >= 0.7 ? `blur(${blurPx.toFixed(1)}px)` : 'none';

  // Visibility calculation: smoothly fades into atmospheric distance
  let opacity = 1;
  let pointerEvents: 'auto' | 'none' = 'auto';

  if (relativeZ < -1100) {
    opacity = Math.max(0, 1 - (-relativeZ - 1100) / 350);
  } else if (relativeZ > 80) {
    opacity = Math.max(0, 1 - (relativeZ - 80) / 120);
  }

  if (relativeZ > 200 || relativeZ < -1450 || opacity < 0.05) {
    return null;
  }

  if (relativeZ > 120 || relativeZ < -550) {
    pointerEvents = 'none';
  }

  // Mouse tilt on individual card for holographic 3D depth
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const tiltX = -((y - centerY) / centerY) * 12;
    const tiltY = ((x - centerX) / centerX) * 12;
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setCardTilt({ x: tiltX, y: tiltY, glareX, glareY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCardTilt({ x: 0, y: 0, glareX: 50, glareY: 50 });
  };

  const renderIcon = () => {
    switch (chapter.visualType) {
      case 'hallway':
        return <Sparkles className="w-5 h-5 text-blue-400" />;
      case 'stargazing':
        return <Compass className="w-5 h-5 text-amber-400" />;
      case 'diner':
        return <Shield className="w-5 h-5 text-emerald-400" />;
      case 'distance':
        return <Flame className="w-5 h-5 text-rose-400" />;
      case 'reunion':
        return <HeartHandshake className="w-5 h-5 text-cyan-400" />;
      case 'forever':
        return <InfinityIcon className="w-5 h-5 text-amber-400" />;
    }
  };

  const isUnstoppableMomentum =
    chapter.index === 4 ||
    Boolean(chapter.badge && /unstoppable/i.test(chapter.badge)) ||
    Boolean(chapter.title && /momentum/i.test(chapter.title));

  const isFinalChapter =
    chapter.index === 5 ||
    Boolean(chapter.badge && /finale/i.test(chapter.badge)) ||
    Boolean(chapter.badge && /brothers for life/i.test(chapter.badge));

  const showFloatingHeart = isUnstoppableMomentum || isFinalChapter;
  const hasPhoto = !!chapter.image;

  // 3D positioning transform
  const baseTransform = `translate3d(${chapter.pos.x}px, ${chapter.pos.y}px, ${chapter.pos.z}px) rotateY(${chapter.pos.rotY || 0}deg)`;

  return (
    <article
      id={`chapter-card-${chapter.id}`}
      data-cursor="brotherhood"
      data-cursor-label="Brotherhood Link"
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[94vw] max-w-[580px] transition-opacity duration-200 select-none"
      style={{
        transform: baseTransform,
        opacity,
        filter,
        pointerEvents,
        transformStyle: 'preserve-3d',
        willChange: 'transform, opacity, filter',
      }}
    >
      <div
        ref={cardRef}
        data-cursor="brotherhood"
        data-cursor-label="Brotherhood Link"
        onMouseEnter={() => setIsHovered(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`relative rounded-3xl p-6 sm:p-8 border transition-transform duration-150 ease-out shadow-2xl ${
          isFinalChapter
            ? 'bg-zinc-950 border-amber-500/50 shadow-amber-500/20'
            : 'bg-[#0d0e15] border-white/20 shadow-black/90 hover:border-blue-400/50'
        }`}
        style={{
          transformStyle: 'preserve-3d',
          transform: isHovered
            ? `rotateX(${cardTilt.x.toFixed(2)}deg) rotateY(${cardTilt.y.toFixed(2)}deg) translateZ(30px)`
            : 'rotateX(0deg) rotateY(0deg) translateZ(0px)',
          boxShadow: isHovered
            ? '0 35px 70px rgba(0, 0, 0, 0.75), 0 0 40px rgba(56, 189, 248, 0.15)'
            : '0 25px 50px rgba(0, 0, 0, 0.6)',
        }}
      >
        {/* Subtle floating animated heart icon emphasizing emotional bond */}
        {floatingHeart !== undefined ? (
          floatingHeart
        ) : showFloatingHeart ? (
          <InteractiveFloatingHeart
            id={`floating-heart-chapter-${chapter.id}`}
            label={`Emotional bond - ${chapter.title}`}
            enableParticleBurst={isUnstoppableMomentum || isFinalChapter}
          />
        ) : null}

        {/* Dynamic Holographic Glare */}
        {isHovered && (
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-200"
            style={{
              background: `radial-gradient(circle 280px at ${cardTilt.glareX}% ${cardTilt.glareY}%, rgba(255,255,255,0.12), transparent 80%)`,
            }}
          />
        )}

        {/* Ambient colored lighting glows */}
        <div className="absolute -top-14 -left-14 w-40 h-40 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-14 -right-14 w-40 h-40 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Badge & Year */}
        <div
          className="flex items-center justify-between gap-3 mb-4"
          style={{ transform: 'translateZ(30px)', transformStyle: 'preserve-3d' }}
        >
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shadow-md">
              {renderIcon()}
            </span>
            <span
              className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border shadow-sm ${
                isFinalChapter
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
              }`}
            >
              {chapter.badge}
            </span>
          </div>
          <span className="text-xs sm:text-sm font-bold tracking-widest text-zinc-400 font-mono">
            {chapter.year}
          </span>
        </div>

        {/* PHOTO EMBED - Real Photo of Daniel & Yerosen */}
        {hasPhoto && (
          <div
            className="relative my-4 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-zinc-900 group"
            style={{
              transform: 'translateZ(45px)',
              transformStyle: 'preserve-3d',
            }}
          >
            <img
              src={chapter.image}
              alt="Daniel Kidanu and Yerosen Desalegn"
              referrerPolicy="no-referrer"
              className="w-full h-56 sm:h-72 object-cover object-top filter contrast-105 brightness-100 transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-3.5">
              <div className="flex items-center justify-between w-full">
                <span className="text-white font-medium text-xs sm:text-sm drop-shadow-md bg-black/60 px-3 py-1 rounded-full backdrop-blur-md border border-white/15">
                  {chapter.photoCaption || 'Daniel Kidanu & Yerosen Desalegn'}
                </span>
                <span className="text-[11px] font-bold text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  Brotherhood
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Title & Subtitle */}
        <div style={{ transform: 'translateZ(35px)', transformStyle: 'preserve-3d' }}>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight leading-tight">
            {chapter.title}
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-amber-300/95 mt-1 mb-3">
            {chapter.subtitle}
          </p>
        </div>

        <div className="h-px bg-gradient-to-r from-blue-400/40 via-amber-400/30 to-transparent my-3" />

        {/* Narrative text */}
        <p
          className="text-zinc-200 text-xs sm:text-sm leading-relaxed sm:leading-relaxed mb-4 font-normal"
          style={{ transform: 'translateZ(25px)', transformStyle: 'preserve-3d' }}
        >
          {chapter.narrative}
        </p>

        {/* Interactive Dialogue Callout */}
        {chapter.dialogue && chapter.dialogue.length > 0 && (
          <div
            className="bg-black/50 backdrop-blur-md rounded-2xl p-3.5 border-l-4 border-cyan-400 mb-4 space-y-1.5 text-xs shadow-inner"
            style={{ transform: 'translateZ(30px)', transformStyle: 'preserve-3d' }}
          >
            <div className="flex items-center gap-1.5 text-[10px] text-cyan-300 font-bold tracking-wider uppercase mb-1">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Unfiltered Banter</span>
            </div>
            {chapter.dialogue.map((d, i) => (
              <div key={i} className="leading-snug">
                <span className="font-bold text-cyan-300">{d.speaker}: </span>
                <span className="text-zinc-100">{d.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* Quote */}
        <blockquote
          className="border-l-2 border-amber-400/80 pl-3.5 italic text-xs sm:text-sm text-zinc-300 my-3"
          style={{ transform: 'translateZ(25px)', transformStyle: 'preserve-3d' }}
        >
          &ldquo;{chapter.quote}&rdquo;
        </blockquote>

        {/* Next Milestone Jump Hint */}
        {onJumpToNext && !isFinalChapter && (
          <div
            className="mt-3 pt-3 border-t border-white/10 flex items-center justify-end"
            style={{ transform: 'translateZ(20px)', transformStyle: 'preserve-3d' }}
          >
            <button
              onClick={onJumpToNext}
              className="text-xs text-blue-300 hover:text-white flex items-center gap-1.5 transition-colors group cursor-pointer font-medium"
            >
              <span>Glide to next milestone</span>
              <span className="group-hover:translate-x-1 transition-transform">&#10230;</span>
            </button>
          </div>
        )}
      </div>
    </article>
  );
};
