/**
 * TypePro - Professional Touch Typing Tutor (Standalone Bundle)
 * Self-contained, zero-dependency, works 100% offline via file:// protocol and http://.
 * Includes complete TypingEngine, Web Audio Synthesizer with Ben 10 Omnitrix SFX,
 * Virtual ANSI Keyboard, SVG Hand Guides, 6-Stage Curriculum, and Analytics.
 */

(function () {
  'use strict';

  // ==========================================
  // 1. SOUND ENGINE (Pure Web Audio API)
  // ==========================================
  class SoundEngine {
    constructor() {
      this.audioCtx = null;
      this.soundType = 'omnitrix'; // 'omnitrix' | 'clicky' | 'thock' | 'typewriter' | 'pop' | 'none'
      this.volume = 0.40;
      this.isMuted = false;

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

    playOmnitrixDial(isSpace = false) {
      if (isSpace) {
        this.playOmnitrixSlam();
        return;
      }

      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();

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

    playOmnitrixSlam() {
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

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

    playOmnitrixPopup() {
      if (this.isMuted) return;
      this.initContext();
      if (!this.audioCtx) return;

      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      const tones = [587.33, 880.00, 1760.00];
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
    }

    playOmnitrixTimeout() {
      if (this.isMuted) return;
      this.initContext();
      if (!this.audioCtx) return;

      const ctx = this.audioCtx;
      const now = ctx.currentTime;

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

    playOmnitrixTransform() {
      if (this.isMuted) return;
      this.initContext();
      if (!this.audioCtx) return;

      const ctx = this.audioCtx;
      const now = ctx.currentTime;

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

      setTimeout(() => {
        if (!this.audioCtx) return;
        const burstTime = this.audioCtx.currentTime;

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

        this.speakHeroVoice();
      }, 450);
    }

    speakHeroVoice() {
      if (!('speechSynthesis' in window)) return;
      try {
        window.speechSynthesis.cancel();
        const phrase = this.alienNames[Math.floor(Math.random() * this.alienNames.length)];
        const utter = new SpeechSynthesisUtterance(phrase);
        utter.rate = 1.15;
        utter.pitch = 1.25;
        utter.volume = Math.min(1.0, this.volume * 2.2);
        window.speechSynthesis.speak(utter);
      } catch (e) {
        console.warn('SpeechSynthesis error:', e);
      }
    }

    playClicky(isSpace = false) {
      const ctx = this.audioCtx;
      const now = ctx.currentTime;
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
    }

    playThock(isSpace = false) {
      const ctx = this.audioCtx;
      const now = ctx.currentTime;
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
    }

    playTypewriter(isSpace = false) {
      const ctx = this.audioCtx;
      const now = ctx.currentTime;
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
    }

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
  }

  // ==========================================
  // 2. TYPING ENGINE
  // ==========================================
  class TypingEngine {
    constructor(options = {}) {
      this.options = {
        mode: 'lesson',
        timeLimit: 60,
        wordLimit: 50,
        strictMode: false,
        allowBackspace: true,
        ...options
      };

      this.status = 'idle';
      this.targetText = '';
      this.targetChars = [];
      this.currentIndex = 0;
      this.keystrokes = [];
      this.userInputs = [];
      this.errors = [];
      this.startTime = null;
      this.endTime = null;
      this.lastKeystrokeTime = null;
      this.timerInterval = null;
      this.wpmSamples = [];
      this.keyStats = {};

      this.onStart = options.onStart || null;
      this.onKeystroke = options.onKeystroke || null;
      this.onTick = options.onTick || null;
      this.onComplete = options.onComplete || null;
    }

    setText(text, customOptions = {}) {
      this.reset();
      if (customOptions) {
        this.options = { ...this.options, ...customOptions };
      }
      this.targetText = text.replace(/\r\n/g, '\n').trim();
      this.targetChars = Array.from(this.targetText);
      this.userInputs = new Array(this.targetChars.length).fill(null);
      return this;
    }

    reset() {
      this.stopTimer();
      this.status = 'idle';
      this.currentIndex = 0;
      this.keystrokes = [];
      this.userInputs = [];
      this.errors = [];
      this.startTime = null;
      this.endTime = null;
      this.lastKeystrokeTime = null;
      this.wpmSamples = [];
      this.keyStats = {};
    }

    start() {
      if (this.status === 'running') return;
      this.status = 'running';
      this.startTime = performance.now();
      this.lastKeystrokeTime = this.startTime;

      this.timerInterval = setInterval(() => {
        this.handleTick();
      }, 250);

      if (typeof this.onStart === 'function') {
        this.onStart(this.getMetrics());
      }
    }

    handleTick() {
      if (this.status !== 'running') return;
      const metrics = this.getMetrics();
      const elapsedSec = metrics.elapsedSeconds;
      const lastSampleSec = this.wpmSamples.length > 0 ? this.wpmSamples[this.wpmSamples.length - 1].time : -1;
      if (elapsedSec - lastSampleSec >= 1.0) {
        this.wpmSamples.push({
          time: Math.round(elapsedSec),
          wpm: metrics.wpm,
          rawWpm: metrics.rawWpm,
          accuracy: metrics.accuracy
        });
      }

      if (this.options.mode === 'timed' && elapsedSec >= this.options.timeLimit) {
        this.finish();
        return;
      }

      if (typeof this.onTick === 'function') {
        this.onTick(metrics);
      }
    }

    handleKey(key) {
      if (this.status === 'completed') return null;

      if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab', 'Escape'].includes(key)) {
        return null;
      }

      if (this.status === 'idle') {
        this.start();
      }

      const now = performance.now();
      const latency = this.lastKeystrokeTime ? Math.max(0, now - this.lastKeystrokeTime) : 0;
      this.lastKeystrokeTime = now;

      if (key === 'Backspace') {
        return this.handleBackspace();
      }

      if (this.currentIndex >= this.targetChars.length) {
        return null;
      }

      const expectedChar = this.targetChars[this.currentIndex];
      const isCorrect = key === expectedChar;

      const targetKeyNorm = expectedChar.toLowerCase();
      if (!this.keyStats[targetKeyNorm]) {
        this.keyStats[targetKeyNorm] = { attempts: 0, hits: 0, errors: 0, totalLatency: 0 };
      }
      this.keyStats[targetKeyNorm].attempts++;
      this.keyStats[targetKeyNorm].totalLatency += latency;

      if (isCorrect) {
        this.keyStats[targetKeyNorm].hits++;
      } else {
        this.keyStats[targetKeyNorm].errors++;
        this.errors.push({
          index: this.currentIndex,
          expected: expectedChar,
          actual: key,
          timestamp: now
        });
      }

      const keystroke = {
        index: this.currentIndex,
        key,
        expected: expectedChar,
        correct: isCorrect,
        timestamp: now,
        latency
      };
      this.keystrokes.push(keystroke);

      this.userInputs[this.currentIndex] = {
        char: key,
        expected: expectedChar,
        correct: isCorrect
      };

      this.currentIndex++;
      const isFinished = this.checkCompletion();
      const metrics = this.getMetrics();

      if (typeof this.onKeystroke === 'function') {
        this.onKeystroke({
          keystroke,
          currentIndex: this.currentIndex,
          expectedNext: this.getCurrentTarget(),
          metrics,
          isFinished
        });
      }

      if (isFinished) {
        this.finish();
      }

      return { keystroke, metrics, isFinished };
    }

    handleBackspace() {
      if (!this.options.allowBackspace || this.currentIndex === 0) {
        return null;
      }

      this.currentIndex--;
      const previousEntry = this.userInputs[this.currentIndex];
      this.userInputs[this.currentIndex] = null;
      const metrics = this.getMetrics();

      if (typeof this.onKeystroke === 'function') {
        this.onKeystroke({
          keystroke: { key: 'Backspace', correct: true, index: this.currentIndex },
          currentIndex: this.currentIndex,
          expectedNext: this.getCurrentTarget(),
          metrics,
          isFinished: false
        });
      }

      return {
        backspaced: true,
        clearedEntry: previousEntry,
        currentIndex: this.currentIndex,
        metrics
      };
    }

    checkCompletion() {
      if (['lesson', 'words', 'custom', 'code'].includes(this.options.mode)) {
        return this.currentIndex >= this.targetChars.length;
      }
      return false;
    }

    finish() {
      if (this.status === 'completed') return this.getMetrics();
      this.status = 'completed';
      this.endTime = performance.now();
      this.stopTimer();

      const metrics = this.getMetrics();
      this.wpmSamples.push({
        time: Math.round(metrics.elapsedSeconds),
        wpm: metrics.wpm,
        rawWpm: metrics.rawWpm,
        accuracy: metrics.accuracy
      });

      if (typeof this.onComplete === 'function') {
        this.onComplete(metrics);
      }

      return metrics;
    }

    stopTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    }

    getCurrentTarget() {
      if (this.currentIndex < this.targetChars.length) {
        return this.targetChars[this.currentIndex];
      }
      return null;
    }

    getMetrics() {
      const now = this.endTime || performance.now();
      const elapsedMs = this.startTime ? Math.max(1, now - this.startTime) : 1;
      const elapsedSeconds = elapsedMs / 1000;
      const elapsedMinutes = elapsedSeconds / 60;

      let correctChars = 0;
      let incorrectChars = 0;
      let totalKeystrokes = this.keystrokes.length;

      for (const stroke of this.keystrokes) {
        if (stroke.key !== 'Backspace') {
          if (stroke.correct) {
            correctChars++;
          } else {
            incorrectChars++;
          }
        }
      }

      const rawWpm = elapsedMinutes > 0 ? (totalKeystrokes / 5) / elapsedMinutes : 0;
      const netWpm = elapsedMinutes > 0 ? (correctChars / 5) / elapsedMinutes : 0;
      const cpm = elapsedMinutes > 0 ? correctChars / elapsedMinutes : 0;

      const nonBackspaceStrokes = correctChars + incorrectChars;
      const accuracy = nonBackspaceStrokes > 0 ? (correctChars / nonBackspaceStrokes) * 100 : 100;

      const consistency = this.calculateConsistency();
      const tier = this.getTier(netWpm);

      return {
        wpm: Math.max(0, Math.round(netWpm)),
        rawWpm: Math.max(0, Math.round(rawWpm)),
        netWpm: Number(netWpm.toFixed(1)),
        cpm: Math.round(cpm),
        accuracy: Number(accuracy.toFixed(1)),
        consistency: Math.round(consistency),
        elapsedSeconds: Number(elapsedSeconds.toFixed(1)),
        correctChars,
        incorrectChars,
        totalKeystrokes,
        currentIndex: this.currentIndex,
        totalLength: this.targetChars.length,
        progressPercent: this.targetChars.length > 0 ? Math.min(100, (this.currentIndex / this.targetChars.length) * 100) : 0,
        tier,
        weakKeys: this.getWeakKeys(5),
        keyHeatmap: this.getKeyHeatmap()
      };
    }

    calculateConsistency() {
      const latencies = this.keystrokes
        .filter(k => k.key !== 'Backspace' && k.latency > 0 && k.latency < 2000)
        .map(k => k.latency);

      if (latencies.length < 5) return 100;

      const mean = latencies.reduce((a, b) => a + b, 0) / latencies.length;
      const variance = latencies.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / latencies.length;
      const stdDev = Math.sqrt(variance);

      const cv = stdDev / mean;
      return Math.max(0, Math.min(100, Math.round(100 - (cv * 35))));
    }

    getTier(wpm) {
      if (wpm >= 120) return { title: 'Godlike Speedster', stars: 5, color: '#f59e0b', badge: '⚡⚡⚡' };
      if (wpm >= 100) return { title: 'Master Typist', stars: 5, color: '#ec4899', badge: '🏆 Ninja' };
      if (wpm >= 80)  return { title: 'Professional Typist', stars: 4, color: '#8b5cf6', badge: '🚀 Pro' };
      if (wpm >= 60)  return { title: 'Fluent Touch Typist', stars: 3, color: '#3b82f6', badge: '✨ Fluent' };
      if (wpm >= 40)  return { title: 'Intermediate Typist', stars: 2, color: '#10b981', badge: '👍 Good' };
      if (wpm >= 20)  return { title: 'Developing Typist', stars: 1, color: '#06b6d4', badge: '🌱 Learner' };
      return { title: 'Novice Typist', stars: 1, color: '#94a3b8', badge: '🐣 Beginner' };
    }

    getWeakKeys(limit = 5) {
      const list = [];
      for (const [key, data] of Object.entries(this.keyStats)) {
        if (data.attempts < 1) continue;
        const errorRate = data.errors / data.attempts;
        const avgLatency = data.totalLatency / data.attempts;
        const penaltyScore = (errorRate * 70) + (Math.min(avgLatency / 1000, 1) * 30);

        list.push({
          key,
          attempts: data.attempts,
          errors: data.errors,
          accuracy: Math.round(((data.attempts - data.errors) / data.attempts) * 100),
          avgLatencyMs: Math.round(avgLatency),
          penaltyScore
        });
      }

      list.sort((a, b) => b.penaltyScore - a.penaltyScore);
      return list.slice(0, limit);
    }

    getKeyHeatmap() {
      const map = {};
      for (const [key, data] of Object.entries(this.keyStats)) {
        const errorRate = data.attempts > 0 ? (data.errors / data.attempts) : 0;
        map[key] = {
          key,
          attempts: data.attempts,
          errors: data.errors,
          errorRate,
          intensity: Math.min(1.0, errorRate * 1.5)
        };
      }
      return map;
    }

    static generateWeakKeyDrill(weakKeyList, wordCount = 20) {
      if (!weakKeyList || weakKeyList.length === 0) {
        weakKeyList = ['e', 't', 'a', 'o', 'i', 'n'];
      }
      const anchors = ['a', 'e', 'i', 'o', 'u', 's', 't', 'r', 'l'];
      const drills = [];
      for (let i = 0; i < wordCount; i++) {
        const target = weakKeyList[i % weakKeyList.length];
        const a1 = anchors[Math.floor(Math.random() * anchors.length)];
        const a2 = anchors[Math.floor(Math.random() * anchors.length)];
        drills.push(`${target}${a1}${target} ${a1}${target}${a2}`);
      }
      return drills.join(' ');
    }
  }

  // ==========================================
  // 3. KEYBOARD & ANATOMICAL FINGER MAPPING
  // ==========================================
  const FINGER_COLORS = {
    'left-pinky': '#ec4899',
    'left-ring': '#8b5cf6',
    'left-middle': '#3b82f6',
    'left-index': '#06b6d4',
    'thumb': '#10b981',
    'right-index': '#eab308',
    'right-middle': '#f97316',
    'right-ring': '#ef4444',
    'right-pinky': '#d946ef'
  };

  const KEY_MAP = {
    '`': { code: 'Backquote', label: '`', shift: '~', finger: 'left-pinky', hand: 'left', fingerName: 'Left Pinky' },
    '~': { code: 'Backquote', label: '`', shift: '~', finger: 'left-pinky', hand: 'left', fingerName: 'Left Pinky', needsShift: true, shiftKey: 'ShiftRight' },
    '1': { code: 'Digit1', label: '1', shift: '!', finger: 'left-pinky', hand: 'left', fingerName: 'Left Pinky' },
    '!': { code: 'Digit1', label: '1', shift: '!', finger: 'left-pinky', hand: 'left', fingerName: 'Left Pinky', needsShift: true, shiftKey: 'ShiftRight' },
    '2': { code: 'Digit2', label: '2', shift: '@', finger: 'left-ring', hand: 'left', fingerName: 'Left Ring' },
    '@': { code: 'Digit2', label: '2', shift: '@', finger: 'left-ring', hand: 'left', fingerName: 'Left Ring', needsShift: true, shiftKey: 'ShiftRight' },
    '3': { code: 'Digit3', label: '3', shift: '#', finger: 'left-middle', hand: 'left', fingerName: 'Left Middle' },
    '#': { code: 'Digit3', label: '3', shift: '#', finger: 'left-middle', hand: 'left', fingerName: 'Left Middle', needsShift: true, shiftKey: 'ShiftRight' },
    '4': { code: 'Digit4', label: '4', shift: '$', finger: 'left-index', hand: 'left', fingerName: 'Left Index' },
    '$': { code: 'Digit4', label: '4', shift: '$', finger: 'left-index', hand: 'left', fingerName: 'Left Index', needsShift: true, shiftKey: 'ShiftRight' },
    '5': { code: 'Digit5', label: '5', shift: '%', finger: 'left-index', hand: 'left', fingerName: 'Left Index' },
    '%': { code: 'Digit5', label: '5', shift: '%', finger: 'left-index', hand: 'left', fingerName: 'Left Index', needsShift: true, shiftKey: 'ShiftRight' },
    '6': { code: 'Digit6', label: '6', shift: '^', finger: 'right-index', hand: 'right', fingerName: 'Right Index' },
    '^': { code: 'Digit6', label: '6', shift: '^', finger: 'right-index', hand: 'right', fingerName: 'Right Index', needsShift: true, shiftKey: 'ShiftLeft' },
    '7': { code: 'Digit7', label: '7', shift: '&', finger: 'right-index', hand: 'right', fingerName: 'Right Index' },
    '&': { code: 'Digit7', label: '7', shift: '&', finger: 'right-index', hand: 'right', fingerName: 'Right Index', needsShift: true, shiftKey: 'ShiftLeft' },
    '8': { code: 'Digit8', label: '8', shift: '*', finger: 'right-middle', hand: 'right', fingerName: 'Right Middle' },
    '*': { code: 'Digit8', label: '8', shift: '*', finger: 'right-middle', hand: 'right', fingerName: 'Right Middle', needsShift: true, shiftKey: 'ShiftLeft' },
    '9': { code: 'Digit9', label: '9', shift: '(', finger: 'right-ring', hand: 'right', fingerName: 'Right Ring' },
    '(': { code: 'Digit9', label: '9', shift: '(', finger: 'right-ring', hand: 'right', fingerName: 'Right Ring', needsShift: true, shiftKey: 'ShiftLeft' },
    '0': { code: 'Digit0', label: '0', shift: ')', finger: 'right-pinky', hand: 'right', fingerName: 'Right Pinky' },
    ')': { code: 'Digit0', label: '0', shift: ')', finger: 'right-pinky', hand: 'right', fingerName: 'Right Pinky', needsShift: true, shiftKey: 'ShiftLeft' },
    '-': { code: 'Minus', label: '-', shift: '_', finger: 'right-pinky', hand: 'right', fingerName: 'Right Pinky' },
    '_': { code: 'Minus', label: '-', shift: '_', finger: 'right-pinky', hand: 'right', fingerName: 'Right Pinky', needsShift: true, shiftKey: 'ShiftLeft' },
    '=': { code: 'Equal', label: '=', shift: '+', finger: 'right-pinky', hand: 'right', fingerName: 'Right Pinky' },
    '+': { code: 'Equal', label: '=', shift: '+', finger: 'right-pinky', hand: 'right', fingerName: 'Right Pinky', needsShift: true, shiftKey: 'ShiftLeft' },

    'q': { code: 'KeyQ', label: 'Q', finger: 'left-pinky', hand: 'left', fingerName: 'Left Pinky' },
    'Q': { code: 'KeyQ', label: 'Q', finger: 'left-pinky', hand: 'left', fingerName: 'Left Pinky', needsShift: true, shiftKey: 'ShiftRight' },
    'w': { code: 'KeyW', label: 'W', finger: 'left-ring', hand: 'left', fingerName: 'Left Ring' },
    'W': { code: 'KeyW', label: 'W', finger: 'left-ring', hand: 'left', fingerName: 'Left Ring', needsShift: true, shiftKey: 'ShiftRight' },
    'e': { code: 'KeyE', label: 'E', finger: 'left-middle', hand: 'left', fingerName: 'Left Middle' },
    'E': { code: 'KeyE', label: 'E', finger: 'left-middle', hand: 'left', fingerName: 'Left Middle', needsShift: true, shiftKey: 'ShiftRight' },
    'r': { code: 'KeyR', label: 'R', finger: 'left-index', hand: 'left', fingerName: 'Left Index' },
    'R': { code: 'KeyR', label: 'R', finger: 'left-index', hand: 'left', fingerName: 'Left Index', needsShift: true, shiftKey: 'ShiftRight' },
    't': { code: 'KeyT', label: 'T', finger: 'left-index', hand: 'left', fingerName: 'Left Index' },
    'T': { code: 'KeyT', label: 'T', finger: 'left-index', hand: 'left', fingerName: 'Left Index', needsShift: true, shiftKey: 'ShiftRight' },
    'y': { code: 'KeyY', label: 'Y', finger: 'right-index', hand: 'right', fingerName: 'Right Index' },
    'Y': { code: 'KeyY', label: 'Y', finger: 'right-index', hand: 'right', fingerName: 'Right Index', needsShift: true, shiftKey: 'ShiftLeft' },
    'u': { code: 'KeyU', label: 'U', finger: 'right-index', hand: 'right', fingerName: 'Right Index' },
    'U': { code: 'KeyU', label: 'U', finger: 'right-index', hand: 'right', fingerName: 'Right Index', needsShift: true, shiftKey: 'ShiftLeft' },
    'i': { code: 'KeyI', label: 'I', finger: 'right-middle', hand: 'right', fingerName: 'Right Middle' },
    'I': { code: 'KeyI', label: 'I', finger: 'right-middle', hand: 'right', fingerName: 'Right Middle', needsShift: true, shiftKey: 'ShiftLeft' },
    'o': { code: 'KeyO', label: 'O', finger: 'right-ring', hand: 'right', fingerName: 'Right Ring' },
    'O': { code: 'KeyO', label: 'O', finger: 'right-ring', hand: 'right', fingerName: 'Right Ring', needsShift: true, shiftKey: 'ShiftLeft' },
    'p': { code: 'KeyP', label: 'P', finger: 'right-pinky', hand: 'right', fingerName: 'Right Pinky' },
    'P': { code: 'KeyP', label: 'P', finger: 'right-pinky', hand: 'right', fingerName: 'Right Pinky', needsShift: true, shiftKey: 'ShiftLeft' },
    '[': { code: 'BracketLeft', label: '[', shift: '{', finger: 'right-pinky', hand: 'right', fingerName: 'Right Pinky' },
    '{': { code: 'BracketLeft', label: '[', shift: '{', finger: 'right-pinky', hand: 'right', fingerName: 'Right Pinky', needsShift: true, shiftKey: 'ShiftLeft' },
    ']': { code: 'BracketRight', label: ']', shift: '}', finger: 'right-pinky', hand: 'right', fingerName: 'Right Pinky' },
    '}': { code: 'BracketRight', label: ']', shift: '}', finger: 'right-pinky', hand: 'right', fingerName: 'Right Pinky', needsShift: true, shiftKey: 'ShiftLeft' },

    'a': { code: 'KeyA', label: 'A', finger: 'left-pinky', hand: 'left', fingerName: 'Left Pinky' },
    'A': { code: 'KeyA', label: 'A', finger: 'left-pinky', hand: 'left', fingerName: 'Left Pinky', needsShift: true, shiftKey: 'ShiftRight' },
    's': { code: 'KeyS', label: 'S', finger: 'left-ring', hand: 'left', fingerName: 'Left Ring' },
    'S': { code: 'KeyS', label: 'S', finger: 'left-ring', hand: 'left', fingerName: 'Left Ring', needsShift: true, shiftKey: 'ShiftRight' },
    'd': { code: 'KeyD', label: 'D', finger: 'left-middle', hand: 'left', fingerName: 'Left Middle' },
    'D': { code: 'KeyD', label: 'D', finger: 'left-middle', hand: 'left', fingerName: 'Left Middle', needsShift: true, shiftKey: 'ShiftRight' },
    'f': { code: 'KeyF', label: 'F', finger: 'left-index', hand: 'left', fingerName: 'Left Index', isHomeBump: true },
    'F': { code: 'KeyF', label: 'F', finger: 'left-index', hand: 'left', fingerName: 'Left Index', isHomeBump: true, needsShift: true, shiftKey: 'ShiftRight' },
    'g': { code: 'KeyG', label: 'G', finger: 'left-index', hand: 'left', fingerName: 'Left Index' },
    'G': { code: 'KeyG', label: 'G', finger: 'left-index', hand: 'left', fingerName: 'Left Index', needsShift: true, shiftKey: 'ShiftRight' },
    'h': { code: 'KeyH', label: 'H', finger: 'right-index', hand: 'right', fingerName: 'Right Index' },
    'H': { code: 'KeyH', label: 'H', finger: 'right-index', hand: 'right', fingerName: 'Right Index', needsShift: true, shiftKey: 'ShiftLeft' },
    'j': { code: 'KeyJ', label: 'J', finger: 'right-index', hand: 'right', fingerName: 'Right Index', isHomeBump: true },
    'J': { code: 'KeyJ', label: 'J', finger: 'right-index', hand: 'right', fingerName: 'Right Index', isHomeBump: true, needsShift: true, shiftKey: 'ShiftLeft' },
    'k': { code: 'KeyK', label: 'K', finger: 'right-middle', hand: 'right', fingerName: 'Right Middle' },
    'K': { code: 'KeyK', label: 'K', finger: 'right-middle', hand: 'right', fingerName: 'Right Middle', needsShift: true, shiftKey: 'ShiftLeft' },
    'l': { code: 'KeyL', label: 'L', finger: 'right-ring', hand: 'right', fingerName: 'Right Ring' },
    'L': { code: 'KeyL', label: 'L', finger: 'right-ring', hand: 'right', fingerName: 'Right Ring', needsShift: true, shiftKey: 'ShiftLeft' },
    ';': { code: 'Semicolon', label: ';', shift: ':', finger: 'right-pinky', hand: 'right', fingerName: 'Right Pinky' },
    ':': { code: 'Semicolon', label: ';', shift: ':', finger: 'right-pinky', hand: 'right', fingerName: 'Right Pinky', needsShift: true, shiftKey: 'ShiftLeft' },
    "'": { code: 'Quote', label: "'", shift: '"', finger: 'right-pinky', hand: 'right', fingerName: 'Right Pinky' },
    '"': { code: 'Quote', label: "'", shift: '"', finger: 'right-pinky', hand: 'right', fingerName: 'Right Pinky', needsShift: true, shiftKey: 'ShiftLeft' },

    'z': { code: 'KeyZ', label: 'Z', finger: 'left-pinky', hand: 'left', fingerName: 'Left Pinky' },
    'Z': { code: 'KeyZ', label: 'Z', finger: 'left-pinky', hand: 'left', fingerName: 'Left Pinky', needsShift: true, shiftKey: 'ShiftRight' },
    'x': { code: 'KeyX', label: 'X', finger: 'left-ring', hand: 'left', fingerName: 'Left Ring' },
    'X': { code: 'KeyX', label: 'X', finger: 'left-ring', hand: 'left', fingerName: 'Left Ring', needsShift: true, shiftKey: 'ShiftRight' },
    'c': { code: 'KeyC', label: 'C', finger: 'left-middle', hand: 'left', fingerName: 'Left Middle' },
    'C': { code: 'KeyC', label: 'C', finger: 'left-middle', hand: 'left', fingerName: 'Left Middle', needsShift: true, shiftKey: 'ShiftRight' },
    'v': { code: 'KeyV', label: 'V', finger: 'left-index', hand: 'left', fingerName: 'Left Index' },
    'V': { code: 'KeyV', label: 'V', finger: 'left-index', hand: 'left', fingerName: 'Left Index', needsShift: true, shiftKey: 'ShiftRight' },
    'b': { code: 'KeyB', label: 'B', finger: 'left-index', hand: 'left', fingerName: 'Left Index' },
    'B': { code: 'KeyB', label: 'B', finger: 'left-index', hand: 'left', fingerName: 'Left Index', needsShift: true, shiftKey: 'ShiftRight' },
    'n': { code: 'KeyN', label: 'N', finger: 'right-index', hand: 'right', fingerName: 'Right Index' },
    'N': { code: 'KeyN', label: 'N', finger: 'right-index', hand: 'right', fingerName: 'Right Index', needsShift: true, shiftKey: 'ShiftLeft' },
    'm': { code: 'KeyM', label: 'M', finger: 'right-index', hand: 'right', fingerName: 'Right Index' },
    'M': { code: 'KeyM', label: 'M', finger: 'right-index', hand: 'right', fingerName: 'Right Index', needsShift: true, shiftKey: 'ShiftLeft' },
    ',': { code: 'Comma', label: ',', shift: '<', finger: 'right-middle', hand: 'right', fingerName: 'Right Middle' },
    '<': { code: 'Comma', label: ',', shift: '<', finger: 'right-middle', hand: 'right', fingerName: 'Right Middle', needsShift: true, shiftKey: 'ShiftLeft' },
    '.': { code: 'Period', label: '.', shift: '>', finger: 'right-ring', hand: 'right', fingerName: 'Right Ring' },
    '>': { code: 'Period', label: '.', shift: '>', finger: 'right-ring', hand: 'right', fingerName: 'Right Ring', needsShift: true, shiftKey: 'ShiftLeft' },
    '/': { code: 'Slash', label: '/', shift: '?', finger: 'right-pinky', hand: 'right', fingerName: 'Right Pinky' },
    '?': { code: 'Slash', label: '/', shift: '?', finger: 'right-pinky', hand: 'right', fingerName: 'Right Pinky', needsShift: true, shiftKey: 'ShiftLeft' },

    ' ': { code: 'Space', label: 'Space', finger: 'thumb', hand: 'both', fingerName: 'Thumb' },
    '\n': { code: 'Enter', label: 'Enter ↵', finger: 'right-pinky', hand: 'right', fingerName: 'Right Pinky' }
  };

  const KEYBOARD_LAYOUT = [
    [
      { code: 'Backquote', label: '`', shift: '~', finger: 'left-pinky' },
      { code: 'Digit1', label: '1', shift: '!', finger: 'left-pinky' },
      { code: 'Digit2', label: '2', shift: '@', finger: 'left-ring' },
      { code: 'Digit3', label: '3', shift: '#', finger: 'left-middle' },
      { code: 'Digit4', label: '4', shift: '$', finger: 'left-index' },
      { code: 'Digit5', label: '5', shift: '%', finger: 'left-index' },
      { code: 'Digit6', label: '6', shift: '^', finger: 'right-index' },
      { code: 'Digit7', label: '7', shift: '&', finger: 'right-index' },
      { code: 'Digit8', label: '8', shift: '*', finger: 'right-middle' },
      { code: 'Digit9', label: '9', shift: '(', finger: 'right-ring' },
      { code: 'Digit0', label: '0', shift: ')', finger: 'right-pinky' },
      { code: 'Minus', label: '-', shift: '_', finger: 'right-pinky' },
      { code: 'Equal', label: '=', shift: '+', finger: 'right-pinky' },
      { code: 'Backspace', label: 'Backspace', width: 'w-backspace', finger: 'right-pinky' }
    ],
    [
      { code: 'Tab', label: 'Tab', width: 'w-tab', finger: 'left-pinky' },
      { code: 'KeyQ', label: 'Q', finger: 'left-pinky' },
      { code: 'KeyW', label: 'W', finger: 'left-ring' },
      { code: 'KeyE', label: 'E', finger: 'left-middle' },
      { code: 'KeyR', label: 'R', finger: 'left-index' },
      { code: 'KeyT', label: 'T', finger: 'left-index' },
      { code: 'KeyY', label: 'Y', finger: 'right-index' },
      { code: 'KeyU', label: 'U', finger: 'right-index' },
      { code: 'KeyI', label: 'I', finger: 'right-middle' },
      { code: 'KeyO', label: 'O', finger: 'right-ring' },
      { code: 'KeyP', label: 'P', finger: 'right-pinky' },
      { code: 'BracketLeft', label: '[', shift: '{', finger: 'right-pinky' },
      { code: 'BracketRight', label: ']', shift: '}', finger: 'right-pinky' },
      { code: 'Backslash', label: '\\', shift: '|', width: 'w-backslash', finger: 'right-pinky' }
    ],
    [
      { code: 'CapsLock', label: 'Caps Lock', width: 'w-caps', finger: 'left-pinky' },
      { code: 'KeyA', label: 'A', finger: 'left-pinky' },
      { code: 'KeyS', label: 'S', finger: 'left-ring' },
      { code: 'KeyD', label: 'D', finger: 'left-middle' },
      { code: 'KeyF', label: 'F', finger: 'left-index', bump: true },
      { code: 'KeyG', label: 'G', finger: 'left-index' },
      { code: 'KeyH', label: 'H', finger: 'right-index' },
      { code: 'KeyJ', label: 'J', finger: 'right-index', bump: true },
      { code: 'KeyK', label: 'K', finger: 'right-middle' },
      { code: 'KeyL', label: 'L', finger: 'right-ring' },
      { code: 'Semicolon', label: ';', shift: ':', finger: 'right-pinky' },
      { code: 'Quote', label: "'", shift: '"', finger: 'right-pinky' },
      { code: 'Enter', label: 'Enter', width: 'w-enter', finger: 'right-pinky' }
    ],
    [
      { code: 'ShiftLeft', label: 'Shift', width: 'w-shift-left', finger: 'left-pinky' },
      { code: 'KeyZ', label: 'Z', finger: 'left-pinky' },
      { code: 'KeyX', label: 'X', finger: 'left-ring' },
      { code: 'KeyC', label: 'C', finger: 'left-middle' },
      { code: 'KeyV', label: 'V', finger: 'left-index' },
      { code: 'KeyB', label: 'B', finger: 'left-index' },
      { code: 'KeyN', label: 'N', finger: 'right-index' },
      { code: 'KeyM', label: 'M', finger: 'right-index' },
      { code: 'Comma', label: ',', shift: '<', finger: 'right-middle' },
      { code: 'Period', label: '.', shift: '>', finger: 'right-ring' },
      { code: 'Slash', label: '/', shift: '?', finger: 'right-pinky' },
      { code: 'ShiftRight', label: 'Shift', width: 'w-shift-right', finger: 'right-pinky' }
    ],
    [
      { code: 'ControlLeft', label: 'Ctrl', width: 'w-mod', finger: 'left-pinky' },
      { code: 'AltLeft', label: 'Alt', width: 'w-mod', finger: 'left-ring' },
      { code: 'Space', label: 'Space', width: 'w-space', finger: 'thumb' },
      { code: 'AltRight', label: 'Alt', width: 'w-mod', finger: 'right-ring' },
      { code: 'ControlRight', label: 'Ctrl', width: 'w-mod', finger: 'right-pinky' }
    ]
  ];

  class VirtualKeyboard {
    constructor(containerElement, options = {}) {
      this.container = containerElement;
      this.options = { showFingerColors: true, showHeatmap: false, ...options };
      this.keyElementsMap = new Map();
      this.render();
    }

    render() {
      if (!this.container) return;
      this.container.innerHTML = '';
      this.keyElementsMap.clear();

      const kbWrapper = document.createElement('div');
      kbWrapper.className = 'keyboard-container';

      KEYBOARD_LAYOUT.forEach((row, rowIndex) => {
        const rowElem = document.createElement('div');
        rowElem.className = `kb-row kb-row-${rowIndex + 1}`;

        row.forEach(key => {
          const keyElem = document.createElement('div');
          keyElem.className = `kb-key ${key.width || ''} finger-${key.finger}`;
          keyElem.dataset.code = key.code;

          if (key.bump) {
            keyElem.classList.add('has-bump');
            const bumpIndicator = document.createElement('span');
            bumpIndicator.className = 'home-bump';
            keyElem.appendChild(bumpIndicator);
          }

          if (key.shift) {
            const shiftSpan = document.createElement('span');
            shiftSpan.className = 'key-shift-label';
            shiftSpan.textContent = key.shift;
            keyElem.appendChild(shiftSpan);
          }

          const mainSpan = document.createElement('span');
          mainSpan.className = 'key-main-label';
          mainSpan.textContent = key.label;
          keyElem.appendChild(mainSpan);

          const dotSpan = document.createElement('span');
          dotSpan.className = 'finger-dot';
          dotSpan.style.backgroundColor = FINGER_COLORS[key.finger];
          keyElem.appendChild(dotSpan);

          rowElem.appendChild(keyElem);
          this.keyElementsMap.set(key.code, keyElem);
        });

        kbWrapper.appendChild(rowElem);
      });

      this.container.appendChild(kbWrapper);
    }

    highlightTarget(char) {
      this.keyElementsMap.forEach(elem => {
        elem.classList.remove('target-active', 'shift-target-active');
      });

      if (!char) return null;
      const keyInfo = KEY_MAP[char];
      if (!keyInfo) return null;

      const targetElem = this.keyElementsMap.get(keyInfo.code);
      if (targetElem) {
        targetElem.classList.add('target-active');
      }

      if (keyInfo.needsShift && keyInfo.shiftKey) {
        const shiftElem = this.keyElementsMap.get(keyInfo.shiftKey);
        if (shiftElem) {
          shiftElem.classList.add('shift-target-active');
        }
      }

      return keyInfo;
    }

    animateKeyPress(code) {
      const elem = this.keyElementsMap.get(code);
      if (!elem) return;
      elem.classList.add('pressed');
      setTimeout(() => {
        elem.classList.remove('pressed');
      }, 120);
    }

    applyHeatmap(heatmapData) {
      this.keyElementsMap.forEach(elem => {
        elem.classList.remove('heatmap-active');
        elem.style.removeProperty('--heat-intensity');
      });

      if (!heatmapData) return;

      for (const [char, stat] of Object.entries(heatmapData)) {
        const keyInfo = KEY_MAP[char];
        if (keyInfo) {
          const elem = this.keyElementsMap.get(keyInfo.code);
          if (elem && stat.intensity > 0.05) {
            elem.classList.add('heatmap-active');
            elem.style.setProperty('--heat-intensity', stat.intensity.toFixed(2));
          }
        }
      }
    }
  }

  // ==========================================
  // 4. ANATOMICAL HANDS VISUALIZER
  // ==========================================
  class HandVisualizer {
    constructor(containerElement) {
      this.container = containerElement;
      this.render();
    }

    render() {
      if (!this.container) return;
      this.container.innerHTML = `
        <div class="hands-wrapper">
          <div class="hand-box hand-left" id="hand-left">
            <div class="hand-title">Left Hand</div>
            <svg class="hand-svg" viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg">
              <g class="hand-outline">
                <path class="palm" d="M 40 140 C 40 190, 70 210, 100 210 C 130 210, 160 190, 160 140 Z" />
                <path id="finger-left-pinky" class="finger-path" data-finger="left-pinky" d="M 35 140 C 30 110, 25 70, 35 45 C 45 45, 52 65, 52 130 Z" />
                <path id="finger-left-ring" class="finger-path" data-finger="left-ring" d="M 56 128 C 55 90, 52 40, 68 20 C 82 20, 80 50, 80 125 Z" />
                <path id="finger-left-middle" class="finger-path" data-finger="left-middle" d="M 84 125 C 84 75, 85 25, 100 10 C 115 25, 112 75, 112 125 Z" />
                <path id="finger-left-index" class="finger-path" data-finger="left-index" d="M 116 128 C 118 75, 120 40, 134 25 C 148 40, 142 85, 140 135 Z" />
                <path id="finger-left-thumb" class="finger-path thumb-path" data-finger="thumb" d="M 145 140 C 160 120, 175 110, 185 125 C 190 145, 170 170, 155 175 Z" />
              </g>
            </svg>
            <div class="finger-labels">
              <span class="flabel" style="color: ${FINGER_COLORS['left-pinky']}">Pinky</span>
              <span class="flabel" style="color: ${FINGER_COLORS['left-ring']}">Ring</span>
              <span class="flabel" style="color: ${FINGER_COLORS['left-middle']}">Mid</span>
              <span class="flabel" style="color: ${FINGER_COLORS['left-index']}">Index</span>
              <span class="flabel" style="color: ${FINGER_COLORS['thumb']}">Thumb</span>
            </div>
          </div>

          <div class="hand-guide-instruction" id="hand-guide-instruction">
            <div class="guide-badge">READY</div>
            <div class="guide-text">Rest fingers on <strong>F</strong> and <strong>J</strong> home bumps</div>
          </div>

          <div class="hand-box hand-right" id="hand-right">
            <div class="hand-title">Right Hand</div>
            <svg class="hand-svg" viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg">
              <g class="hand-outline">
                <path class="palm" d="M 40 140 C 40 190, 70 210, 100 210 C 130 210, 160 190, 160 140 Z" />
                <path id="finger-right-thumb" class="finger-path thumb-path" data-finger="thumb" d="M 55 140 C 40 120, 25 110, 15 125 C 10 145, 30 170, 45 175 Z" />
                <path id="finger-right-index" class="finger-path" data-finger="right-index" d="M 60 135 C 58 85, 52 40, 66 25 C 80 40, 82 75, 84 128 Z" />
                <path id="finger-right-middle" class="finger-path" data-finger="right-middle" d="M 88 125 C 88 75, 85 25, 100 10 C 115 25, 116 75, 116 125 Z" />
                <path id="finger-right-ring" class="finger-path" data-finger="right-ring" d="M 120 125 C 120 50, 118 20, 132 20 C 148 40, 145 90, 144 128 Z" />
                <path id="finger-right-pinky" class="finger-path" data-finger="right-pinky" d="M 148 130 C 148 65, 155 45, 165 45 C 175 70, 170 110, 165 140 Z" />
              </g>
            </svg>
            <div class="finger-labels">
              <span class="flabel" style="color: ${FINGER_COLORS['thumb']}">Thumb</span>
              <span class="flabel" style="color: ${FINGER_COLORS['right-index']}">Index</span>
              <span class="flabel" style="color: ${FINGER_COLORS['right-middle']}">Mid</span>
              <span class="flabel" style="color: ${FINGER_COLORS['right-ring']}">Ring</span>
              <span class="flabel" style="color: ${FINGER_COLORS['right-pinky']}">Pinky</span>
            </div>
          </div>
        </div>
      `;

      this.instructionBadge = this.container.querySelector('.guide-badge');
      this.instructionText = this.container.querySelector('.guide-text');
      this.fingerPaths = this.container.querySelectorAll('.finger-path');
    }

    highlightFinger(keyInfo, expectedChar) {
      if (!this.fingerPaths) return;
      this.fingerPaths.forEach(p => {
        p.classList.remove('finger-active');
        p.style.fill = '';
        p.style.stroke = '';
        p.style.filter = '';
      });

      if (!keyInfo) {
        if (this.instructionBadge) {
          this.instructionBadge.textContent = 'DONE';
          this.instructionBadge.style.backgroundColor = '#10ff50';
          this.instructionText.innerHTML = 'Session Complete! Great work.';
        }
        return;
      }

      const { finger, fingerName, hand, needsShift, shiftKey } = keyInfo;
      const color = FINGER_COLORS[finger] || '#10ff50';

      const activeFingerPaths = this.container.querySelectorAll(`[data-finger="${finger}"]`);
      activeFingerPaths.forEach(path => {
        if (finger === 'thumb' || (hand === 'left' && path.id.includes('left')) || (hand === 'right' && path.id.includes('right'))) {
          path.classList.add('finger-active');
          path.style.fill = color;
          path.style.stroke = '#ffffff';
          path.style.filter = `drop-shadow(0 0 10px ${color})`;
        }
      });

      if (needsShift) {
        const shiftFingerId = shiftKey === 'ShiftRight' ? 'finger-right-pinky' : 'finger-left-pinky';
        const shiftPath = document.getElementById(shiftFingerId);
        if (shiftPath) {
          shiftPath.classList.add('finger-active');
          shiftPath.style.fill = '#ec4899';
          shiftPath.style.filter = 'drop-shadow(0 0 10px #ec4899)';
        }
      }

      if (this.instructionBadge && this.instructionText) {
        const displayKey = expectedChar === ' ' ? 'SPACEBAR' : (expectedChar === '\n' ? 'ENTER' : expectedChar);
        this.instructionBadge.textContent = fingerName.toUpperCase();
        this.instructionBadge.style.backgroundColor = color;

        let msg = `Use <span class="guide-highlight" style="color: ${color}">${fingerName}</span> for key <strong>[${displayKey}]</strong>`;
        if (needsShift) {
          const oppShiftHand = shiftKey === 'ShiftRight' ? 'Right Shift' : 'Left Shift';
          msg += ` <span class="shift-hint">+ Hold ${oppShiftHand}</span>`;
        }
        this.instructionText.innerHTML = msg;
      }
    }
  }

  // ==========================================
  // 5. LOCAL STORAGE MANAGER
  // ==========================================
  const STORAGE_KEYS = {
    SETTINGS: 'typetutor_settings_v2',
    LESSONS: 'typetutor_lessons_v2',
    STATS: 'typetutor_alltime_stats_v2',
    WEAK_KEYS: 'typetutor_weak_keys_v2'
  };

  const DEFAULT_SETTINGS = {
    theme: 'omnitrix',
    soundType: 'omnitrix',
    volume: 0.40,
    showHands: true,
    showKeyboard: true,
    showFingerColors: true,
    strictMode: false
  };

  class StorageManager {
    static getSettings() {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
      } catch (e) {
        return DEFAULT_SETTINGS;
      }
    }

    static saveSettings(settings) {
      try {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      } catch (e) {}
    }

    static getLessonProgress() {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.LESSONS);
        return data ? JSON.parse(data) : {};
      } catch (e) {
        return {};
      }
    }

    static recordLessonResult(lessonId, metrics, targetWpm, minAccuracy = 95) {
      try {
        const progress = StorageManager.getLessonProgress();
        const existing = progress[lessonId] || { bestWpm: 0, bestAcc: 0, stars: 0 };
        let stars = 1;
        if (metrics.wpm >= targetWpm && metrics.accuracy >= minAccuracy) stars = 2;
        if (metrics.wpm >= targetWpm + 10 && metrics.accuracy >= 98) stars = 3;

        progress[lessonId] = {
          completed: true,
          bestWpm: Math.max(existing.bestWpm, metrics.wpm),
          bestAcc: Math.max(existing.bestAcc, metrics.accuracy),
          stars: Math.max(existing.stars, stars),
          lastCompleted: Date.now()
        };
        localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(progress));
        return progress[lessonId];
      } catch (e) {
        return null;
      }
    }

    static recordSessionStats(metrics) {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.STATS);
        const stats = raw ? JSON.parse(raw) : { testsCompleted: 0, highestWpm: 0 };
        stats.testsCompleted += 1;
        if (metrics.wpm > stats.highestWpm) stats.highestWpm = metrics.wpm;
        localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
      } catch (e) {}
    }

    static recordKeyErrors(keyStats) {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.WEAK_KEYS);
        const weakKeys = raw ? JSON.parse(raw) : {};
        for (const [key, stat] of Object.entries(keyStats)) {
          if (!weakKeys[key]) weakKeys[key] = { attempts: 0, errors: 0 };
          weakKeys[key].attempts += stat.attempts || 0;
          weakKeys[key].errors += stat.errors || 0;
        }
        localStorage.setItem(STORAGE_KEYS.WEAK_KEYS, JSON.stringify(weakKeys));
      } catch (e) {}
    }

    static getAggregateWeakKeys(limit = 6) {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.WEAK_KEYS);
        if (!raw) return [];
        const weakKeys = JSON.parse(raw);
        const list = [];
        for (const [key, stat] of Object.entries(weakKeys)) {
          if (stat.attempts >= 5 && stat.errors > 0) {
            list.push({ key, errorRate: stat.errors / stat.attempts });
          }
        }
        list.sort((a, b) => b.errorRate - a.errorRate);
        return list.slice(0, limit);
      } catch (e) {
        return [];
      }
    }
  }

  // ==========================================
  // 6. CURRICULUM DATA
  // ==========================================
  const CURRICULUM = [
    {
      id: 'stage-1',
      title: 'Stage 1: Home Row Foundation',
      description: 'Learn the primary resting position. Feel for bumps on F and J.',
      lessons: [
        {
          id: '1-1',
          title: '1.1 The Tactile Anchors: F and J',
          targetWpm: 15,
          minAccuracy: 95,
          instruction: 'Place your left index on F and right index on J. Keep thumbs on Spacebar.',
          text: 'f j f j ff jj fj jf f f j j fff jjj jfj fjf ff jj fj jf f j f j'
        },
        {
          id: '1-2',
          title: '1.2 Middle Fingers: D and K',
          targetWpm: 18,
          minAccuracy: 95,
          instruction: 'Curl left middle finger to D and right middle finger to K.',
          text: 'd k d k dd kk dk kd df jk fd kj dk fj df jk d k f j dd kk ff jj'
        },
        {
          id: '1-3',
          title: '1.3 Ring Fingers: S and L',
          targetWpm: 20,
          minAccuracy: 95,
          instruction: 'Curl left ring finger to S and right ring finger to L.',
          text: 's l s l ss ll sl ls as df jk ls sdk lsf sld kls lks sdl s l d k'
        },
        {
          id: '1-4',
          title: '1.4 Pinky Fingers: A and ;',
          targetWpm: 22,
          minAccuracy: 95,
          instruction: 'Left pinky on A, right pinky on semicolon (;). Full home row complete!',
          text: 'a ; a ; aa ;; a; ;a asdf ;lkj asdf jkl; a s d f j k l ; ask fad'
        },
        {
          id: '1-5',
          title: '1.5 Inward Reaches: G and H',
          targetWpm: 24,
          minAccuracy: 95,
          instruction: 'Left index reaches across to G; right index reaches across to H.',
          text: 'f g f j h j fg jh gf hj fgh jhg gas hag had half glad flash fall'
        },
        {
          id: '1-6',
          title: '1.6 Home Row Word Mastery',
          targetWpm: 28,
          minAccuracy: 96,
          instruction: 'Real English words using only the home row keys.',
          text: 'all ask dad fall glad half salad flash glass shall flask dash lad flag'
        }
      ]
    },
    {
      id: 'stage-2',
      title: 'Stage 2: Top Row Reaches',
      description: 'Upward diagonal reaches. Always snap fingers right back to home row.',
      lessons: [
        {
          id: '2-1',
          title: '2.1 Core Vowels: E and I',
          targetWpm: 25,
          minAccuracy: 95,
          instruction: 'Left middle reaches up to E. Right middle reaches up to I.',
          text: 'd e d k i k de ki ed ik see kid life feel side like else desk disk'
        },
        {
          id: '2-2',
          title: '2.2 Index Upward Reaches: R and U',
          targetWpm: 28,
          minAccuracy: 95,
          instruction: 'Left index up to R. Right index up to U.',
          text: 'f r f j u j fr ju rf uj fur run red use rule sure rush rude fire'
        },
        {
          id: '2-3',
          title: '2.3 Far Reaches: T and Y',
          targetWpm: 28,
          minAccuracy: 95,
          instruction: 'Left index up to T. Right index up to Y.',
          text: 'f t f j y j ft jy tf yj yet try tell year stay they tiny true test'
        },
        {
          id: '2-4',
          title: '2.4 Ring & Pinky: W, O, Q, P',
          targetWpm: 30,
          minAccuracy: 95,
          instruction: 'W, O, Q, P top reaches.',
          text: 's w s l o l a q a ; p ; we so quit poor wire power loop quote slow'
        },
        {
          id: '2-5',
          title: '2.5 Full Top + Home Fluency',
          targetWpm: 32,
          minAccuracy: 96,
          instruction: 'Smooth sentences combining top and home row.',
          text: 'the quick red fox took water from the deep well while the sheep slept quietly'
        }
      ]
    },
    {
      id: 'stage-3',
      title: 'Stage 3: Bottom Row Reaches',
      description: 'Downward diagonal finger curling with light touch.',
      lessons: [
        {
          id: '3-1',
          title: '3.1 Index Downward: V and M',
          targetWpm: 30,
          minAccuracy: 95,
          instruction: 'Left index down to V. Right index down to M.',
          text: 'f v f j m j fv jm vf mj view move make vim visit mold volume must valve'
        },
        {
          id: '3-2',
          title: '3.2 Middle Fingers: C and Comma (,)',
          targetWpm: 30,
          minAccuracy: 95,
          instruction: 'Left middle down to C. Right middle down to Comma (,).',
          text: 'd c d k , k dc k, cd ,k call, calm, card, clear, clock, click, lock, come,'
        },
        {
          id: '3-3',
          title: '3.3 Ring Fingers: X and Period (.)',
          targetWpm: 32,
          minAccuracy: 95,
          instruction: 'Left ring down to X. Right ring down to Period (.).',
          text: 's x s l . l sx l. fix. mix. next. exact. text. box. six. extra. wax. fox.'
        },
        {
          id: '3-4',
          title: '3.4 Pinkies Down: Z and Slash (/)',
          targetWpm: 30,
          minAccuracy: 95,
          instruction: 'Left pinky down to Z. Right pinky down to Slash (/).',
          text: 'a z a ; / ; az ;/ zone zero zeal blaze quiz buzz maze size and/or either/or'
        },
        {
          id: '3-5',
          title: '3.5 Bottom Inward: B and N',
          targetWpm: 34,
          minAccuracy: 95,
          instruction: 'Left index reaches to B. Right index reaches to N.',
          text: 'f b f j n j fb jn bf nj bean burn brand bone brown bench bank bring number'
        },
        {
          id: '3-6',
          title: '3.6 Full Alphabet Pangram Fluency',
          targetWpm: 38,
          minAccuracy: 96,
          instruction: 'The classic sentence with all 26 letters.',
          text: 'the quick brown fox jumps over the lazy dog. pack my box with five dozen liquor jugs.'
        }
      ]
    },
    {
      id: 'stage-4',
      title: 'Stage 4: Capitalization & Shifts',
      description: 'Master the Opposite Shift Hand Rule.',
      lessons: [
        {
          id: '4-1',
          title: '4.1 Right Shift Rule for Left Hand',
          targetWpm: 35,
          minAccuracy: 95,
          instruction: 'Hold Right Shift with right pinky while typing left hand capitals.',
          text: 'The First Step To Great Touch Typing Is Relaxed Shoulders And Proper Alignment'
        },
        {
          id: '4-2',
          title: '4.2 Left Shift Rule for Right Hand',
          targetWpm: 35,
          minAccuracy: 95,
          instruction: 'Hold Left Shift with left pinky while typing right hand capitals.',
          text: 'John Met Mary In New York Near June While Lucy Placed Orders In London'
        }
      ]
    },
    {
      id: 'stage-5',
      title: 'Stage 5: Numbers & Common Symbols',
      description: 'Numbers and developer symbols.',
      lessons: [
        {
          id: '5-1',
          title: '5.1 Number Row 1 to 0',
          targetWpm: 30,
          minAccuracy: 94,
          instruction: 'Reach upward to the number keys.',
          text: 'room 101, flight 482, year 2026, 350 items, 99 percent, 742 days, 1800 meters'
        },
        {
          id: '5-2',
          title: '5.2 Developer Code Symbols',
          targetWpm: 32,
          minAccuracy: 94,
          instruction: 'Programming syntax brackets and symbols.',
          text: 'const list = [1, 2, 3]; if (x >= 10 && y <= 20) { return items.map(i => i * 2); }'
        }
      ]
    },
    {
      id: 'stage-6',
      title: 'Stage 6: Professional Speed & Code',
      description: 'Elite speed drills, Python, and JavaScript.',
      lessons: [
        {
          id: '6-1',
          title: '6.1 Top 100 English Words',
          targetWpm: 50,
          minAccuracy: 97,
          instruction: 'Type these automatic muscle-memory words.',
          text: 'the of and a to in is you that it he was for on are as with his they at be this have from or one had by word but not what all were we when your can said there use an each which she do how their'
        },
        {
          id: '6-2',
          title: '6.2 JavaScript Async Function Drill',
          targetWpm: 45,
          minAccuracy: 96,
          instruction: 'Modern web development code typing.',
          text: 'async function fetchUserData(userId) {\n  const res = await api.get(`/users/${userId}`);\n  return res.data ? res.data.profile : null;\n}'
        },
        {
          id: '6-3',
          title: '6.3 Ben 10 Hero Elite Challenge',
          targetWpm: 60,
          minAccuracy: 98,
          instruction: 'It is Hero Time! Type at maximum speed.',
          text: 'With the power of the Omnitrix strapped to his wrist, Ben transformed into Heatblast and unleashed fiery blasts to save the city from Vilgax.'
        }
      ]
    }
  ];

  const COMMON_WORDS = [
    'about', 'above', 'across', 'action', 'activity', 'after', 'again', 'against', 'almost',
    'alone', 'along', 'already', 'always', 'another', 'answer', 'anyone', 'anything', 'appear',
    'apply', 'approach', 'area', 'around', 'arrive', 'article', 'assume', 'attack', 'attention',
    'author', 'avoid', 'away', 'back', 'balance', 'ball', 'bank', 'base', 'beat', 'beautiful',
    'because', 'become', 'before', 'begin', 'behind', 'believe', 'benefit', 'better', 'between',
    'beyond', 'black', 'blue', 'board', 'body', 'book', 'both', 'break', 'bring', 'build',
    'business', 'call', 'camera', 'capital', 'care', 'carry', 'case', 'catch', 'cause', 'center',
    'central', 'certain', 'chair', 'chance', 'change', 'charge', 'check', 'child', 'choice',
    'choose', 'city', 'claim', 'class', 'clear', 'clearly', 'close', 'cold', 'color', 'come',
    'common', 'company', 'compare', 'computer', 'concern', 'control', 'cost', 'could', 'country',
    'couple', 'course', 'court', 'cover', 'create', 'current', 'customer', 'cut', 'dark', 'data',
    'day', 'deal', 'death', 'decide', 'decision', 'deep', 'describe', 'design', 'detail', 'develop',
    'device', 'different', 'difficult', 'direction', 'discover', 'discuss', 'doctor', 'door', 'down',
    'draw', 'dream', 'drive', 'drop', 'during', 'each', 'early', 'east', 'easy', 'economic',
    'economy', 'edge', 'effect', 'effort', 'eight', 'either', 'element', 'energy', 'enjoy',
    'enough', 'enter', 'entire', 'evening', 'event', 'every', 'everyone', 'everything', 'evidence',
    'exact', 'example', 'exist', 'expect', 'expert', 'explain', 'factor', 'fail', 'family',
    'fast', 'father', 'fear', 'feature', 'feel', 'feeling', 'field', 'fight', 'figure', 'fill',
    'final', 'finally', 'financial', 'find', 'finger', 'finish', 'fire', 'firm', 'first', 'five',
    'floor', 'focus', 'follow', 'food', 'foot', 'force', 'form', 'forward', 'four', 'friend',
    'front', 'full', 'fund', 'future', 'game', 'general', 'girl', 'give', 'glass', 'goal',
    'good', 'great', 'green', 'ground', 'group', 'grow', 'growth', 'guess', 'hand', 'happen',
    'happy', 'hard', 'head', 'health', 'hear', 'heart', 'heat', 'heavy', 'help', 'here',
    'high', 'history', 'hold', 'home', 'hope', 'hospital', 'hour', 'house', 'human', 'huge',
    'hundred', 'idea', 'identify', 'image', 'imagine', 'impact', 'important', 'improve', 'include',
    'increase', 'indeed', 'indicate', 'industry', 'inside', 'instead', 'interest', 'interview',
    'into', 'issue', 'item', 'itself', 'job', 'join', 'just', 'keep', 'kind', 'know', 'knowledge',
    'land', 'language', 'large', 'last', 'late', 'later', 'laugh', 'law', 'lead', 'leader',
    'learn', 'least', 'leave', 'left', 'legal', 'less', 'letter', 'level', 'lie', 'life',
    'light', 'like', 'likely', 'line', 'list', 'listen', 'little', 'live', 'local', 'long',
    'look', 'lose', 'loss', 'love', 'machine', 'main', 'maintain', 'major', 'make', 'manage',
    'manager', 'many', 'market', 'material', 'matter', 'maybe', 'mean', 'measure', 'media',
    'medical', 'meet', 'meeting', 'member', 'memory', 'mention', 'message', 'method', 'middle',
    'might', 'million', 'mind', 'minute', 'mission', 'model', 'modern', 'moment', 'money',
    'month', 'more', 'morning', 'most', 'mother', 'mouth', 'move', 'movement', 'music', 'must',
    'myself', 'name', 'nation', 'national', 'natural', 'nature', 'near', 'nearly', 'necessary',
    'need', 'network', 'never', 'news', 'next', 'nice', 'night', 'none', 'north', 'note',
    'nothing', 'notice', 'number', 'occur', 'officer', 'often', 'once', 'online', 'open',
    'operation', 'option', 'order', 'others', 'outside', 'page', 'pain', 'paper', 'parent',
    'part', 'partner', 'party', 'pass', 'past', 'patient', 'pattern', 'peace', 'people',
    'perform', 'period', 'person', 'phone', 'physical', 'picture', 'piece', 'place', 'plan',
    'plant', 'player', 'point', 'police', 'policy', 'popular', 'position', 'positive', 'possible',
    'power', 'practice', 'prepare', 'present', 'pressure', 'prevent', 'price', 'private',
    'problem', 'process', 'produce', 'product', 'program', 'project', 'property', 'protect',
    'prove', 'provide', 'public', 'purpose', 'push', 'quality', 'question', 'quickly', 'quite',
    'radio', 'raise', 'range', 'rate', 'rather', 'reach', 'read', 'ready', 'real', 'reality',
    'realize', 'really', 'reason', 'receive', 'recent', 'record', 'reduce', 'reflect', 'region',
    'remain', 'remember', 'remove', 'report', 'require', 'research', 'resource', 'respond',
    'response', 'rest', 'result', 'return', 'reveal', 'rich', 'right', 'rise', 'risk',
    'road', 'rock', 'role', 'room', 'rule', 'safe', 'same', 'save', 'scene', 'school',
    'science', 'scientist', 'score', 'season', 'seat', 'second', 'section', 'security', 'seek',
    'seem', 'sell', 'send', 'senior', 'sense', 'series', 'serious', 'serve', 'service',
    'seven', 'several', 'shake', 'share', 'shoot', 'short', 'shot', 'should', 'shoulder',
    'show', 'side', 'sign', 'significant', 'similar', 'simple', 'simply', 'since', 'sing',
    'single', 'sister', 'site', 'situation', 'six', 'size', 'skill', 'small', 'smile',
    'social', 'society', 'some', 'somebody', 'someone', 'something', 'sometimes', 'song',
    'soon', 'sort', 'sound', 'source', 'south', 'space', 'speak', 'special', 'specific',
    'speech', 'spend', 'sport', 'spring', 'staff', 'stage', 'stand', 'standard', 'star',
    'start', 'state', 'station', 'stay', 'step', 'still', 'stock', 'stop', 'store',
    'story', 'strategy', 'street', 'strong', 'structure', 'student', 'study', 'style',
    'success', 'such', 'suddenly', 'suggest', 'summer', 'support', 'sure', 'surface',
    'system', 'table', 'take', 'talk', 'task', 'teach', 'teacher', 'team', 'technology',
    'tell', 'term', 'test', 'than', 'thank', 'theory', 'thing', 'think', 'third', 'thought',
    'threat', 'three', 'through', 'throw', 'time', 'today', 'together', 'tonight', 'total',
    'touch', 'toward', 'town', 'trade', 'training', 'travel', 'treat', 'tree', 'trial',
    'trip', 'trouble', 'true', 'truth', 'turn', 'type', 'under', 'understand', 'unit',
    'until', 'upon', 'usually', 'value', 'various', 'victim', 'view', 'visit', 'voice',
    'wait', 'walk', 'wall', 'want', 'watch', 'water', 'weapon', 'wear', 'week', 'weight',
    'well', 'west', 'whatever', 'when', 'where', 'whether', 'which', 'while', 'white',
    'whole', 'whom', 'whose', 'wide', 'wife', 'wind', 'window', 'wish', 'with', 'within',
    'without', 'woman', 'wonder', 'word', 'work', 'worker', 'world', 'worry', 'would',
    'write', 'writer', 'wrong', 'yard', 'yeah', 'year', 'young'
  ];

  function getRandomWords(count = 50) {
    const result = [];
    for (let i = 0; i < count; i++) {
      const word = COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)];
      result.push(word);
    }
    return result.join(' ');
  }

  // ==========================================
  // 7. APPLICATION ORCHESTRATOR
  // ==========================================
  class TypingTutorApp {
    constructor() {
      this.sound = new SoundEngine();
      this.settings = StorageManager.getSettings();

      this.activeMode = 'lesson';
      this.activeLesson = null;
      this.activeTimedDuration = 60;
      this.activeWordCount = 50;
      this.currentText = '';
      this.dialRot = 0;
      this.charSpans = [];

      this.cacheDom();
      this.init();
    }

    cacheDom() {
      this.dom = {
        appRoot: document.getElementById('app-root'),
        textDisplay: document.getElementById('text-display'),
        caret: document.getElementById('caret'),
        hiddenInput: document.getElementById('hidden-input'),
        liveWpm: document.getElementById('live-wpm'),
        liveAcc: document.getElementById('live-acc'),
        liveTime: document.getElementById('live-time'),
        liveConsistency: document.getElementById('live-consistency'),
        progressBar: document.getElementById('progress-bar'),
        keyboardContainer: document.getElementById('keyboard-view'),
        handsContainer: document.getElementById('hands-view'),
        curriculumDrawer: document.getElementById('curriculum-drawer'),
        curriculumList: document.getElementById('curriculum-list'),
        lessonInfoBanner: document.getElementById('lesson-info-banner'),
        lessonTitle: document.getElementById('lesson-title'),
        lessonDesc: document.getElementById('lesson-desc'),
        lessonTarget: document.getElementById('lesson-target'),
        resultsModal: document.getElementById('results-modal'),
        resultsCanvas: document.getElementById('results-chart'),
        themeSelect: document.getElementById('theme-select'),
        soundSelect: document.getElementById('sound-select'),
        volumeSlider: document.getElementById('volume-slider')
      };
    }

    init() {
      this.applyTheme(this.settings.theme);
      this.sound.setSoundType(this.settings.soundType);
      this.sound.setVolume(this.settings.volume);

      this.keyboard = new VirtualKeyboard(this.dom.keyboardContainer, {
        showFingerColors: this.settings.showFingerColors
      });
      this.hands = new HandVisualizer(this.dom.handsContainer);

      this.engine = new TypingEngine({
        strictMode: this.settings.strictMode,
        onStart: (metrics) => this.handleEngineStart(metrics),
        onKeystroke: (data) => this.handleEngineKeystroke(data),
        onTick: (metrics) => this.handleEngineTick(metrics),
        onComplete: (metrics) => this.handleEngineComplete(metrics)
      });

      this.renderCurriculumUI();
      this.bindEvents();

      const firstLesson = CURRICULUM[0].lessons[0];
      this.loadLesson(firstLesson);
    }

    bindEvents() {
      // Focus hidden input on viewport click or body click
      document.addEventListener('click', (e) => {
        const tag = e.target.tagName;
        if (!['INPUT', 'SELECT', 'BUTTON', 'TEXTAREA'].includes(tag)) {
          this.focusInput();
        }
      });

      const viewport = document.getElementById('typing-viewport');
      if (viewport) {
        viewport.addEventListener('click', () => this.focusInput());
      }

      window.addEventListener('keydown', (e) => this.handleKeyDown(e));

      // Mode Selector Buttons
      document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          this.switchMode(btn.dataset.mode);
        });
      });

      // Timed sub-options
      document.querySelectorAll('.timed-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.timed-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.activeTimedDuration = parseInt(btn.dataset.time, 10);
          this.startTimedSession(this.activeTimedDuration);
        });
      });

      // Word count sub-options
      document.querySelectorAll('.words-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.words-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.activeWordCount = parseInt(btn.dataset.count, 10);
          this.startWordSession(this.activeWordCount);
        });
      });

      // Theme Selector
      if (this.dom.themeSelect) {
        this.dom.themeSelect.value = this.settings.theme;
        this.dom.themeSelect.addEventListener('change', (e) => {
          this.applyTheme(e.target.value);
          this.focusInput();
        });
      }

      // Sound Selector
      if (this.dom.soundSelect) {
        this.dom.soundSelect.value = this.settings.soundType;
        this.dom.soundSelect.addEventListener('change', (e) => {
          this.settings.soundType = e.target.value;
          this.sound.setSoundType(e.target.value);
          StorageManager.saveSettings(this.settings);
          if (e.target.value === 'omnitrix') {
            this.sound.playOmnitrixDial(false);
          } else {
            this.sound.playKey(true, 'a');
          }
          this.focusInput();
        });
      }

      // Volume Slider
      if (this.dom.volumeSlider) {
        this.dom.volumeSlider.value = this.settings.volume * 100;
        this.dom.volumeSlider.addEventListener('input', (e) => {
          const val = e.target.value / 100;
          this.settings.volume = val;
          this.sound.setVolume(val);
          StorageManager.saveSettings(this.settings);
        });
      }

      // View toggles
      document.getElementById('toggle-hands-btn')?.addEventListener('click', (e) => {
        const isHidden = this.dom.handsContainer.classList.toggle('hidden');
        e.currentTarget.classList.toggle('active', !isHidden);
        this.focusInput();
      });

      document.getElementById('toggle-keyboard-btn')?.addEventListener('click', (e) => {
        const isHidden = this.dom.keyboardContainer.classList.toggle('hidden');
        e.currentTarget.classList.toggle('active', !isHidden);
        this.focusInput();
      });

      document.getElementById('toggle-heatmap-btn')?.addEventListener('click', (e) => {
        const active = e.currentTarget.classList.toggle('active');
        if (active) {
          const heatmap = this.engine.getKeyHeatmap();
          this.keyboard.applyHeatmap(heatmap);
        } else {
          this.keyboard.applyHeatmap(null);
        }
        this.focusInput();
      });

      // Restart Button
      document.getElementById('restart-btn')?.addEventListener('click', () => {
        this.restartCurrentSession();
      });

      // Custom Text Modal
      const customModal = document.getElementById('custom-text-modal');
      document.getElementById('custom-modal-cancel')?.addEventListener('click', () => {
        customModal?.classList.add('hidden');
        this.focusInput();
      });
      document.getElementById('custom-modal-start')?.addEventListener('click', () => {
        const text = document.getElementById('custom-text-input')?.value.trim();
        if (text && text.length > 0) {
          customModal?.classList.add('hidden');
          this.startCustomTextSession(text);
        }
      });

      // Results Modal Buttons
      document.getElementById('modal-retry-btn')?.addEventListener('click', () => {
        this.dom.resultsModal.classList.add('hidden');
        this.restartCurrentSession();
      });
      document.getElementById('modal-next-btn')?.addEventListener('click', () => {
        this.dom.resultsModal.classList.add('hidden');
        this.loadNextLesson();
      });
      document.getElementById('modal-weak-drill-btn')?.addEventListener('click', () => {
        this.dom.resultsModal.classList.add('hidden');
        this.startWeakKeySession();
      });
      document.getElementById('modal-close-btn')?.addEventListener('click', () => {
        this.dom.resultsModal.classList.add('hidden');
        this.focusInput();
      });

      // Test Sound Button
      document.getElementById('test-sound-btn')?.addEventListener('click', () => {
        if (this.sound.soundType === 'omnitrix') {
          this.sound.playOmnitrixTransform();
        } else {
          this.sound.playKey(true, ' ');
        }
        this.focusInput();
      });

      // Omnitrix Interactive Badge
      const omnitrixBadge = document.getElementById('omnitrix-badge');
      if (omnitrixBadge) {
        omnitrixBadge.addEventListener('click', () => {
          omnitrixBadge.classList.add('slammed');
          setTimeout(() => omnitrixBadge.classList.remove('slammed'), 250);
          this.sound.playOmnitrixTransform();
          this.focusInput();
        });
      }

      // Pro Tips Guide
      const tipsModal = document.getElementById('tips-modal');
      document.getElementById('tips-btn')?.addEventListener('click', () => {
        tipsModal?.classList.remove('hidden');
      });
      document.getElementById('tips-modal-close')?.addEventListener('click', () => {
        tipsModal?.classList.add('hidden');
        this.focusInput();
      });
    }

    focusInput() {
      if (this.dom.hiddenInput) {
        this.dom.hiddenInput.focus();
      }
    }

    applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      this.settings.theme = theme;
      StorageManager.saveSettings(this.settings);
    }

    handleKeyDown(e) {
      if (e.ctrlKey || e.altKey || e.metaKey) {
        if (e.key === 'r' && e.ctrlKey) return;
        return;
      }

      if (e.target.tagName === 'TEXTAREA' || (e.target.tagName === 'INPUT' && e.target.id !== 'hidden-input') || e.target.tagName === 'SELECT') {
        return;
      }

      if (e.key === 'Tab') {
        e.preventDefault();
        this.restartCurrentSession();
        return;
      }

      if (e.key === 'Escape') {
        this.dom.resultsModal?.classList.add('hidden');
        document.getElementById('tips-modal')?.classList.add('hidden');
        document.getElementById('custom-text-modal')?.classList.add('hidden');
        this.focusInput();
        return;
      }

      if (e.key === ' ') {
        e.preventDefault();
      }

      this.keyboard.animateKeyPress(e.code);

      const dial = document.getElementById('omnitrix-dial-core');
      if (dial) {
        this.dialRot = (this.dialRot || 0) + (e.key === ' ' ? 72 : 36);
        dial.style.transform = `rotate(${this.dialRot}deg)`;
      }
      const badge = document.getElementById('omnitrix-badge');
      if (badge && e.key === ' ') {
        badge.classList.add('slammed');
        setTimeout(() => badge.classList.remove('slammed'), 120);
      }

      const res = this.engine.handleKey(e.key);
      if (!res) return;

      if (res.backspaced) {
        this.sound.playKey(true, 'Backspace');
      } else if (res.keystroke) {
        this.sound.playKey(res.keystroke.correct, res.keystroke.key);
      }
    }

    loadLesson(lesson) {
      this.activeMode = 'lesson';
      this.activeLesson = lesson;

      if (this.dom.lessonInfoBanner) {
        this.dom.lessonInfoBanner.classList.remove('hidden');
        this.dom.lessonTitle.textContent = lesson.title;
        this.dom.lessonDesc.textContent = lesson.instruction;
        this.dom.lessonTarget.innerHTML = `Target: <strong>${lesson.targetWpm} WPM</strong> | Min Accuracy: <strong>${lesson.minAccuracy}%</strong>`;
      }

      this.setupSession(lesson.text, { mode: 'lesson' });
      this.updateActiveLessonUI(lesson.id);
    }

    loadNextLesson() {
      if (!this.activeLesson) return;
      let cStage = 0, cLesson = 0;
      CURRICULUM.forEach((stage, sIdx) => {
        stage.lessons.forEach((l, lIdx) => {
          if (l.id === this.activeLesson.id) {
            cStage = sIdx;
            cLesson = lIdx;
          }
        });
      });

      const stage = CURRICULUM[cStage];
      if (cLesson + 1 < stage.lessons.length) {
        this.loadLesson(stage.lessons[cLesson + 1]);
      } else if (cStage + 1 < CURRICULUM.length) {
        this.loadLesson(CURRICULUM[cStage + 1].lessons[0]);
      } else {
        this.loadLesson(CURRICULUM[0].lessons[0]);
      }
    }

    switchMode(mode) {
      this.activeMode = mode;
      document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
      });

      document.getElementById('timed-options')?.classList.toggle('hidden', mode !== 'timed');
      document.getElementById('words-options')?.classList.toggle('hidden', mode !== 'words');
      this.dom.curriculumDrawer?.classList.toggle('hidden', mode !== 'lesson');
      this.dom.lessonInfoBanner?.classList.toggle('hidden', mode !== 'lesson');

      if (mode === 'timed') {
        this.startTimedSession(this.activeTimedDuration);
      } else if (mode === 'words') {
        this.startWordSession(this.activeWordCount);
      } else if (mode === 'weak') {
        this.startWeakKeySession();
      } else if (mode === 'custom') {
        document.getElementById('custom-text-modal')?.classList.remove('hidden');
      } else if (mode === 'lesson') {
        if (this.activeLesson) {
          this.loadLesson(this.activeLesson);
        } else {
          this.loadLesson(CURRICULUM[0].lessons[0]);
        }
      }
    }

    startTimedSession(seconds) {
      const text = getRandomWords(70);
      this.setupSession(text, { mode: 'timed', timeLimit: seconds });
    }

    startWordSession(count) {
      const text = getRandomWords(count);
      this.setupSession(text, { mode: 'words', wordLimit: count });
    }

    startWeakKeySession() {
      const historicalWeak = StorageManager.getAggregateWeakKeys(5).map(k => k.key);
      const engineWeak = this.engine ? this.engine.getWeakKeys(5).map(k => k.key) : [];
      const combined = Array.from(new Set([...historicalWeak, ...engineWeak]));
      const drillText = TypingEngine.generateWeakKeyDrill(combined.length > 0 ? combined : ['f', 'j', 'd', 'k'], 25);

      this.setupSession(drillText, { mode: 'lesson' });
      if (this.dom.lessonInfoBanner) {
        this.dom.lessonInfoBanner.classList.remove('hidden');
        this.dom.lessonTitle.textContent = 'Targeted Weak Key Workout';
        this.dom.lessonDesc.textContent = `Adaptive drill focused on your current problem keys: [ ${combined.join(', ').toUpperCase()} ]`;
        this.dom.lessonTarget.innerHTML = `Target: <strong>Eliminate errors</strong> and smooth out rhythm.`;
      }
    }

    startCustomTextSession(text) {
      this.setupSession(text, { mode: 'custom' });
      if (this.dom.lessonInfoBanner) {
        this.dom.lessonInfoBanner.classList.remove('hidden');
        this.dom.lessonTitle.textContent = 'Custom Practice Text';
        this.dom.lessonDesc.textContent = 'Personalized drill from your pasted passage or code snippet.';
        this.dom.lessonTarget.innerHTML = `Target: <strong>Clean, steady rhythm</strong>`;
      }
    }

    restartCurrentSession() {
      this.setupSession(this.currentText, this.engine.options);
    }

    setupSession(text, engineOptions) {
      this.currentText = text;
      this.engine.setText(text, engineOptions);

      this.renderTextDisplay();
      this.updateStatsUI({
        wpm: 0,
        accuracy: 100,
        elapsedSeconds: 0,
        consistency: 100
      });

      this.updateGuidesForNextChar();
      this.focusInput();
    }

    renderTextDisplay() {
      if (!this.dom.textDisplay) return;
      this.dom.textDisplay.innerHTML = '';
      this.charSpans = [];

      const chars = this.engine.targetChars;
      const frag = document.createDocumentFragment();

      chars.forEach((char, idx) => {
        const span = document.createElement('span');
        span.className = 'char pending';
        span.id = `char-${idx}`;

        if (char === ' ') {
          span.classList.add('char-space');
          span.innerHTML = '&nbsp;';
        } else if (char === '\n') {
          span.classList.add('char-newline');
          span.innerHTML = '↵<br>';
        } else {
          span.textContent = char;
        }

        frag.appendChild(span);
        this.charSpans.push(span);
      });

      this.dom.textDisplay.appendChild(frag);
      this.positionCaret(0);
    }

    positionCaret(index) {
      if (!this.dom.caret || !this.dom.textDisplay) return;
      const viewport = document.getElementById('typing-viewport');
      if (!viewport) return;

      const viewportRect = viewport.getBoundingClientRect();

      if (index >= this.charSpans.length) {
        const lastChar = this.charSpans[this.charSpans.length - 1];
        if (lastChar) {
          const rect = lastChar.getBoundingClientRect();
          this.dom.caret.style.left = `${rect.right - viewportRect.left}px`;
          this.dom.caret.style.top = `${rect.top - viewportRect.top}px`;
        }
        return;
      }

      const targetElem = this.charSpans[index];
      if (targetElem) {
        const rect = targetElem.getBoundingClientRect();
        this.dom.caret.style.left = `${rect.left - viewportRect.left}px`;
        this.dom.caret.style.top = `${rect.top - viewportRect.top}px`;

        if (rect.top - viewportRect.top > 120) {
          this.dom.textDisplay.scrollTop += 32;
        }
      }
    }

    updateGuidesForNextChar() {
      const nextChar = this.engine.getCurrentTarget();
      const keyInfo = this.keyboard.highlightTarget(nextChar);
      this.hands.highlightFinger(keyInfo, nextChar);
    }

    handleEngineStart() {
      this.dom.caret?.classList.add('typing');
      if (this.sound.soundType === 'omnitrix') {
        this.sound.playOmnitrixPopup();
      }
    }

    handleEngineKeystroke({ currentIndex, metrics }) {
      for (let i = 0; i < this.charSpans.length; i++) {
        const span = this.charSpans[i];
        if (!span) continue;

        const input = this.engine.userInputs[i];
        const isSpace = this.engine.targetChars[i] === ' ';
        const isNewline = this.engine.targetChars[i] === '\n';
        const extraClass = isSpace ? ' char-space' : (isNewline ? ' char-newline' : '');

        if (input === null || input === undefined) {
          span.className = 'char pending' + extraClass;
        } else if (input.correct) {
          span.className = 'char correct' + extraClass;
        } else {
          span.className = 'char incorrect' + extraClass;
        }
      }

      this.positionCaret(currentIndex);
      this.updateGuidesForNextChar();
      this.updateStatsUI(metrics);
    }

    handleEngineTick(metrics) {
      if (this.engine.options.mode === 'timed') {
        const remaining = Math.max(0, this.engine.options.timeLimit - Math.round(metrics.elapsedSeconds));
        this.dom.liveTime.textContent = `${remaining}s`;
      } else {
        this.dom.liveTime.textContent = `${Math.round(metrics.elapsedSeconds)}s`;
      }
      this.updateStatsUI(metrics);
    }

    handleEngineComplete(metrics) {
      this.dom.caret?.classList.remove('typing');

      if (this.sound.soundType === 'omnitrix') {
        this.sound.playOmnitrixTransform();
      }

      StorageManager.recordSessionStats(metrics);
      StorageManager.recordKeyErrors(this.engine.keyStats);

      if (this.activeMode === 'lesson' && this.activeLesson) {
        StorageManager.recordLessonResult(
          this.activeLesson.id,
          metrics,
          this.activeLesson.targetWpm,
          this.activeLesson.minAccuracy
        );
        this.renderCurriculumUI();
      }

      this.showResultsModal(metrics);
    }

    updateStatsUI(metrics) {
      if (this.dom.liveWpm) this.dom.liveWpm.textContent = metrics.wpm || 0;
      if (this.dom.liveAcc) this.dom.liveAcc.textContent = `${metrics.accuracy || 100}%`;
      if (this.dom.liveConsistency) this.dom.liveConsistency.textContent = `${metrics.consistency || 100}%`;
      if (this.dom.progressBar) {
        this.dom.progressBar.style.width = `${metrics.progressPercent || 0}%`;
      }
    }

    showResultsModal(metrics) {
      const modal = this.dom.resultsModal;
      if (!modal) return;
      modal.classList.remove('hidden');

      document.getElementById('modal-final-wpm').textContent = metrics.wpm;
      document.getElementById('modal-raw-wpm').textContent = metrics.rawWpm;
      document.getElementById('modal-accuracy').textContent = `${metrics.accuracy}%`;
      document.getElementById('modal-consistency').textContent = `${metrics.consistency}%`;
      document.getElementById('modal-chars').textContent = `${metrics.correctChars}/${metrics.totalKeystrokes}`;
      document.getElementById('modal-time').textContent = `${metrics.elapsedSeconds}s`;

      const tierElem = document.getElementById('modal-tier');
      if (tierElem) {
        tierElem.textContent = `${metrics.tier.badge} ${metrics.tier.title}`;
        tierElem.style.color = metrics.tier.color;
      }

      const weakListElem = document.getElementById('modal-weak-keys');
      if (weakListElem) {
        weakListElem.innerHTML = '';
        if (metrics.weakKeys && metrics.weakKeys.length > 0) {
          metrics.weakKeys.forEach(k => {
            const chip = document.createElement('span');
            chip.className = 'weak-chip';
            chip.innerHTML = `<strong>${k.key.toUpperCase()}</strong>: ${k.errors} err (${k.accuracy}%)`;
            weakListElem.appendChild(chip);
          });
          document.getElementById('modal-weak-container')?.classList.remove('hidden');
        } else {
          document.getElementById('modal-weak-container')?.classList.add('hidden');
        }
      }

      this.drawSpeedChart(this.engine.wpmSamples);
    }

    drawSpeedChart(samples) {
      const canvas = this.dom.resultsCanvas;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth || 500;
      const height = canvas.clientHeight || 180;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      if (!samples || samples.length < 2) {
        ctx.fillStyle = '#64748b';
        ctx.font = '14px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('More data will appear on longer sessions.', width / 2, height / 2);
        return;
      }

      const padding = { top: 20, right: 25, bottom: 30, left: 45 };
      const chartW = width - padding.left - padding.right;
      const chartH = height - padding.top - padding.bottom;
      const maxWpm = Math.max(...samples.map(s => Math.max(s.wpm, s.rawWpm)), 40) * 1.15;
      const maxTime = Math.max(...samples.map(s => s.time), 1);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.font = '11px monospace';
      ctx.fillStyle = '#64748b';
      ctx.textAlign = 'right';

      for (let i = 0; i <= 4; i++) {
        const yVal = Math.round((maxWpm / 4) * i);
        const y = padding.top + chartH - ((yVal / maxWpm) * chartH);
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();
        ctx.fillText(`${yVal}`, padding.left - 8, y + 4);
      }

      const getX = (t) => padding.left + ((t / maxTime) * chartW);
      const getY = (val) => padding.top + chartH - ((val / maxWpm) * chartH);

      ctx.strokeStyle = '#64748b';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      samples.forEach((s, i) => {
        const x = getX(s.time);
        const y = getY(s.rawWpm);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.strokeStyle = '#10ff50';
      ctx.lineWidth = 3;
      ctx.beginPath();
      samples.forEach((s, i) => {
        const x = getX(s.time);
        const y = getY(s.wpm);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
      gradient.addColorStop(0, 'rgba(16, 255, 80, 0.25)');
      gradient.addColorStop(1, 'rgba(16, 255, 80, 0.0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(getX(samples[0].time), getY(samples[0].wpm));
      samples.forEach(s => ctx.lineTo(getX(s.time), getY(s.wpm)));
      ctx.lineTo(getX(samples[samples.length - 1].time), padding.top + chartH);
      ctx.lineTo(getX(samples[0].time), padding.top + chartH);
      ctx.closePath();
      ctx.fill();

      samples.forEach(s => {
        const x = getX(s.time);
        const y = getY(s.wpm);
        ctx.fillStyle = '#10ff50';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    renderCurriculumUI() {
      const container = this.dom.curriculumList;
      if (!container) return;
      container.innerHTML = '';

      const progress = StorageManager.getLessonProgress();

      CURRICULUM.forEach(stage => {
        const stageBox = document.createElement('div');
        stageBox.className = 'curriculum-stage';

        const stageHeader = document.createElement('div');
        stageHeader.className = 'stage-header';
        stageHeader.innerHTML = `
          <div class="stage-title">${stage.title}</div>
          <div class="stage-sub">${stage.description}</div>
        `;
        stageBox.appendChild(stageHeader);

        const lessonGrid = document.createElement('div');
        lessonGrid.className = 'lesson-grid';

        stage.lessons.forEach(lesson => {
          const card = document.createElement('div');
          card.className = 'lesson-card';
          card.id = `lesson-card-${lesson.id}`;

          const data = progress[lesson.id];
          const isCompleted = data && data.completed;
          const stars = data ? data.stars : 0;

          let starHtml = '';
          for (let i = 1; i <= 3; i++) {
            starHtml += `<span class="star ${i <= stars ? 'earned' : 'empty'}">★</span>`;
          }

          card.innerHTML = `
            <div class="l-card-top">
              <span class="l-card-title">${lesson.title}</span>
              <div class="l-stars">${starHtml}</div>
            </div>
            <div class="l-card-bottom">
              <span>Goal: ${lesson.targetWpm} WPM</span>
              ${isCompleted ? `<span class="l-best">Best: ${data.bestWpm} WPM</span>` : ''}
            </div>
          `;

          card.addEventListener('click', () => {
            this.switchMode('lesson');
            this.loadLesson(lesson);
          });

          lessonGrid.appendChild(card);
        });

        stageBox.appendChild(lessonGrid);
        container.appendChild(stageBox);
      });
    }

    updateActiveLessonUI(lessonId) {
      document.querySelectorAll('.lesson-card').forEach(card => {
        card.classList.toggle('active', card.id === `lesson-card-${lessonId}`);
      });
    }
  }

  // ==========================================
  // 8. ROBUST BOOTSTRAPPER (file:// and http://)
  // ==========================================
  function bootstrap() {
    if (!window.typerApp) {
      window.typerApp = new TypingTutorApp();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})();
