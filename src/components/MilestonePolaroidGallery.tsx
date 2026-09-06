import React, { useState, useEffect, useRef } from 'react';
import { MilestonePolaroid } from '../types';
import { Camera, Sparkles, X, ChevronRight, ChevronLeft, RotateCw, MapPin, Calendar, Layers, Compass, Eye } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface MilestonePolaroidGalleryProps {
  polaroids: MilestonePolaroid[];
  cameraZ: number;
  onJumpToProgress?: (progress: number) => void;
  externalSelectedPolaroid?: MilestonePolaroid | null;
  onClearExternalSelected?: () => void;
}

const TOTAL_Z_DEPTH = 8800;

export const MilestonePolaroidGallery: React.FC<MilestonePolaroidGalleryProps> = ({
  polaroids,
  cameraZ,
  onJumpToProgress,
  externalSelectedPolaroid,
  onClearExternalSelected,
}) => {
  const [activeMilestoneYear, setActiveMilestoneYear] = useState<'2016' | '2017' | '2018' | '2019' | null>('2016');
  const [selectedPolaroid, setSelectedPolaroid] = useState<MilestonePolaroid | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [filterYear, setFilterYear] = useState<'all' | '2016' | '2017' | '2018' | '2019'>('all');

  // Sync external selection from 3D world click
  useEffect(() => {
    if (externalSelectedPolaroid) {
      setSelectedPolaroid(externalSelectedPolaroid);
      setIsFlipped(false);
    }
  }, [externalSelectedPolaroid]);

  // Track unlocked polaroids as camera scrolls past them
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set(['p-2016-1']));
  const lastTriggeredYearRef = useRef<string | null>(null);

  // Detect which milestone zone the camera is currently passing through
  useEffect(() => {
    // Current camera position in positive progress terms
    const currentZ = cameraZ;

    let year: '2016' | '2017' | '2018' | '2019' | null = null;
    if (currentZ >= 0 && currentZ < 1300) {
      year = '2016';
    } else if (currentZ >= 1300 && currentZ < 2650) {
      year = '2017';
    } else if (currentZ >= 2650 && currentZ < 5100) {
      year = '2018';
    } else if (currentZ >= 5100 && currentZ < 7200) {
      year = '2019';
    }

    if (year && year !== lastTriggeredYearRef.current) {
      lastTriggeredYearRef.current = year;
      setActiveMilestoneYear(year);

      // Trigger crisp acoustic pop audio
      soundEngine.playPolaroidPop();

      // Automatically unlock polaroids of this milestone
      setUnlockedIds((prev) => {
        const next = new Set(prev);
        polaroids.filter((p) => p.year === year).forEach((p) => next.add(p.id));
        return next;
      });
    }
  }, [cameraZ, polaroids]);

  // Current milestone polaroids to display in the pop-up dock
  const activeMilestonePolaroids = polaroids.filter(
    (p) => p.year === activeMilestoneYear
  );

  const handleOpenPolaroid = (polaroid: MilestonePolaroid) => {
    setSelectedPolaroid(polaroid);
    setIsFlipped(false);
    soundEngine.playPolaroidPop();
  };

  const closeModal = () => {
    setSelectedPolaroid(null);
    onClearExternalSelected?.();
  };

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
    soundEngine.playChime(440, 0.4);
  };

  const handleJumpToMilestone = (p: MilestonePolaroid) => {
    if (!onJumpToProgress) return;
    const targetProgress = Math.abs(p.pos.z) / TOTAL_Z_DEPTH;
    onJumpToProgress(Math.min(1, Math.max(0, targetProgress)));
    soundEngine.playChime(523.25, 0.6);
  };

  // Filtered polaroids for the full modal gallery view
  const modalPolaroids = filterYear === 'all'
    ? polaroids
    : polaroids.filter((p) => p.year === filterYear);

  return (
    <>
      {/* 1. Milestone Pop-Up Polaroid Floating Dock (Bottom Right / Side) */}
      <aside
        id="milestone-polaroid-dock"
        aria-label="Milestone Memories Gallery"
        className="fixed bottom-6 right-5 z-40 select-none transition-all duration-300 pointer-events-auto"
      >
        <div className="flex flex-col items-end">
          {/* Header pill with milestone indicator */}
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => setIsMinimized((prev) => !prev)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 border border-amber-400/40 backdrop-blur-md text-amber-200 text-xs font-mono shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:border-amber-400 hover:text-white transition-all cursor-pointer group"
              title="Toggle Milestone Polaroid Pop-Ups"
            >
              <Camera className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
              <span className="font-semibold tracking-wider uppercase">
                {activeMilestoneYear ? `${activeMilestoneYear} Milestones` : 'Memories Archive'}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              <span className="text-[10px] bg-amber-500/20 px-1.5 py-0.5 rounded text-amber-300 font-bold">
                {activeMilestonePolaroids.length} pop-ups
              </span>
            </button>
          </div>

          {/* Collapsible Pop-Up Polaroid Strip */}
          {!isMinimized && activeMilestonePolaroids.length > 0 && (
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-950/85 backdrop-blur-xl border border-white/15 shadow-2xl animate-fade-in max-w-[94vw] overflow-x-auto scrollbar-none">
              {activeMilestonePolaroids.map((p) => {
                return (
                  <div
                    key={p.id}
                    id={`popup-polaroid-${p.id}`}
                    data-cursor="artifact"
                    data-cursor-label="View Polaroid"
                    onClick={() => handleOpenPolaroid(p)}
                    className="group relative shrink-0 w-36 sm:w-40 bg-zinc-100 text-zinc-900 rounded-sm p-2 pb-3.5 shadow-xl hover:shadow-[0_0_25px_rgba(245,158,11,0.45)] hover:-translate-y-2 hover:rotate-0 transition-all duration-300 cursor-pointer"
                    style={{
                      transform: `rotate(${p.rotationDeg}deg)`,
                    }}
                  >
                    {/* Scotch tape illusion */}
                    <div
                      className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-10 h-4 rounded-xs pointer-events-none opacity-80"
                      style={{
                        backgroundColor: p.tapeColor || 'rgba(245, 158, 11, 0.4)',
                        transform: 'rotate(-2deg)',
                      }}
                    />

                    {/* Photo area */}
                    <div className="relative w-full aspect-square bg-zinc-900 overflow-hidden rounded-xs mb-2 border border-zinc-300 shadow-inner">
                      {p.image ? (
                        <img
                          src={p.image}
                          alt={p.photoTitle}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-gradient-to-br from-zinc-800 to-zinc-950 text-zinc-300">
                          <Sparkles className="w-5 h-5 text-amber-400 mb-1" />
                          <span className="text-[10px] font-mono leading-tight">{p.photoTitle}</span>
                        </div>
                      )}

                      {/* Year badge */}
                      <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-bold font-mono bg-black/75 text-amber-300 backdrop-blur-xs">
                        {p.year}
                      </span>
                    </div>

                    {/* Handwritten polaroid caption */}
                    <div className="px-1">
                      <p className="text-[11px] font-bold font-sans text-zinc-900 truncate leading-tight">
                        {p.photoTitle}
                      </p>
                      <p className="text-[9px] text-zinc-600 font-mono truncate">
                        {p.date}
                      </p>
                    </div>

                    {/* Hover Hint */}
                    <div className="absolute inset-0 bg-amber-500/10 opacity-0 group-hover:opacity-100 rounded-sm transition-opacity pointer-events-none flex items-center justify-center">
                      <span className="text-[10px] font-bold text-amber-950 bg-amber-300/90 px-2 py-0.5 rounded shadow">
                        Click to Inspect
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* View All Timeline Memories Button */}
              <button
                type="button"
                onClick={() => {
                  setSelectedPolaroid(polaroids[0]);
                  setIsFlipped(false);
                }}
                className="shrink-0 w-24 h-36 flex flex-col items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/50 text-zinc-300 hover:text-amber-300 p-2 transition-all group cursor-pointer"
                title="Browse Full 2016-2019 Gallery"
              >
                <Layers className="w-5 h-5 mb-2 group-hover:scale-110 transition-transform text-amber-400" />
                <span className="text-[10px] font-mono text-center font-bold">ALL MEMORIES</span>
                <span className="text-[9px] text-zinc-500 font-mono mt-1">2016–2019</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* 2. Full Polaroid Inspection & Memory Album Modal */}
      {selectedPolaroid && (
        <div
          id="polaroid-inspection-modal"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-xl bg-zinc-950 border border-amber-500/30 rounded-3xl p-6 shadow-[0_0_50px_rgba(245,158,11,0.2)] flex flex-col max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                    <span>{selectedPolaroid.milestoneTitle}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {selectedPolaroid.year} Timeline
                    </span>
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono">
                    {selectedPolaroid.location} • {selectedPolaroid.date}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close Polaroid"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Timeline Filter Pills */}
            <div className="flex items-center gap-1.5 mb-4 overflow-x-auto pb-1 scrollbar-none">
              {(['all', '2016', '2017', '2018', '2019'] as const).map((yr) => (
                <button
                  key={yr}
                  onClick={() => setFilterYear(yr)}
                  className={`px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer ${
                    filterYear === yr
                      ? 'bg-amber-400 text-zinc-950 font-bold shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                      : 'bg-white/5 text-zinc-400 hover:text-zinc-200 hover:bg-white/10'
                  }`}
                >
                  {yr === 'all' ? 'All (9)' : `${yr} Milestone`}
                </button>
              ))}
            </div>

            {/* Main Interactive Polaroid Card with 3D Flip */}
            <div className="flex flex-col items-center justify-center my-2">
              <div
                className="relative cursor-pointer transition-transform duration-500"
                style={{
                  perspective: '1200px',
                  width: '310px',
                  minHeight: '390px',
                }}
                onClick={handleFlip}
                title="Click to flip polaroid"
              >
                <div
                  className="relative w-full h-full rounded-sm shadow-2xl transition-transform duration-700 select-none"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}
                >
                  {/* FRONT: Vintage Polaroid Photo Frame */}
                  <div
                    className="w-full bg-[#f8f7f2] text-zinc-900 rounded-sm p-3.5 pb-6 shadow-2xl border border-zinc-300 flex flex-col items-center"
                    style={{
                      backfaceVisibility: 'hidden',
                    }}
                  >
                    {/* Scotch tape */}
                    <div
                      className="absolute -top-3 w-16 h-5 rounded-xs opacity-75 shadow-xs pointer-events-none"
                      style={{
                        backgroundColor: selectedPolaroid.tapeColor || 'rgba(245, 158, 11, 0.5)',
                        transform: 'rotate(1deg)',
                      }}
                    />

                    {/* Image Box */}
                    <div className="w-full aspect-square bg-zinc-900 rounded-xs overflow-hidden mb-3 border border-zinc-300 shadow-inner relative group">
                      {selectedPolaroid.image ? (
                        <img
                          src={selectedPolaroid.image}
                          alt={selectedPolaroid.photoTitle}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-center"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-zinc-800 to-zinc-950 text-zinc-200">
                          <Camera className="w-10 h-10 text-amber-400/80 mb-2" />
                          <span className="text-sm font-semibold">{selectedPolaroid.photoTitle}</span>
                        </div>
                      )}
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono bg-black/80 text-amber-300">
                        {selectedPolaroid.year}
                      </div>
                    </div>

                    {/* Front Caption */}
                    <div className="w-full px-1 text-center">
                      <p className="text-sm font-bold tracking-tight text-zinc-900 mb-0.5">
                        {selectedPolaroid.photoTitle}
                      </p>
                      <p className="text-[11px] text-zinc-600 font-mono">
                        {selectedPolaroid.location} • {selectedPolaroid.date}
                      </p>
                    </div>

                    {/* Flip cue badge */}
                    <div className="mt-3 flex items-center gap-1 text-[10px] text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-full font-mono">
                      <RotateCw className="w-3 h-3" />
                      <span>Click to flip to handwritten back</span>
                    </div>
                  </div>

                  {/* BACK: Authentic Yellowed Note Paper with Handwritten Message */}
                  <div
                    className="absolute inset-0 w-full h-full bg-[#f4ebd0] text-zinc-900 rounded-sm p-5 shadow-2xl border border-amber-900/20 flex flex-col justify-between"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    <div>
                      {/* Postmark stamp */}
                      <div className="flex items-center justify-between border-b border-amber-900/20 pb-2 mb-3">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-amber-900/60 font-bold">
                          POST CARD • ETHIOPIA
                        </span>
                        <span className="text-[10px] font-mono text-amber-900/70">
                          {selectedPolaroid.date}
                        </span>
                      </div>

                      {/* Handwritten Note */}
                      <blockquote className="font-serif italic text-sm sm:text-base leading-relaxed text-zinc-900 my-2">
                        {selectedPolaroid.handwrittenNote}
                      </blockquote>

                      <p className="mt-3 text-xs text-zinc-700 leading-relaxed">
                        {selectedPolaroid.caption}
                      </p>
                    </div>

                    {/* Footer sign-off */}
                    <div className="border-t border-amber-900/20 pt-2 flex items-center justify-between text-[11px] font-mono text-amber-900/80">
                      <span>Daniel Kidanu & Yerosen Desalegn</span>
                      <span className="font-bold">Brothers for Life</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Controls */}
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleFlip}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-200 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5 text-amber-400" />
                <span>{isFlipped ? 'View Photo Front' : 'Flip to Handwritten Back'}</span>
              </button>

              {onJumpToProgress && (
                <button
                  type="button"
                  onClick={() => {
                    handleJumpToMilestone(selectedPolaroid);
                    setSelectedPolaroid(null);
                  }}
                  className="px-4 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs font-mono flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Glide 3D Camera Here</span>
                </button>
              )}
            </div>

            {/* Other Milestones in this Category */}
            <div className="mt-5">
              <h4 className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-2">
                More {filterYear === 'all' ? '2016–2019' : filterYear} Milestone Polaroids:
              </h4>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {modalPolaroids.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedPolaroid(item);
                      setIsFlipped(false);
                      soundEngine.playPolaroidPop();
                    }}
                    className={`shrink-0 flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedPolaroid.id === item.id
                        ? 'bg-amber-400/20 border-amber-400 text-white'
                        : 'bg-white/5 border-white/10 hover:border-white/25 text-zinc-300'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.accentColor }} />
                    <span className="text-xs font-medium truncate max-w-[120px]">{item.photoTitle}</span>
                    <span className="text-[10px] font-mono text-zinc-500">{item.year}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
