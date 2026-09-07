import React, { useState, useEffect, useRef, useCallback } from 'react';
import { chapters, memoryArtifacts, friendshipEchoes, milestonePolaroids, defaultProfile } from './data/friendshipTimeline';
import { FriendshipProfile, MilestonePolaroid } from './types';
import { StarfieldCanvas } from './components/StarfieldCanvas';
import { ThreeDWorld } from './components/ThreeDWorld';
import { ScrollHUD } from './components/ScrollHUD';
import { CustomizeModal } from './components/CustomizeModal';
import { CodeExportModal } from './components/CodeExportModal';
import { CustomCursor } from './components/CustomCursor';
import { MilestonePolaroidGallery } from './components/MilestonePolaroidGallery';
import { soundEngine } from './utils/audio';

const TOTAL_Z_DEPTH = 8800;

export default function App() {
  const [profile, setProfile] = useState<FriendshipProfile>(defaultProfile);
  const [progress, setProgress] = useState<number>(0);
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(0);

  // 3D Camera physics state
  const [cameraZ, setCameraZ] = useState<number>(0);
  const [rotX, setRotX] = useState<number>(0);
  const [rotY, setRotY] = useState<number>(0);

  // Modals
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

  // Audio & Auto Glide
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);

  // Track activated (clicked) floating-card-hearts acknowledging the brotherhood bond
  const [activatedHearts, setActivatedHearts] = useState<Record<string, boolean>>({});

  const handleActivateHeart = useCallback((heartId: string) => {
    setActivatedHearts((prev) => ({
      ...prev,
      [heartId]: true,
    }));
  }, []);

  // Refs for animation loop
  const cameraZRef = useRef(0);
  const targetZRef = useRef(0);
  const velocityZRef = useRef(0);
  const rotXRef = useRef(0);
  const targetRotXRef = useRef(0);
  const velocityRotXRef = useRef(0);
  const rotYRef = useRef(0);
  const targetRotYRef = useRef(0);
  const velocityRotYRef = useRef(0);
  const autoScrollRef = useRef(false);
  autoScrollRef.current = isAutoScrolling;

  // Handle Scroll Progress
  const updateScrollProgress = useCallback(() => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll <= 0) return;
    const scrollY = window.scrollY || window.pageYOffset;
    const p = Math.min(Math.max(scrollY / maxScroll, 0), 1);
    setProgress(p);
    targetZRef.current = p * TOTAL_Z_DEPTH;
  }, []);

  // Set up scroll listeners
  useEffect(() => {
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('resize', updateScrollProgress);
    updateScrollProgress();

    return () => {
      window.removeEventListener('scroll', updateScrollProgress);
      window.removeEventListener('resize', updateScrollProgress);
    };
  }, [updateScrollProgress]);

  // Mouse Parallax listener
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const normX = e.clientX / window.innerWidth - 0.5;
      const normY = e.clientY / window.innerHeight - 0.5;
      targetRotYRef.current = normX * 9;
      targetRotXRef.current = -normY * 7;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      const scrollStep = window.innerHeight * 0.75;
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        window.scrollBy({ top: scrollStep, behavior: 'smooth' });
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        window.scrollBy({ top: -scrollStep, behavior: 'smooth' });
      } else if (e.key === 'Home') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (e.key === 'End') {
        e.preventDefault();
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth',
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Main 60fps / 120fps Animation Loop for smooth camera glide
  useEffect(() => {
    let animId: number;

    const render = () => {
      // Auto glide handling
      if (autoScrollRef.current) {
        window.scrollBy(0, 5.0);
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        if (window.scrollY >= maxScroll - 5) {
          setIsAutoScrolling(false);
        }
      }

      // Spring-physics dampening interpolation (Hooke's law + damping)
      // Provides natural, fluid momentum deceleration when gliding & stopping at chapters
      const springStiffness = 0.065;
      const springDamping = 0.82;

      // Z-axis camera spring physics
      const forceZ = (targetZRef.current - cameraZRef.current) * springStiffness;
      velocityZRef.current = (velocityZRef.current + forceZ) * springDamping;
      cameraZRef.current += velocityZRef.current;

      // Clean resting threshold to settle gracefully at chapters without micro-jitter
      if (Math.abs(targetZRef.current - cameraZRef.current) < 0.08 && Math.abs(velocityZRef.current) < 0.03) {
        cameraZRef.current = targetZRef.current;
        velocityZRef.current = 0;
      }

      // Parallax mouse tilt with dampened spring physics
      const forceRotX = (targetRotXRef.current - rotXRef.current) * 0.08;
      velocityRotXRef.current = (velocityRotXRef.current + forceRotX) * 0.78;
      rotXRef.current += velocityRotXRef.current;

      const forceRotY = (targetRotYRef.current - rotYRef.current) * 0.08;
      velocityRotYRef.current = (velocityRotYRef.current + forceRotY) * 0.78;
      rotYRef.current += velocityRotYRef.current;

      setCameraZ(cameraZRef.current);
      setRotX(rotXRef.current);
      setRotY(rotYRef.current);

      // Sound trigger based on physical camera velocity
      soundEngine.onScrollTrigger(velocityZRef.current);

      // Find closest chapter
      let closestIdx = 0;
      let minDistance = Infinity;
      chapters.forEach((ch, idx) => {
        if (!ch || !ch.pos) return;
        const dist = Math.abs(ch.pos.z + cameraZRef.current);
        if (dist < minDistance) {
          minDistance = dist;
          closestIdx = idx;
        }
      });
      setCurrentChapterIndex(closestIdx);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleJumpToProgress = (targetProgress: number) => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: targetProgress * maxScroll,
      behavior: 'smooth',
    });
    soundEngine.playChime(523.25, 0.6);
  };

  const handleJumpToNextChapter = (currentIndex: number) => {
    const nextIdx = Math.min(currentIndex + 1, chapters.length);
    const targets = [0, 0.18, 0.36, 0.55, 0.74, 0.95];
    const target = targets[nextIdx] ?? 1.0;
    handleJumpToProgress(target);
  };

  const handleRewind = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    soundEngine.playChime(440, 1.2);
  };

  const handleToggleAudio = () => {
    const playing = soundEngine.toggleMute();
    setIsAudioOn(playing);
  };

  const handleToggleAutoScroll = () => {
    setIsAutoScrolling((prev) => !prev);
  };

  const activeEcho = friendshipEchoes.find(
    (e) => Math.abs(e.pos.z + cameraZ) < 220
  );

  return (
    <div className="relative bg-[#08090e] text-zinc-100 min-h-screen select-none font-sans overflow-x-hidden">
      {/* Dynamic Brotherhood Link Mouse Cursor */}
      <CustomCursor />

      {/* 3D Background Canvas */}
      <StarfieldCanvas speedFactor={Math.abs(velocityZRef.current)} />

      {/* Floating 3D Perspective Stage and World */}
      <ThreeDWorld
        cameraZ={cameraZ}
        rotX={rotX}
        rotY={rotY}
        chapters={chapters}
        memoryArtifacts={memoryArtifacts}
        echoes={friendshipEchoes}
        profile={profile}
        onJumpToNextChapter={handleJumpToNextChapter}
        onRewind={handleRewind}
        activatedHearts={activatedHearts}
        onActivateHeart={handleActivateHeart}
      />

      {/* Friendship Echo Ambient Indicator */}
      {activeEcho && (
        <aside
          id="active-echo-pill"
          className="fixed top-5 left-1/2 -translate-x-1/2 z-30 pointer-events-none transition-all duration-500 animate-fade-in"
          aria-label="Active friendship echo"
        >
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/75 border border-amber-400/35 backdrop-blur-md shadow-[0_0_20px_rgba(245,158,11,0.15)] text-amber-200 text-[11px] font-mono tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            <span>Echo Awakened: {activeEcho.title} • {activeEcho.location}</span>
          </div>
        </aside>
      )}

      {/* HUD Controls & Interactive Timeline Scrubber */}
      <ScrollHUD
        profile={profile}
        chapters={chapters}
        progress={progress}
        currentChapterIndex={currentChapterIndex}
        isAudioOn={isAudioOn}
        isAutoScrolling={isAutoScrolling}
        onToggleAudio={handleToggleAudio}
        onToggleAutoScroll={handleToggleAutoScroll}
        onOpenCustomize={() => setIsCustomizeOpen(true)}
        onOpenCodeModal={() => setIsCodeModalOpen(true)}
        onJumpToProgress={handleJumpToProgress}
      />

      {/* Customizer Modal */}
      <CustomizeModal
        isOpen={isCustomizeOpen}
        profile={profile}
        onClose={() => setIsCustomizeOpen(false)}
        onSave={(updated) => setProfile(updated)}
      />

      {/* Standalone Code Exporter (HTML, CSS, JS) */}
      <CodeExportModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />

      {/* Height Spacer creating responsive scroll track */}
      <div
        id="scroll-track-spacer"
        className="w-full pointer-events-none"
        style={{ height: '340vh' }}
        aria-hidden="true"
      />
    </div>
  );
}
