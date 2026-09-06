import React, { useEffect, useRef } from 'react';

interface StarfieldCanvasProps {
  speedFactor?: number;
}

interface DustMote {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  size: number;
  alpha: number;
  color: string;
  isForegroundBokeh: boolean;
  driftSpeedX: number;
  driftSpeedY: number;
  floatAngle: number;
  phase: number;
  wobbleSpeed: number;
}

export const StarfieldCanvas: React.FC<StarfieldCanvasProps> = ({ speedFactor = 0 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const speedRef = useRef(speedFactor);
  speedRef.current = speedFactor;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Warm ambient palettes for atmospheric sunlight/candlelight dust
    const dustColors = [
      '245, 198, 125', // warm amber dust
      '253, 230, 138', // golden sun speck
      '254, 243, 199', // soft champagne mote
      '220, 230, 245', // cool ethereal air particle
      '244, 214, 185', // candlelight haze
    ];

    // Atmospheric Floating Dust particles pool
    const particleCount = Math.min(window.innerWidth > 768 ? 190 : 85, 220);
    const dustParticles: DustMote[] = [];

    for (let i = 0; i < particleCount; i++) {
      const isBokeh = Math.random() < 0.12; // 12% foreground bokeh motes
      const z = Math.random() * 2600 + 80;
      const x = (Math.random() - 0.5) * width * 2.2;
      const y = (Math.random() - 0.5) * height * 2.2;

      dustParticles.push({
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        size: isBokeh ? Math.random() * 3.5 + 2.0 : Math.random() * 1.6 + 0.5,
        alpha: isBokeh ? Math.random() * 0.25 + 0.12 : Math.random() * 0.5 + 0.2,
        color: dustColors[Math.floor(Math.random() * dustColors.length)],
        isForegroundBokeh: isBokeh,
        driftSpeedX: (Math.random() - 0.5) * 0.35,
        driftSpeedY: -0.15 - Math.random() * 0.25, // gentle upward thermal convection
        floatAngle: Math.random() * Math.PI * 2,
        phase: Math.random() * 100,
        wobbleSpeed: Math.random() * 0.015 + 0.005,
      });
    }

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.012;

      const scrollZDelta = speedRef.current * 0.38;

      for (let i = 0; i < dustParticles.length; i++) {
        const p = dustParticles[i];

        // 1. Organic Brownian air-current drift and micro-turbulence
        p.floatAngle += p.wobbleSpeed;
        const airDriftX = Math.sin(time * 0.7 + p.phase) * 0.35 + Math.cos(p.floatAngle) * 0.25;
        const airDriftY = Math.cos(time * 0.5 + p.phase) * 0.25 + p.driftSpeedY;

        p.x += p.driftSpeedX + airDriftX;
        p.y += airDriftY;

        // Wrap around room boundaries smoothly
        const boundX = width * 1.3;
        const boundY = height * 1.3;
        if (p.x < -boundX) p.x = boundX;
        if (p.x > boundX) p.x = -boundX;
        if (p.y < -boundY) p.y = boundY;
        if (p.y > boundY) p.y = -boundY;

        // 2. Scroll camera advance along Z depth
        p.z -= scrollZDelta;
        // Also subtle natural forward/backward idle drift
        p.z -= 0.12;

        if (p.z < 20) {
          p.z = 2600;
          p.x = (Math.random() - 0.5) * width * 2.2;
          p.y = (Math.random() - 0.5) * height * 2.2;
        } else if (p.z > 2600) {
          p.z = 20;
        }

        // 3. 3D Perspective Projection
        const fov = 420;
        const scale = fov / Math.max(p.z, 20);
        const screenX = width / 2 + p.x * scale;
        const screenY = height / 2 + p.y * scale;

        // Skip if outside viewport bounds (with margin)
        if (screenX < -30 || screenX > width + 30 || screenY < -30 || screenY > height + 30) {
          continue;
        }

        // 4. Depth-based opacity and optical bokeh defocus
        const depthRatio = 1 - p.z / 2600; // 0 (far) to 1 (near)
        const radius = Math.max(0.5, p.size * scale * 1.4);

        // Breathing twinkle & shimmer
        const shimmer = 0.85 + Math.sin(time * 2 + p.phase) * 0.15;
        const currentAlpha = Math.min(0.85, Math.max(0.04, p.alpha * depthRatio * shimmer));

        ctx.beginPath();

        if (p.isForegroundBokeh && p.z < 600) {
          // Soft out-of-focus bokeh disc for dust floating close to the camera
          const grad = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, radius * 2.2);
          grad.addColorStop(0, `rgba(${p.color}, ${currentAlpha * 0.9})`);
          grad.addColorStop(0.5, `rgba(${p.color}, ${currentAlpha * 0.4})`);
          grad.addColorStop(1, `rgba(${p.color}, 0)`);
          ctx.fillStyle = grad;
          ctx.arc(screenX, screenY, radius * 2.2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Standard luminous floating dust mote
          ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.color}, ${currentAlpha})`;
          ctx.fill();

          // Subtle atmospheric haze halo around illuminated specks
          if (p.z < 900 && radius > 1.2) {
            ctx.shadowBlur = Math.min(10, radius * 3);
            ctx.shadowColor = `rgba(${p.color}, ${currentAlpha * 0.6})`;
          } else {
            ctx.shadowBlur = 0;
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="starfield-canvas"
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
};
