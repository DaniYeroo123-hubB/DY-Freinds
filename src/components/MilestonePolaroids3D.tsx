import React, { useState, useRef } from 'react';
import { MilestonePolaroid } from '../types';
import { Camera, Sparkles, RotateCw, MapPin } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface MilestonePolaroids3DProps {
  polaroids: MilestonePolaroid[];
  cameraZ: number;
  onSelectPolaroid: (polaroid: MilestonePolaroid) => void;
}

export const MilestonePolaroids3D: React.FC<MilestonePolaroids3DProps> = ({
  polaroids,
  cameraZ,
  onSelectPolaroid,
}) => {
  return (
    <>
      {polaroids.map((p) => (
        <Polaroid3DItem
          key={p.id}
          polaroid={p}
          cameraZ={cameraZ}
          onSelect={() => onSelectPolaroid(p)}
        />
      ))}
    </>
  );
};

interface Polaroid3DItemProps {
  polaroid: MilestonePolaroid;
  cameraZ: number;
  onSelect: () => void;
}

const Polaroid3DItem: React.FC<Polaroid3DItemProps> = ({ polaroid, cameraZ, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const relativeZ = polaroid.pos.z + cameraZ;

  // Frustum culling
  if (relativeZ < -1100 || relativeZ > 120) {
    return null;
  }

  // Calculate smooth fade-in and scale-up entrance animation
  let opacity = 0;
  let scale = 0.8;

  if (relativeZ >= -1100 && relativeZ < -350) {
    const t = (relativeZ + 1100) / 750;
    opacity = Math.max(0, Math.min(1, t * t * (3 - 2 * t)));
    scale = 0.75 + t * 0.25;
  } else if (relativeZ >= -350 && relativeZ <= 20) {
    opacity = 1;
    scale = 1.0;
  } else if (relativeZ > 20 && relativeZ <= 120) {
    const t = (relativeZ - 20) / 100;
    opacity = Math.max(0, 1 - t);
    scale = 1.0 + t * 0.12;
  }

  if (opacity < 0.02) return null;

  // Reduced blur
  const farDist = Math.max(0, -relativeZ - 380);
  const blurPx = Math.min(1.2, farDist * 0.002);
  const filter = blurPx >= 0.7 ? `blur(${blurPx.toFixed(1)}px)` : 'none';

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: -y * 14, y: x * 14 });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playPolaroidPop();
    onSelect();
  };

  const baseTransform = `translate3d(${polaroid.pos.x}px, ${polaroid.pos.y}px, ${polaroid.pos.z}px) rotateX(${
    polaroid.pos.rotX || 0
  }deg) rotateY(${polaroid.pos.rotY || 0}deg) rotateZ(${polaroid.rotationDeg}deg)`;

  return (
    <div
      id={`milestone-polaroid-3d-${polaroid.id}`}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 select-none"
      style={{
        transform: baseTransform,
        opacity,
        filter,
        transformStyle: 'preserve-3d',
        willChange: 'transform, opacity',
      }}
    >
      <div
        className="transition-transform duration-200 ease-out animate-float-subtle"
        style={{
          transformStyle: 'preserve-3d',
          transform: `scale(${scale.toFixed(3)})`,
        }}
      >
        <div
          ref={containerRef}
          data-cursor="artifact"
          data-cursor-label="Inspect Polaroid"
          onMouseEnter={() => setIsHovered(true)}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          title={`${polaroid.photoTitle} • Click to Inspect`}
          className="cursor-pointer group select-none transition-transform duration-150 ease-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          }}
        >
          {/* Polaroid Frame */}
          <div className="relative w-44 sm:w-48 bg-[#fdfcf9] text-zinc-900 rounded-sm p-2.5 pb-4 shadow-[0_15px_35px_rgba(0,0,0,0.6)] border border-zinc-300 hover:border-amber-400/80 hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all duration-300">
            {/* Washi / Scotch Tape */}
            <div
              className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-4.5 rounded-xs shadow-xs pointer-events-none opacity-85"
              style={{
                backgroundColor: polaroid.tapeColor || 'rgba(245, 158, 11, 0.45)',
                transform: 'rotate(-2deg)',
              }}
            />

            {/* Photo Viewport */}
            <div className="relative w-full aspect-square bg-zinc-950 rounded-xs overflow-hidden mb-2 border border-zinc-200 shadow-inner">
              {polaroid.image ? (
                <img
                  src={polaroid.image}
                  alt={polaroid.photoTitle}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-gradient-to-br from-zinc-800 to-zinc-950 text-zinc-200">
                  <Camera className="w-6 h-6 text-amber-400/90 mb-1" />
                  <span className="text-[10px] font-mono leading-tight">{polaroid.photoTitle}</span>
                </div>
              )}

              {/* Year Stamp */}
              <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-bold font-mono bg-black/80 text-amber-300 backdrop-blur-xs">
                {polaroid.year}
              </div>
            </div>

            {/* Handwritten Caption Area */}
            <div className="px-1 text-center">
              <p className="text-xs font-bold font-sans text-zinc-900 truncate leading-tight">
                {polaroid.photoTitle}
              </p>
              <p className="text-[9px] text-zinc-600 font-mono truncate mt-0.5">
                {polaroid.date}
              </p>
            </div>

            {/* Pop-up Badge */}
            <div className="mt-2 flex items-center justify-center gap-1 text-[9px] font-mono text-amber-900/90 bg-amber-200/50 py-0.5 rounded-full">
              <Sparkles className="w-2.5 h-2.5 text-amber-600" />
              <span>Milestone Memory</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
