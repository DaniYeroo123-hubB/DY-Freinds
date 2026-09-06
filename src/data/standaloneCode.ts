export const standaloneHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Friendship 3D Scroll Journey</title>
  <link rel="stylesheet" href="style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap" rel="stylesheet">
</head>
<body>

  <!-- Top Progress HUD -->
  <header class="hud-header">
    <div class="hud-brand">
      <span class="hud-dot"></span>
      <span class="hud-title">Maya & Liam</span>
      <span class="hud-divider">/</span>
      <span class="hud-subtitle">A Decade of Friendship</span>
    </div>
    <div class="hud-controls">
      <button id="soundBtn" class="hud-btn" title="Toggle Ambient Audio">
        <span class="icon">Sound: Off</span>
      </button>
      <button id="autoScrollBtn" class="hud-btn" title="Auto Glide">
        <span class="icon">Auto Play</span>
      </button>
    </div>
  </header>

  <!-- Starfield Canvas for 3D depth -->
  <canvas id="starfield"></canvas>

  <!-- 3D Viewport Stage -->
  <div class="viewport-stage">
    <div id="world3D" class="world-3d">
      
      <!-- CHAPTER 0 -->
      <article class="chapter-card" style="--tx: 0px; --ty: 0px; --tz: -200px; --ry: 0deg;">
        <div class="card-glass">
          <div class="card-badge">2015 &bull; The Spark</div>
          <h2 class="card-title">The Accidental Collision</h2>
          <p class="card-subtitle">Where Two Unlikely Worlds Crossed Paths</p>
          <div class="card-divider"></div>
          <p class="card-text">
            A rainy Tuesday in the school library. An overloaded backpack ripped open, sending sketchbooks and geometry papers flying across the linoleum. Hands reached down to help gather the loose sheets. One picked up a doodle of a space cat, burst out laughing, and said: "Did you draw this?"
          </p>
          <div class="dialogue-box">
            <p><strong>Liam:</strong> "Nice cat. Does it breathe oxygen or pure tuna?"</p>
            <p><strong>Maya:</strong> "Pure sarcasm. And thanks for saving page twelve."</p>
          </div>
          <blockquote class="card-quote">
            "Some people arrive quietly in your life, not knowing they will one day hold half your memories."
          </blockquote>
        </div>
      </article>

      <!-- FLOATING MEMORY 1 -->
      <div class="memory-artifact polaroid" style="--tx: -340px; --ty: -130px; --tz: -650px; --ry: 18deg; --rz: -8deg;">
        <div class="polaroid-inner">
          <div class="polaroid-photo">
            <div class="photo-illustration cat-doodle">🐱🚀</div>
          </div>
          <div class="polaroid-caption">Space Cat Sketch &bull; Oct 2015</div>
        </div>
      </div>

      <!-- CHAPTER 1 -->
      <article class="chapter-card" style="--tx: -60px; --ty: -20px; --tz: -1600px; --ry: 6deg;">
        <div class="card-glass">
          <div class="card-badge">2017 &bull; Golden Days</div>
          <h2 class="card-title">The Rooftop Constellations</h2>
          <p class="card-subtitle">Cold Pizza, Cardboard Forts & Uncensored Dreams</p>
          <div class="card-divider"></div>
          <p class="card-text">
            The fire escape behind the old apartment was our sovereign territory. Wrapped in mismatched thrift jackets at 2 AM, we mapped out lives that felt too bold to speak in the daylight. We admitted our deepest fears and promised to cheer each other on forever.
          </p>
          <div class="dialogue-box">
            <p><strong>Maya:</strong> "What if we get to thirty and have no idea what we are doing?"</p>
            <p><strong>Liam:</strong> "Then we’ll sit on another fire escape and eat pizza at thirty-one."</p>
          </div>
          <blockquote class="card-quote">
            "True friends don’t just watch you grow; they water the seeds you didn't even know you planted."
          </blockquote>
        </div>
      </article>

      <!-- FLOATING MEMORY 2 -->
      <div class="memory-artifact cassette" style="--tx: 360px; --ty: 140px; --tz: -2200px; --ry: -20deg; --rz: 8deg;">
        <div class="cassette-inner">
          <div class="cassette-label">
            <span class="tape-title">Songs For Fire Escapes (Mixtape)</span>
            <span class="tape-sub">Side A: Indie Rock &bull; Side B: 90s Jams</span>
          </div>
          <div class="cassette-wheels">
            <div class="wheel"></div>
            <div class="wheel"></div>
          </div>
        </div>
      </div>

      <!-- CHAPTER 2 -->
      <article class="chapter-card" style="--tx: 70px; --ty: 30px; --tz: -3000px; --ry: -7deg;">
        <div class="card-glass">
          <div class="card-badge">2019 &bull; True Anchor</div>
          <h2 class="card-title">The Storm We Weathered</h2>
          <p class="card-subtitle">When Words Weren’t Needed, Just Presence</p>
          <div class="card-divider"></div>
          <p class="card-text">
            Life dealt unexpected blows: failed auditions, broken hearts, and college rejections. There were no empty motivational speeches. Just an umbrella held over soaked shoulders in an empty diner parking lot, lukewarm fries, and quiet presence until the shaking stopped.
          </p>
          <blockquote class="card-quote">
            "A best friend is the one who walks in when the rest of the world has walked out."
          </blockquote>
        </div>
      </article>

      <!-- CHAPTER 3 -->
      <article class="chapter-card" style="--tx: -80px; --ty: -30px; --tz: -4400px; --ry: 8deg;">
        <div class="card-glass">
          <div class="card-badge">2021 &bull; Across Oceans</div>
          <h2 class="card-title">Oceans Apart, Never Distant</h2>
          <p class="card-subtitle">8,000 Miles, 3 Time Zones & 40-Minute Voice Notes</p>
          <div class="card-divider"></div>
          <p class="card-text">
            Jobs took Maya across the ocean while Liam remained in Chicago. But real bonds do not fray under mileage. Waking up to 14 memes, sending rambling 40-minute voice notes while walking to the grocery store, and synchronizing film watch parties proved friendship is an emotional postal code.
          </p>
          <blockquote class="card-quote">
            "Distance means so little when someone means so much."
          </blockquote>
        </div>
      </article>

      <!-- CHAPTER 4 -->
      <article class="chapter-card" style="--tx: 60px; --ty: 20px; --tz: -5800px; --ry: -6deg;">
        <div class="card-glass">
          <div class="card-badge">2024 &bull; Reunion</div>
          <h2 class="card-title">The Five-Second Rule</h2>
          <p class="card-subtitle">Terminal 3 & The Instant Rewind</p>
          <div class="card-divider"></div>
          <p class="card-text">
            Twenty-six months of separation evaporated the split-second the airport sliding doors opened. We stood still for five seconds—and then collided in a hug that sent luggage rolling. Within minutes we were laughing about the same silly jokes from 2016. Real friendship never restarts; it resumes.
          </p>
        </div>
      </article>

      <!-- CHAPTER 5 (FINALE) -->
      <article class="chapter-card finale-card" style="--tx: 0px; --ty: 0px; --tz: -7200px; --ry: 0deg;">
        <div class="card-glass gold-glow">
          <div class="card-badge gold">Forever &bull; The Bond</div>
          <h2 class="card-title">The Unbreakable Horizon</h2>
          <p class="card-subtitle">A Lifetime Warranty on Companionship</p>
          <div class="card-divider"></div>
          <p class="card-text">
            Over a decade of milestones, heartaches, celebrations, and inside jokes that nobody else will ever comprehend. In a noisy world where everything changes in a heartbeat, having one person who knows who you were, who you are, and who you aspire to be is life’s greatest gift.
          </p>
          <blockquote class="card-quote finale-quote">
            "To the one who knows all my stories, because they were right beside me in every chapter."
          </blockquote>
          <div class="finale-actions">
            <button id="revisitBtn" class="finale-btn">Rewind Journey &#x21A9;</button>
          </div>
        </div>
      </article>

    </div>
  </div>

  <!-- Bottom Navigation Timeline HUD -->
  <footer class="hud-footer">
    <div class="timeline-container">
      <div class="timeline-bar">
        <div id="timelineProgress" class="timeline-fill"></div>
      </div>
      <div class="timeline-milestones">
        <button class="milestone-dot active" data-target="0">2015</button>
        <button class="milestone-dot" data-target="0.2">2017</button>
        <button class="milestone-dot" data-target="0.4">2019</button>
        <button class="milestone-dot" data-target="0.61">2021</button>
        <button class="milestone-dot" data-target="0.8">2024</button>
        <button class="milestone-dot" data-target="1.0">Forever</button>
      </div>
    </div>
    <div class="scroll-hint">
      <span class="mouse-icon"></span>
      <span>Scroll or use Arrow Keys to travel through 3D memories</span>
    </div>
  </footer>

  <!-- Scroll Height Generator -->
  <div class="scroll-spacer"></div>

  <script src="script.js"></script>
</body>
</html>`;

export const standaloneCSS = `/* ==========================================================================
   Friendship 3D Scroll Journey - Pure CSS Styling
   ========================================================================== */

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --bg-primary: #0a0b10;
  --text-main: #f3f4f6;
  --text-muted: #9ca3af;
  --accent-gold: #f59e0b;
  --accent-rose: #f43f5e;
  --accent-cyan: #38bdf8;
  --card-bg: rgba(18, 20, 32, 0.78);
  --card-border: rgba(255, 255, 255, 0.12);
}

body {
  background-color: var(--bg-primary);
  color: var(--text-main);
  font-family: 'Plus Jakarta Sans', sans-serif;
  overflow-x: hidden;
  background-image: 
    radial-gradient(ellipse 80% 60% at 50% -20%, rgba(120, 50, 140, 0.25), transparent),
    radial-gradient(ellipse 60% 50% at 80% 80%, rgba(20, 80, 160, 0.2), transparent);
  min-height: 100vh;
}

/* Background Canvas */
#starfield {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
}

/* Scroll Spacer creates scrollable track */
.scroll-spacer {
  height: 800vh;
  width: 100%;
}

/* Fixed 3D Viewport Stage */
.viewport-stage {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  perspective: 1100px;
  perspective-origin: 50% 50%;
  overflow: hidden;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

/* 3D World container moved by camera Z & rotation */
.world-3d {
  width: 100%;
  height: 100%;
  position: absolute;
  transform-style: preserve-3d;
  will-change: transform;
}

/* HUD Header */
.hud-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 18px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 100;
  backdrop-filter: blur(12px);
  background: rgba(10, 11, 16, 0.6);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.hud-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
}

.hud-dot {
  width: 9px;
  height: 9px;
  background-color: var(--accent-rose);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--accent-rose);
}

.hud-title {
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.5px;
}

.hud-divider {
  color: rgba(255, 255, 255, 0.3);
}

.hud-subtitle {
  color: var(--text-muted);
  font-size: 14px;
}

.hud-controls {
  display: flex;
  gap: 12px;
}

.hud-btn {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.16);
  color: #fff;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
}

.hud-btn:hover {
  background: rgba(255, 255, 255, 0.16);
  border-color: rgba(255, 255, 255, 0.3);
}

/* 3D Chapter Cards */
.chapter-card {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 520px;
  max-width: 90vw;
  transform-style: preserve-3d;
  pointer-events: auto;
  transform: translate3d(
      calc(-50% + var(--tx, 0px)),
      calc(-50% + var(--ty, 0px)),
      var(--tz, 0px)
    )
    rotateY(var(--ry, 0deg));
  transition: opacity 0.3s ease;
}

.card-glass {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 24px;
  padding: 36px 40px;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(16px);
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, border-color 0.3s ease;
}

.card-glass:hover {
  border-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-4px);
}

.card-badge {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--accent-rose);
  background: rgba(244, 63, 94, 0.12);
  padding: 6px 14px;
  border-radius: 20px;
  margin-bottom: 16px;
  border: 1px solid rgba(244, 63, 94, 0.25);
}

.card-badge.gold {
  color: var(--accent-gold);
  background: rgba(245, 158, 11, 0.12);
  border-color: rgba(245, 158, 11, 0.3);
}

.card-title {
  font-family: 'Playfair Display', serif;
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  line-height: 1.25;
  margin-bottom: 8px;
}

.card-subtitle {
  color: var(--accent-gold);
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 18px;
}

.card-divider {
  height: 1px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.2), transparent);
  margin-bottom: 18px;
}

.card-text {
  color: #d1d5db;
  font-size: 15px;
  line-height: 1.7;
  margin-bottom: 20px;
}

.dialogue-box {
  background: rgba(0, 0, 0, 0.3);
  border-left: 3px solid var(--accent-cyan);
  padding: 12px 16px;
  border-radius: 0 12px 12px 0;
  margin-bottom: 20px;
  font-size: 13.5px;
  line-height: 1.6;
}

.dialogue-box p strong {
  color: var(--accent-cyan);
}

.card-quote {
  font-style: italic;
  font-size: 14px;
  color: #e5e7eb;
  padding-left: 14px;
  border-left: 2px solid var(--accent-rose);
  opacity: 0.9;
}

/* Floating Memories */
.memory-artifact {
  position: absolute;
  top: 50%;
  left: 50%;
  transform-style: preserve-3d;
  pointer-events: auto;
  transform: translate3d(
      calc(-50% + var(--tx, 0px)),
      calc(-50% + var(--ty, 0px)),
      var(--tz, 0px)
    )
    rotateY(var(--ry, 0deg))
    rotateZ(var(--rz, 0deg));
}

.polaroid-inner {
  width: 220px;
  background: #ffffff;
  padding: 12px 12px 24px 12px;
  border-radius: 8px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
  transform-origin: center;
  transition: transform 0.3s ease;
}

.polaroid-inner:hover {
  transform: scale(1.08) rotate(2deg);
}

.polaroid-photo {
  height: 170px;
  background: #1f2937;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.photo-illustration {
  font-size: 48px;
}

.polaroid-caption {
  margin-top: 12px;
  color: #111827;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
}

/* Cassette Artifact */
.cassette-inner {
  width: 240px;
  height: 150px;
  background: #27272a;
  border-radius: 12px;
  border: 2px solid #52525b;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.7);
  padding: 14px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.cassette-label {
  background: #f43f5e;
  padding: 8px 12px;
  border-radius: 6px;
  color: #fff;
  display: flex;
  flex-direction: column;
}

.tape-title {
  font-size: 11px;
  font-weight: 700;
}

.tape-sub {
  font-size: 9px;
  opacity: 0.85;
}

.cassette-wheels {
  background: #18181b;
  height: 50px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.wheel {
  width: 32px;
  height: 32px;
  background: #fff;
  border-radius: 50%;
  border: 5px solid #71717a;
}

/* Gold glow for finale */
.gold-glow {
  border-color: rgba(245, 158, 11, 0.4);
  box-shadow: 0 0 50px rgba(245, 158, 11, 0.25), 0 30px 60px rgba(0,0,0,0.8);
}

.finale-btn {
  margin-top: 24px;
  background: linear-gradient(135deg, var(--accent-rose), var(--accent-gold));
  color: #fff;
  border: none;
  padding: 12px 28px;
  border-radius: 30px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(244, 63, 94, 0.4);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.finale-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 14px 30px rgba(244, 63, 94, 0.6);
}

/* HUD Footer */
.hud-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 20px 32px;
  z-index: 100;
  backdrop-filter: blur(12px);
  background: rgba(10, 11, 16, 0.7);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.timeline-container {
  width: 100%;
  max-width: 600px;
  position: relative;
}

.timeline-bar {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 4px;
  overflow: hidden;
}

.timeline-fill {
  width: 0%;
  height: 100%;
  background: linear-gradient(90deg, var(--accent-rose), var(--accent-gold));
  transition: width 0.1s linear;
}

.timeline-milestones {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
}

.milestone-dot {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 11px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: color 0.2s ease;
}

.milestone-dot.active, .milestone-dot:hover {
  color: var(--accent-gold);
}

.scroll-hint {
  font-size: 12px;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 8px;
}

.mouse-icon {
  width: 12px;
  height: 18px;
  border: 2px solid var(--text-muted);
  border-radius: 10px;
  display: inline-block;
  position: relative;
}

.mouse-icon::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 4px;
  background: var(--text-muted);
  border-radius: 2px;
}

@media (max-width: 640px) {
  .hud-subtitle { display: none; }
  .hud-header { padding: 14px 20px; }
  .chapter-card { width: 92vw; }
  .card-glass { padding: 24px 22px; }
  .card-title { font-size: 22px; }
  .memory-artifact { display: none; }
}
`;

export const standaloneJS = `/* ==========================================================================
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

  soundBtn.addEventListener('click', () => {
    isAudioMuted = !isAudioMuted;
    initAudio();
    soundBtn.querySelector('.icon').textContent = isAudioMuted ? 'Sound: Off' : 'Sound: On 🎵';
    soundBtn.style.borderColor = isAudioMuted ? 'rgba(255, 255, 255, 0.16)' : '#f43f5e';
    if (!isAudioMuted) playAmbientChime(440);
  });

  autoScrollBtn.addEventListener('click', () => {
    isAutoScrolling = !isAutoScrolling;
    autoScrollBtn.querySelector('.icon').textContent = isAutoScrolling ? 'Pause' : 'Auto Play';
    autoScrollBtn.style.background = isAutoScrolling ? 'rgba(244, 63, 94, 0.3)' : 'rgba(255, 255, 255, 0.08)';
  });

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
    world3D.style.transform = \`translateZ(\${currentCameraZ}px) rotateX(\${currentRotX.toFixed(2)}deg) rotateY(\${currentRotY.toFixed(2)}deg)\`;

    // Update Progress Bar
    timelineProgress.style.width = \`\${(progress * 100).toFixed(1)}%\`;

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
        ctx.fillStyle = \`rgba(255, 255, 255, \${star.alpha * Math.min(1, perspective * 1.5)})\`;
        ctx.fill();
      }
    }
    requestAnimationFrame(drawStars);
  }
  requestAnimationFrame(drawStars);

})();
`;
