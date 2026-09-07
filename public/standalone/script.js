/* ==========================================================================
   Friendship 3D Scroll Journey - Pure JavaScript Engine
   ========================================================================== */

(function() {
  'use strict';

  const TOTAL_Z_DEPTH = 7600; // total distance along Z axis
  const world3D = document.getElementById('world3D');
  const timelineProgress = document.getElementById('timelineProgress');
  const milestoneDots = document.querySelectorAll('.milestone-dot');
  const soundBtn = document.getElementById('soundBtn');
  const autoScrollBtn = document.getElementById('autoScrollBtn');
  const revisitBtn = document.getElementById('revisitBtn');

  // Camera State
  let targetCameraZ = 0;
  let currentCameraZ = 0;
  let targetRotX = 0;
  let currentRotX = 0;
  let targetRotY = 0;
  let currentRotY = 0;

  // Auto Scroll state
  let isAutoScrolling = false;
  let autoScrollSpeed = 3.5;

  // Audio Context (Synthesizer for soothing friendship chimes)
  let audioCtx = null;
  let isAudioMuted = true;
  const pentatonicScale = [261.63, 329.63, 392.0, 523.25, 587.33, 659.25, 783.99];
  let lastChimeTime = 0;

  function initAudio() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playAmbientChime(freq = 523.25) {
    if (isAudioMuted) return;
    try {
      initAudio();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 1.2);
    } catch(e) {}
  }

  function playHeartPop(force = true) {
    if (isAudioMuted && !force) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const now = audioCtx.currentTime;

      // Soft bubbly pop
      const popOsc = audioCtx.createOscillator();
      const popGain = audioCtx.createGain();
      popOsc.type = 'sine';
      popOsc.frequency.setValueAtTime(360, now);
      popOsc.frequency.exponentialRampToValueAtTime(820, now + 0.035);
      popOsc.frequency.exponentialRampToValueAtTime(440, now + 0.08);

      popGain.gain.setValueAtTime(0.001, now);
      popGain.gain.exponentialRampToValueAtTime(0.09, now + 0.015);
      popGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      popOsc.connect(popGain);
      popGain.connect(audioCtx.destination);
      popOsc.start(now);
      popOsc.stop(now + 0.13);

      // Sweet sparkling chime
      const chimeOsc = audioCtx.createOscillator();
      const chimeGain = audioCtx.createGain();
      chimeOsc.type = 'sine';
      chimeOsc.frequency.setValueAtTime(880, now + 0.015);
      chimeOsc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.05);

      chimeGain.gain.setValueAtTime(0.0001, now);
      chimeGain.gain.exponentialRampToValueAtTime(0.06, now + 0.03);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

      chimeOsc.connect(chimeGain);
      chimeGain.connect(audioCtx.destination);
      chimeOsc.start(now + 0.015);
      chimeOsc.stop(now + 0.52);
    } catch(e) {}
  }

  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      isAudioMuted = !isAudioMuted;
      initAudio();
      soundBtn.querySelector('.icon').textContent = isAudioMuted ? 'Sound: Off' : 'Sound: On 🎵';
      soundBtn.style.borderColor = isAudioMuted ? 'rgba(255, 255, 255, 0.16)' : '#f43f5e';
      if (!isAudioMuted) playAmbientChime(440);
    });
  }

  if (autoScrollBtn) {
    autoScrollBtn.addEventListener('click', () => {
      isAutoScrolling = !isAutoScrolling;
      autoScrollBtn.querySelector('.icon').textContent = isAutoScrolling ? 'Pause' : 'Auto Play';
      autoScrollBtn.style.background = isAutoScrolling ? 'rgba(244, 63, 94, 0.3)' : 'rgba(255, 255, 255, 0.08)';
    });
  }

  if (revisitBtn) {
    revisitBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Handle Milestone Clicks
  milestoneDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const targetPercent = parseFloat(dot.getAttribute('data-target'));
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: targetPercent * maxScroll, behavior: 'smooth' });
    });
  });

  // Mouse Parallax
  window.addEventListener('mousemove', (e) => {
    const normX = (e.clientX / window.innerWidth) - 0.5;
    const normY = (e.clientY / window.innerHeight) - 0.5;
    targetRotY = normX * 8;   // degrees
    targetRotX = -normY * 6;  // degrees
  });

  // Render Loop (60/120fps with Lerp)
  function renderLoop() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollY = window.scrollY || window.pageYOffset;
    const progress = Math.min(Math.max(scrollY / (maxScroll || 1), 0), 1);

    if (isAutoScrolling) {
      window.scrollBy(0, autoScrollSpeed);
      if (progress >= 0.999) isAutoScrolling = false;
    }

    targetCameraZ = progress * TOTAL_Z_DEPTH;

    // Smooth Lerping
    currentCameraZ += (targetCameraZ - currentCameraZ) * 0.08;
    currentRotX += (targetRotX - currentRotX) * 0.05;
    currentRotY += (targetRotY - currentRotY) * 0.05;

    // Apply 3D Camera Matrix
    if (world3D) {
      world3D.style.transform = `translateZ(${currentCameraZ}px) rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg)`;
    }

    // Update Progress Bar
    if (timelineProgress) {
      timelineProgress.style.width = `${(progress * 100).toFixed(1)}%`;
    }

    // Highlight active milestone dot
    milestoneDots.forEach(dot => {
      const dotTarget = parseFloat(dot.getAttribute('data-target'));
      if (Math.abs(progress - dotTarget) < 0.1) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // Sound on travel
    const deltaZ = Math.abs(targetCameraZ - currentCameraZ);
    if (!isAudioMuted && deltaZ > 4 && performance.now() - lastChimeTime > 400) {
      const randomFreq = pentatonicScale[Math.floor(Math.random() * pentatonicScale.length)];
      playAmbientChime(randomFreq);
      lastChimeTime = performance.now();
    }

    requestAnimationFrame(renderLoop);
  }
  requestAnimationFrame(renderLoop);

  // Starfield Canvas in Background
  const canvas = document.getElementById('starfield');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let stars = [];

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    }
    window.addEventListener('resize', resizeCanvas);

    function initStars() {
      stars = [];
      const count = Math.min(window.innerWidth > 768 ? 160 : 70, 200);
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z: Math.random() * 2000,
          radius: Math.random() * 1.6 + 0.4,
          alpha: Math.random() * 0.7 + 0.3
        });
      }
    }
    resizeCanvas();

    function drawStars() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const speed = (targetCameraZ - currentCameraZ) * 0.15;

      for (let star of stars) {
        star.z -= speed;
        if (star.z < 1) star.z = 2000;
        if (star.z > 2000) star.z = 1;

        const perspective = 400 / star.z;
        const sx = (star.x - canvas.width / 2) * perspective + canvas.width / 2;
        const sy = (star.y - canvas.height / 2) * perspective + canvas.height / 2;
        const r = Math.max(0.4, star.radius * perspective * 2);

        if (sx > 0 && sx < canvas.width && sy > 0 && sy < canvas.height) {
          ctx.beginPath();
          ctx.arc(sx, sy, r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha * Math.min(1, perspective * 1.5)})`;
          ctx.fill();
        }
      }
      requestAnimationFrame(drawStars);
    }
    requestAnimationFrame(drawStars);
  }

  // Interactive Floating Heart particle burst & audio pop on hover / click
  const floatingHearts = document.querySelectorAll('.floating-card-heart');
  const particleColors = ['#fb7185', '#f43f5e', '#fda4af', '#fbbf24', '#f472b6', '#ffe4e6'];

  function triggerHeartRing(heartEl) {
    heartEl.classList.remove('animate-heart-ring');
    // Force reflow to allow immediate retriggering
    void heartEl.offsetWidth;
    heartEl.classList.add('animate-heart-ring');

    const ring = document.createElement('div');
    ring.className = 'heart-ring animate-heart-ring';
    heartEl.appendChild(ring);

    setTimeout(() => {
      heartEl.classList.remove('animate-heart-ring');
      if (ring.parentNode) ring.parentNode.removeChild(ring);
    }, 650);
  }

  function triggerHeartBurst(heartEl, isClick = false) {
    if (isClick) {
      playHeartPop(true);
      triggerHeartRing(heartEl);
    } else {
      playAmbientChime(659.25);
    }

    const count = isClick ? 14 : 10;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 2 * Math.PI + (Math.random() * 0.4 - 0.2);
      const distance = (isClick ? 32 : 28) + Math.random() * (isClick ? 36 : 32);
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance - (16 + Math.random() * 18);
      const rot = (Math.random() - 0.5) * 60;
      const scale = (isClick ? 0.75 : 0.65) + Math.random() * 0.45;
      const color = particleColors[Math.floor(Math.random() * particleColors.length)];
      const size = (isClick ? 10 : 9) + Math.random() * 5;
      const duration = 750 + Math.random() * 300;

      const p = document.createElement('div');
      p.className = 'standalone-heart-particle';
      p.style.setProperty('--dx', `${dx}px`);
      p.style.setProperty('--dy', `${dy}px`);
      p.style.setProperty('--rot', `${rot}deg`);
      p.style.setProperty('--scale', scale);
      p.style.setProperty('--duration', `${duration}ms`);
      p.innerHTML = `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="${color}" stroke="${color}"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`;

      heartEl.appendChild(p);
      setTimeout(() => {
        if (p.parentNode) p.parentNode.removeChild(p);
      }, duration + 100);
    }
  }

  floatingHearts.forEach(heartEl => {
    heartEl.addEventListener('mouseenter', () => {
      triggerHeartBurst(heartEl, false);
    });

    heartEl.addEventListener('click', (e) => {
      e.stopPropagation();
      heartEl.classList.add('is-activated');
      heartEl.setAttribute('data-activated', 'true');
      const tooltipSpan = heartEl.querySelector('.custom-heart-tooltip span:nth-of-type(2)');
      if (tooltipSpan) {
        tooltipSpan.textContent = 'Brotherhood Bond Acknowledged ✨';
      }
      triggerHeartBurst(heartEl, true);
    });
  });

})();
