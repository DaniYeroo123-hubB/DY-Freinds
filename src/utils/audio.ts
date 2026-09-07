// Procedural audio synthesizer using Web Audio API for ambient friendship melodies

class AmbientSoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private gainNode: GainNode | null = null;
  private notes = [261.63, 329.63, 392.0, 523.25, 587.33, 659.25, 783.99]; // C major / A minor pentatonic peaceful notes
  private lastPlayTime = 0;

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.12, this.ctx.currentTime);
      this.gainNode.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.init();
    this.isMuted = !this.isMuted;
    if (!this.isMuted) {
      this.playChime(440, 0.6);
    }
    return !this.isMuted;
  }

  public getIsPlaying(): boolean {
    return !this.isMuted;
  }

  public playChime(freq = 523.25, duration = 1.2, force = false) {
    if (this.isMuted && !force) return;
    try {
      this.init();
      if (!this.ctx || !this.gainNode) return;

      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      noteGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      noteGain.gain.exponentialRampToValueAtTime(0.08, this.ctx.currentTime + 0.05);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(noteGain);
      noteGain.connect(this.gainNode);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio autoplay policy guard
    }
  }

  public onScrollTrigger(speed: number) {
    if (this.isMuted) return;
    const now = performance.now();
    if (now - this.lastPlayTime < 280) return;
    if (Math.abs(speed) < 2) return;

    this.lastPlayTime = now;
    const note = this.notes[Math.floor(Math.random() * this.notes.length)];
    this.playChime(note, 0.9);
  }

  public playMilestoneChord() {
    if (this.isMuted) return;
    const chord = [261.63, 329.63, 392.0, 523.25];
    chord.forEach((freq, idx) => {
      setTimeout(() => {
        this.playChime(freq, 1.8);
      }, idx * 120);
    });
  }

  public playEchoChime() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx || !this.gainNode) return;

      const freqs = [659.25, 880.0, 1046.5]; // E5, A5, C6 ethereal chime
      freqs.forEach((freq, i) => {
        setTimeout(() => {
          if (!this.ctx || !this.gainNode || this.isMuted) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
          gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.045, this.ctx.currentTime + 0.08);
          gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 2.2);
          osc.connect(gain);
          gain.connect(this.gainNode);
          osc.start();
          osc.stop(this.ctx.currentTime + 2.2);
        }, i * 90);
      });
    } catch {
      // Audio autoplay policy guard
    }
  }

  public playPolaroidPop() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx || !this.gainNode) return;

      // Crisp acoustic polaroid pop and shutter click
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(740, this.ctx.currentTime + 0.04);
      osc.frequency.exponentialRampToValueAtTime(180, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.06, this.ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(this.gainNode);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.19);
    } catch {
      // guard
    }
  }

  /**
   * Subtle, pleasant harmonic pop & crystalline chime for heart interactions
   */
  public playHeartPop(force = true) {
    if (this.isMuted && !force) return;
    try {
      this.init();
      if (!this.ctx || !this.gainNode) return;

      const now = this.ctx.currentTime;

      // 1. Soft, bubbly acoustic pop
      const popOsc = this.ctx.createOscillator();
      const popGain = this.ctx.createGain();
      popOsc.type = 'sine';
      popOsc.frequency.setValueAtTime(360, now);
      popOsc.frequency.exponentialRampToValueAtTime(820, now + 0.035);
      popOsc.frequency.exponentialRampToValueAtTime(440, now + 0.08);

      popGain.gain.setValueAtTime(0.001, now);
      popGain.gain.exponentialRampToValueAtTime(0.09, now + 0.015);
      popGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      popOsc.connect(popGain);
      popGain.connect(this.gainNode);
      popOsc.start(now);
      popOsc.stop(now + 0.13);

      // 2. Sweet sparkling harmonic chime overlay (A5 -> C6 chime)
      const chimeOsc = this.ctx.createOscillator();
      const chimeGain = this.ctx.createGain();
      chimeOsc.type = 'sine';
      chimeOsc.frequency.setValueAtTime(880, now + 0.015);
      chimeOsc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.05);

      chimeGain.gain.setValueAtTime(0.0001, now);
      chimeGain.gain.exponentialRampToValueAtTime(0.06, now + 0.03);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

      chimeOsc.connect(chimeGain);
      chimeGain.connect(this.gainNode);
      chimeOsc.start(now + 0.015);
      chimeOsc.stop(now + 0.52);
    } catch {
      // Audio autoplay policy guard
    }
  }

  public playHeartChime(force = true) {
    this.playHeartPop(force);
  }
}

export const soundEngine = new AmbientSoundEngine();
