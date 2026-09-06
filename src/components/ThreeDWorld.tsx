import React, { useMemo } from 'react';
import { Chapter, MemoryItem, FriendshipProfile, FriendshipEcho, MilestonePolaroid } from '../types';
import { ChapterCard } from './ChapterCard';
import { MemoryArtifact } from './MemoryArtifact';
import { FinaleKeepsake } from './FinaleKeepsake';
import { FriendshipEchoes } from './FriendshipEchoes';
import { MilestonePolaroids3D } from './MilestonePolaroids3D';
import { friendshipEchoes as defaultEchoes, milestonePolaroids as defaultMilestonePolaroids } from '../data/friendshipTimeline';

interface ThreeDWorldProps {
  cameraZ: number;
  rotX: number;
  rotY: number;
  chapters: Chapter[];
  memoryArtifacts: MemoryItem[];
  echoes?: FriendshipEcho[];
  milestonePolaroids?: MilestonePolaroid[];
  onSelectPolaroid?: (polaroid: MilestonePolaroid) => void;
  profile: FriendshipProfile;
  onJumpToNextChapter: (currentIndex: number) => void;
  onRewind: () => void;
}

export const ThreeDWorld: React.FC<ThreeDWorldProps> = ({
  cameraZ,
  rotX,
  rotY,
  chapters,
  memoryArtifacts,
  echoes = defaultEchoes,
  milestonePolaroids = defaultMilestonePolaroids,
  onSelectPolaroid,
  profile,
  onJumpToNextChapter,
  onRewind,
}) => {
  // World transform with smoothed camera position and mouse tilt
  const worldTransform = `translateZ(${cameraZ}px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;

  // Subtle floating 3D dust specks suspended along the tunnel corridor
  const ambientDustSpecks = useMemo(() => {
    const specks = [];
    const colors = [
      'rgba(245, 198, 125, 0.7)',
      'rgba(251, 191, 36, 0.6)',
      'rgba(254, 243, 199, 0.75)',
      'rgba(220, 230, 245, 0.55)',
    ];
    for (let i = 0; i < 70; i++) {
      specks.push({
        id: `speck-${i}`,
        x: (Math.random() - 0.5) * 1100,
        y: (Math.random() - 0.5) * 800,
        z: -Math.random() * 8200 - 150,
        size: Math.random() * 2.2 + 1.2,
        alpha: Math.random() * 0.45 + 0.25,
        color: colors[i % colors.length],
        glow: Math.random() < 0.4,
      });
    }
    return specks;
  }, []);

  return (
    <div
      id="viewport-stage"
      className="fixed inset-0 overflow-hidden pointer-events-none z-10 flex items-center justify-center"
      style={{
        perspective: '1100px',
        perspectiveOrigin: '50% 50%',
      }}
    >
      {/* 3D World container */}
      <div
        id="world-3d"
        className="relative w-full h-full"
        style={{
          transformStyle: 'preserve-3d',
          transform: worldTransform,
          willChange: 'transform',
        }}
      >
        {/* Floating 3D ambient light rings along the tunnel */}
        {[-800, -2300, -3800, -5300, -6800].map((ringZ, idx) => {
          const relativeZ = ringZ + cameraZ;
          if (relativeZ < -3000 || relativeZ > 600) return null;
          return (
            <div
              key={`ring-${idx}`}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] rounded-full border border-white/5 pointer-events-none"
              style={{
                transform: `translate3d(0, 0, ${ringZ}px)`,
                boxShadow: '0 0 120px rgba(244, 63, 94, 0.04), inset 0 0 80px rgba(56, 189, 248, 0.03)',
                transformStyle: 'preserve-3d',
              }}
            />
          );
        })}

        {/* 3D Atmospheric Suspended Dust Specks */}
        {ambientDustSpecks.map((speck) => {
          const relativeZ = speck.z + cameraZ;
          if (relativeZ < -1100 || relativeZ > 250) return null;
          const depthAlpha = Math.max(0, Math.min(speck.alpha, (1 - Math.abs(relativeZ) / 1100) * speck.alpha));
          return (
            <div
              key={speck.id}
              className="absolute top-1/2 left-1/2 rounded-full pointer-events-none"
              style={{
                width: `${speck.size}px`,
                height: `${speck.size}px`,
                transform: `translate3d(${speck.x}px, ${speck.y}px, ${speck.z}px)`,
                backgroundColor: speck.color,
                boxShadow: speck.glow ? `0 0 6px ${speck.color}` : 'none',
                opacity: depthAlpha,
                transformStyle: 'preserve-3d',
              }}
            />
          );
        })}

        {/* Friendship Echoes: Ambient 3D conversation snippets appearing at scroll milestones */}
        <FriendshipEchoes echoes={echoes} cameraZ={cameraZ} />

        {/* Milestone Polaroids (2016-2019 timeline floating memories) */}
        {milestonePolaroids && onSelectPolaroid && (
          <MilestonePolaroids3D
            polaroids={milestonePolaroids}
            cameraZ={cameraZ}
            onSelectPolaroid={onSelectPolaroid}
          />
        )}

        {/* Milestone Chapters */}
        {chapters.map((chapter) => (
          <ChapterCard
            key={chapter.id}
            chapter={chapter}
            profile={profile}
            cameraZ={cameraZ}
            onJumpToNext={() => onJumpToNextChapter(chapter.index)}
          />
        ))}

        {/* Floating Memory Artifacts */}
        {memoryArtifacts.map((item) => (
          <MemoryArtifact
            key={item.id}
            memory={item}
            cameraZ={cameraZ}
          />
        ))}

        {/* Finale Keepsake Module */}
        <FinaleKeepsake
          profile={profile}
          cameraZ={cameraZ}
          onRewind={onRewind}
        />
      </div>
    </div>
  );
};
