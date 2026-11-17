/**
 * SoundEngine - Pure Web Audio API Synthesizer for Mechanical Keyboard Feedback & Ben 10 Omnitrix SFX.
 * Zero external audio files required, guarantees zero latency and 100% offline reliability.
 * Supports: Ben 10 Omnitrix, Mechanical Clicky (Blue), Thock (Brown/Linear), Typewriter, Pop, Error buzzer.
 */
export class SoundEngine {
  constructor() {
    this.audioCtx = null;
    this.soundType = 'omnitrix'; // 'omnitrix' | 'clicky' | 'thock' | 'typewriter' | 'pop' | 'none'
    this.volume = 0.40;
    this.isMuted = false;

    // Iconic Ben 10 aliens and catchphrases for voice synthesis
    this.alienNames = [
      "It's Hero Time!",
      "Heatblast!",
      "Diamondhead!",
      "Four Arms!",
      "XLR8!",
      "Upgrade!",
      "Cannonbolt!",
      "Ripjaws!",
      "Wildmutt!",
      "Grey Matter!",
      "Alien DNA Synchronized!"
    ];
  }

  /**
   * Initializes AudioContext on first user interaction (browser policy compliance).
   */
  initContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  setSoundType(type) {
    this.soundType = type;
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  /**
   * Plays keystroke sound based on selected profile.
   * @param {boolean} isCorrect Whether the key typed was correct
   * @param {string} key The key that was typed
   */
  playKey(isCorrect = true, key = '') {
    if (this.isMuted || this.soundType === 'none') return;
    this.initContext();
    if (!this.audioCtx) return;

    if (!isCorrect) {
      if (this.soundType === 'omnitrix') {
        this.playOmnitrixTimeout();
      } else {
        this.playErrorSound();
      }
      return;
    }

    // Space key has a deeper, heavier acoustic profile
    const isSpace = key === ' ';

    switch (this.soundType) {
      case 'omnitrix':
        this.playOmnitrixDial(isSpace);
        break;
      case 'thock':
        this.playThock(isSpace);
        break;
      case 'typewriter':
        this.playTypewriter(isSpace);
        break;
      case 'pop':
        this.playPop(isSpace);
        break;
      case 'clicky':
      default:
        this.playClicky(isSpace);
        break;
    }
  }

  /**
   * Ben 10 Omnitrix Dial rotation sound (and Core Slam on spacebar).
   */
  playOmnitrixDial(isSpace = false) {
    if (isSpace) {
      this.playOmnitrixSlam();
      return;
    }

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    // Dual-tone digital sci-fi alien dial click
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();

    // Randomize pitch across alien selections (e.g. 987Hz to 1760Hz)
    const alienFreqs = [987.77, 1046.50, 1174.66, 1318.51, 1396.91, 1567.98, 1760.00];
    const baseFreq = alienFreqs[Math.floor(Math.random() * alienFreqs.length)];

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(baseFreq, now);
    osc1.frequency.exponentialRampToValueAtTime(baseFreq * 1.35, now + 0.015);
    osc1.frequency.exponentialRampToValueAtTime(baseFreq * 0.7, now + 0.035);

    osc2.type = 'square';
    osc2.frequency.setValueAtTime(baseFreq * 2, now);
    osc2.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, now + 0.025);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(baseFreq * 1.2, now);
    filter.Q.setValueAtTime(6.0, now);

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.75, now);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(masterGain);
    masterGain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.045);
    osc2.stop(now + 0.045);
  }

  /**
   * Ben 10 Omnitrix Core Slam-down sound (when Ben slams the faceplate to transform).
   */
  playOmnitrixSlam() {
    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    // 1. Heavy mechanical thud (sub impact)
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(110, now);
    subOsc.frequency.exponentialRampToValueAtTime(40, now + 0.08);
    subGain.gain.setValueAtTime(this.volume * 1.1, now);
    subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 0.095);

    // 2. High-tech clamp / green energy snap
    const snapOsc = ctx.createOscillator();
    const snapGain = ctx.createGain();
    const snapFilter = ctx.createBiquadFilter();

    snapOsc.type = 'sawtooth';
    snapOsc.frequency.setValueAtTime(1400, now);
    snapOsc.frequency.exponentialRampToValueAtTime(320, now + 0.05);

    snapFilter.type = 'lowpass';
    snapFilter.frequency.setValueAtTime(2200, now);

    snapGain.gain.setValueAtTime(this.volume * 0.9, now);
    snapGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

    snapOsc.connect(snapFilter);
    snapFilter.connect(snapGain);
    snapGain.connect(ctx.destination);

    snapOsc.start(now);
    snapOsc.stop(now + 0.075);

    // 3. Resonant Omnitrix ring surge
    const ringOsc = ctx.createOscillator();
    const ringGain = ctx.createGain();
    ringOsc.type = 'sine';
    ringOsc.frequency.setValueAtTime(1760, now + 0.01);
    ringOsc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
    ringGain.gain.setValueAtTime(this.volume * 0.45, now + 0.01);
    ringGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
    ringOsc.connect(ringGain);
    ringGain.connect(ctx.destination);
    ringOsc.start(now + 0.01);
    ringOsc.stop(now + 0.15);
  }

  /**
   * Ben 10 Omnitrix Core Pop-up activation sound (when session starts).
   */
  playOmnitrixPopup() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    // Rapid 3-tier electronic pop-up harmonics
    const tones = [587.33, 880.00, 1760.00]; // D5, A5, A6
    tones.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = now + (idx * 0.045);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq * 0.8, startTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.15, startTime + 0.04);

      gain.gain.setValueAtTime(this.volume * 0.75, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.1);
    });

    // High sci-fi rising laser shimmer
    const laser = ctx.createOscillator();
    const laserGain = ctx.createGain();
    laser.type = 'sine';
    laser.frequency.setValueAtTime(400, now);
    laser.frequency.exponentialRampToValueAtTime(2400, now + 0.22);
    laserGain.gain.setValueAtTime(this.volume * 0.5, now);
    laserGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);
    laser.connect(laserGain);
    laserGain.connect(ctx.destination);
    laser.start(now);
    laser.stop(now + 0.25);
  }

  /**
   * Ben 10 Omnitrix Timeout / Warning Red Beep (on mistype or error).
   */
  playOmnitrixTimeout() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    // Rapid alien timeout double-tone pulse
    [0, 0.065].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = now + offset;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(620, t);
      osc.frequency.setValueAtTime(880, t + 0.025);

      gain.gain.setValueAtTime(this.volume * 0.65, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.055);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.06);
    });
  }

  /**
   * Full Ben 10 Omnitrix Alien Transformation Sound Effect!
   * Green flash charge-up laser, sonic burst, alien chord, and "It's Hero Time!" announcement.
   */
  playOmnitrixTransform() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    // 1. Rising alien power surge sweep
    const sweep = ctx.createOscillator();
    const sweepGain = ctx.createGain();
    sweep.type = 'sawtooth';
    sweep.frequency.setValueAtTime(150, now);
    sweep.frequency.exponentialRampToValueAtTime(2800, now + 0.45);

    const sweepFilter = ctx.createBiquadFilter();
    sweepFilter.type = 'lowpass';
    sweepFilter.frequency.setValueAtTime(400, now);
    sweepFilter.frequency.exponentialRampToValueAtTime(3500, now + 0.45);

    sweepGain.gain.setValueAtTime(this.volume * 0.6, now);
    sweepGain.gain.exponentialRampToValueAtTime(this.volume * 0.9, now + 0.4);
    sweepGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

    sweep.connect(sweepFilter);
    sweepFilter.connect(sweepGain);
    sweepGain.connect(ctx.destination);

    sweep.start(now);
    sweep.stop(now + 0.56);

    // 2. The Green Flash Sonic Burst (at peak t = now + 0.45)
    setTimeout(() => {
      if (!this.audioCtx) return;
      const burstTime = this.audioCtx.currentTime;

      // Heavy sub-bass transformation thud
      const sub = this.audioCtx.createOscillator();
      const subGain = this.audioCtx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(90, burstTime);
      sub.frequency.exponentialRampToValueAtTime(35, burstTime + 0.35);
      subGain.gain.setValueAtTime(this.volume * 1.2, burstTime);
      subGain.gain.exponentialRampToValueAtTime(0.0001, burstTime + 0.4);
      sub.connect(subGain);
      subGain.connect(this.audioCtx.destination);
      sub.start(burstTime);
      sub.stop(burstTime + 0.42);

      // Alien Triumph Chimes (C-Major sci-fi chord)
      const chord = [523.25, 659.25, 783.99, 1046.50];
      chord.forEach((freq, idx) => {
        const cOsc = this.audioCtx.createOscillator();
        const cGain = this.audioCtx.createGain();
        cOsc.type = 'triangle';
        cOsc.frequency.setValueAtTime(freq, burstTime + (idx * 0.04));
        cGain.gain.setValueAtTime(this.volume * 0.7, burstTime + (idx * 0.04));
        cGain.gain.exponentialRampToValueAtTime(0.0001, burstTime + 0.6 + (idx * 0.05));
        cOsc.connect(cGain);
        cGain.connect(this.audioCtx.destination);
        cOsc.start(burstTime + (idx * 0.04));
        cOsc.stop(burstTime + 0.7);
      });

      // Voice Line Announcement ("It's Hero Time!" or Alien callout)
      this.speakHeroVoice();
    }, 450);
  }

  /**
   * Ben 10 Hero Voice line synthesizer.
   */
  speakHeroVoice() {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const phrase = this.alienNames[Math.floor(Math.random() * this.alienNames.length)];
      const utter = new SpeechSynthesisUtterance(phrase);
      utter.rate = 1.15;
      utter.pitch = 1.25; // energetic young hero pitch
      utter.volume = Math.min(1.0, this.volume * 2.2);
      window.speechSynthesis.speak(utter);
    } catch (e) {
      console.warn('SpeechSynthesis error:', e);
    }
  }
      default:
        this.playClicky(isSpace);
        break;
    }
  }

  /**
   * Cherry MX Blue style sharp tactile click.
   */
  playClicky(isSpace = false) {
    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    // High snap click
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    const baseFreq = isSpace ? 1800 : 2600 + (Math.random() * 400 - 200);
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.02);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(isSpace ? 2200 : 3500, now);
    filter.Q.setValueAtTime(3, now);

    gain.gain.setValueAtTime(this.volume * (isSpace ? 0.9 : 0.7), now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);

    // Subtle bottom-out thump
    this.playBottomOut(isSpace ? 110 : 160, 0.05, 0.5);
  }

  /**
   * Deep, lubricated mechanical switch "Thock" sound (Holy Panda / Gateron Ink Black).
   */
  playThock(isSpace = false) {
    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    // Resonant low-mid body
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    const baseFreq = isSpace ? 140 : 220 + (Math.random() * 30 - 15);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.045);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(isSpace ? 600 : 850, now);

    gain.gain.setValueAtTime(this.volume * 0.95, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.055);

    // Deep housing clack
    this.playNoiseBurst(isSpace ? 700 : 1200, 0.025, 0.4);
  }

  /**
   * Vintage mechanical typewriter strike.
   */
  playTypewriter(isSpace = false) {
    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    // Metal hammer strike click
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(isSpace ? 800 : 1400 + (Math.random() * 200), now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.03);

    gain.gain.setValueAtTime(this.volume * 0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.045);

    this.playNoiseBurst(isSpace ? 900 : 2000, 0.04, 0.6);
  }

  /**
   * Soft, modern bubble pop sound.
   */
  playPop(isSpace = false) {
    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const baseFreq = isSpace ? 350 : 520 + (Math.random() * 80 - 40);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.8, now + 0.025);

    gain.gain.setValueAtTime(this.volume * 0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.045);
  }

  /**
   * Soft error bump tone.
   */
  playErrorSound() {
    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.linearRampToValueAtTime(110, now + 0.08);

    gain.gain.setValueAtTime(this.volume * 0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  /**
   * Helper: bottom-out acoustic simulation.
   */
  playBottomOut(freq, duration, relativeVol) {
    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + duration);

    gain.gain.setValueAtTime(this.volume * relativeVol, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.01);
  }

  /**
   * Helper: shaped noise burst for tactile switch textures.
   */
  playNoiseBurst(cutoffFreq, duration, relativeVol) {
    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(cutoffFreq, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(this.volume * relativeVol, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    whiteNoise.start(now);
    whiteNoise.stop(now + duration);
  }
}
