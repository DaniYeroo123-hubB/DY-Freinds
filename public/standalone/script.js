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

})();
