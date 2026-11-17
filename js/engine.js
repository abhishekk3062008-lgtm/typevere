/**
 * TypingEngine - High-performance, professional touch-typing engine.
 * Implements international standard typing metrics (WPM, CPM, Accuracy, Consistency),
 * real-time telemetry, keystroke latency analysis, and adaptive weak-key detection.
 */
export class TypingEngine {
  constructor(options = {}) {
    this.options = {
      mode: 'lesson', // 'lesson' | 'timed' | 'words' | 'custom' | 'code'
      timeLimit: 60,   // seconds for 'timed' mode
      wordLimit: 50,   // words for 'words' mode
      strictMode: false, // if true, cannot proceed on error until corrected
      allowBackspace: true,
      blindMode: false,  // hides error colors until complete
      ...options
    };

    // Core state
    this.status = 'idle'; // 'idle' | 'running' | 'paused' | 'completed'
    this.targetText = '';
    this.targetChars = [];
    this.currentIndex = 0;
    
    // Keystroke history and logs
    this.keystrokes = []; // Array of { key, expected, correct, timestamp, latency }
    this.userInputs = []; // Array of entered characters or status per index
    this.errors = [];     // Array of { index, expected, actual, timestamp }
    this.uncorrectedErrors = 0;
    
    // Telemetry & Timing
    this.startTime = null;
    this.endTime = null;
    this.lastKeystrokeTime = null;
    this.timerInterval = null;
    this.wpmSamples = []; // Array of { time, wpm, rawWpm, acc }
    
    // Per-key statistics for weak-key intelligence
    // Format: { [char]: { attempts: 0, errors: 0, totalLatency: 0, hits: 0 } }
    this.keyStats = {};

    // Callbacks
    this.onStart = options.onStart || null;
    this.onKeystroke = options.onKeystroke || null;
    this.onTick = options.onTick || null;
    this.onComplete = options.onComplete || null;
  }

  /**
   * Initializes or resets the engine with new target text.
   * @param {string} text Target text to type
   * @param {object} customOptions Optional overrides for options
   */
  setText(text, customOptions = {}) {
    this.reset();
    if (customOptions) {
      this.options = { ...this.options, ...customOptions };
    }
    
    // Normalize newlines and spaces
    this.targetText = text.replace(/\r\n/g, '\n').trim();
    this.targetChars = Array.from(this.targetText);
    this.userInputs = new Array(this.targetChars.length).fill(null);
    return this;
  }

  /**
   * Resets all session metrics back to initial idle state.
   */
  reset() {
    this.stopTimer();
    this.status = 'idle';
    this.currentIndex = 0;
    this.keystrokes = [];
    this.userInputs = [];
    this.errors = [];
    this.uncorrectedErrors = 0;
    this.startTime = null;
    this.endTime = null;
    this.lastKeystrokeTime = null;
    this.wpmSamples = [];
    this.keyStats = {};
  }

  /**
   * Starts the typing session. Triggered automatically on first valid keystroke.
   */
  start() {
    if (this.status === 'running') return;
    this.status = 'running';
    this.startTime = performance.now();
    this.lastKeystrokeTime = this.startTime;

    // Start timer interval for live updates and graph sampling
    this.timerInterval = setInterval(() => {
      this.handleTick();
    }, 250);

    if (typeof this.onStart === 'function') {
      this.onStart(this.getMetrics());
    }
  }

  /**
   * Internal tick handler for timed modes and live speed sampling.
   */
  handleTick() {
    if (this.status !== 'running') return;

    const metrics = this.getMetrics();
    
    // Sample history roughly every second for graphing
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

    // Check time limit for timed mode
    if (this.options.mode === 'timed' && elapsedSec >= this.options.timeLimit) {
      this.finish();
      return;
    }

    if (typeof this.onTick === 'function') {
      this.onTick(metrics);
    }
  }

  /**
   * Main entry point for user keyboard input.
   * @param {string} key The key string from KeyboardEvent.key (e.g., 'a', 'A', 'Backspace', ' ')
   * @returns {object} Result of the keystroke processing
   */
  handleKey(key) {
    if (this.status === 'completed') return null;

    // Ignore modifier keys alone
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab', 'Escape'].includes(key)) {
      return null;
    }

    // Auto-start on first typing keystroke
    if (this.status === 'idle') {
      this.start();
    }

    const now = performance.now();
    const latency = this.lastKeystrokeTime ? Math.max(0, now - this.lastKeystrokeTime) : 0;
    this.lastKeystrokeTime = now;

    // Handle Backspace
    if (key === 'Backspace') {
      return this.handleBackspace();
    }

    // We reached the end of target text
    if (this.currentIndex >= this.targetChars.length) {
      return null;
    }

    const expectedChar = this.targetChars[this.currentIndex];
    const isCorrect = key === expectedChar;

    // Record key stats for weak-key intelligence
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

    // Log keystroke record
    const keystroke = {
      index: this.currentIndex,
      key,
      expected: expectedChar,
      correct: isCorrect,
      timestamp: now,
      latency
    };
    this.keystrokes.push(keystroke);

    // Save input state for rendering
    this.userInputs[this.currentIndex] = {
      char: key,
      expected: expectedChar,
      correct: isCorrect
    };

    // Advance index
    this.currentIndex++;

    // Check if test is completed
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

    return {
      keystroke,
      metrics,
      isFinished
    };
  }

  /**
   * Handles backspace keystroke.
   */
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

  /**
   * Checks if session completion criteria are satisfied.
   */
  checkCompletion() {
    if (this.options.mode === 'lesson' || this.options.mode === 'words' || this.options.mode === 'custom' || this.options.mode === 'code') {
      return this.currentIndex >= this.targetChars.length;
    }
    return false;
  }

  /**
   * Ends the session and locks final metrics.
   */
  finish() {
    if (this.status === 'completed') return this.getMetrics();
    this.status = 'completed';
    this.endTime = performance.now();
    this.stopTimer();

    // Final sample snapshot
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

  /**
   * Stops internal timer interval.
   */
  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  /**
   * Gets the character expected at current cursor position.
   */
  getCurrentTarget() {
    if (this.currentIndex < this.targetChars.length) {
      return this.targetChars[this.currentIndex];
    }
    return null;
  }

  /**
   * Calculates real-time and post-session metrics conforming to standard international typing guidelines.
   * Standard: 1 word = 5 characters.
   */
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

    // Standard Gross WPM: (Total Keystrokes / 5) / Elapsed Minutes
    const rawWpm = elapsedMinutes > 0 ? (totalKeystrokes / 5) / elapsedMinutes : 0;

    // Standard Net WPM: (Correct Characters / 5) / Elapsed Minutes
    const netWpm = elapsedMinutes > 0 ? (correctChars / 5) / elapsedMinutes : 0;

    // Characters Per Minute (CPM)
    const cpm = elapsedMinutes > 0 ? correctChars / elapsedMinutes : 0;

    // Accuracy: Correct Non-backspace Keystrokes / Total Non-backspace Keystrokes
    const nonBackspaceStrokes = correctChars + incorrectChars;
    const accuracy = nonBackspaceStrokes > 0 ? (correctChars / nonBackspaceStrokes) * 100 : 100;

    // Consistency score (0 - 100%): Measures pacing stability across keystrokes
    const consistency = this.calculateConsistency();

    // Determine performance tier
    const tier = this.getTier(netWpm);

    return {
      wpm: Math.max(0, Math.round(netWpm)),
      rawWpm: Math.max(0, Math.round(rawWpm)),
      netWpm: Number(netWpm.toFixed(1)),
      cpm: Math.round(cpm),
      accuracy: Number(accuracy.toFixed(1)),
      consistency: Math.round(consistency),
      elapsedSeconds: Number(elapsedSeconds.toFixed(1)),
      elapsedMinutes: Number(elapsedMinutes.toFixed(2)),
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

  /**
   * Computes typing consistency percentage based on keystroke latency coefficient of variation.
   */
  calculateConsistency() {
    const latencies = this.keystrokes
      .filter(k => k.key !== 'Backspace' && k.latency > 0 && k.latency < 2000)
      .map(k => k.latency);

    if (latencies.length < 5) return 100;

    const mean = latencies.reduce((a, b) => a + b, 0) / latencies.length;
    const variance = latencies.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / latencies.length;
    const stdDev = Math.sqrt(variance);

    // Coefficient of variation (CV) = stdDev / mean. Lower CV means higher consistency.
    const cv = stdDev / mean;
    const consistency = Math.max(0, Math.min(100, 100 - (cv * 35)));
    return consistency;
  }

  /**
   * Categorizes typing performance into recognized proficiency tiers.
   */
  getTier(wpm) {
    if (wpm >= 120) return { title: 'Godlike Speedster', stars: 5, color: '#f59e0b', badge: '⚡⚡⚡' };
    if (wpm >= 100) return { title: 'Master Typist', stars: 5, color: '#ec4899', badge: '🏆 Ninja' };
    if (wpm >= 80)  return { title: 'Professional Typist', stars: 4, color: '#8b5cf6', badge: '🚀 Pro' };
    if (wpm >= 60)  return { title: 'Fluent Touch Typist', stars: 3, color: '#3b82f6', badge: '✨ Fluent' };
    if (wpm >= 40)  return { title: 'Intermediate Typist', stars: 2, color: '#10b981', badge: '👍 Good' };
    if (wpm >= 20)  return { title: 'Developing Typist', stars: 1, color: '#06b6d4', badge: '🌱 Learner' };
    return { title: 'Novice Typist', stars: 1, color: '#94a3b8', badge: '🐣 Beginner' };
  }

  /**
   * Evaluates key telemetry and returns sorted list of weakest keys.
   * Considers both error frequency and average latency.
   * @param {number} limit Maximum number of weak keys to return
   */
  getWeakKeys(limit = 5) {
    const list = [];

    for (const [key, data] of Object.entries(this.keyStats)) {
      if (data.attempts < 1) continue;
      const errorRate = data.errors / data.attempts;
      const avgLatency = data.totalLatency / data.attempts;
      
      // Scoring formula: heavily penalizes errors, moderately penalizes slow keystrokes (>400ms)
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

    // Sort descending by penaltyScore
    list.sort((a, b) => b.penaltyScore - a.penaltyScore);
    return list.slice(0, limit);
  }

  /**
   * Generates a heatmap map of keys { [key]: { errorRate, count, intensity } }
   * intensity ranges from 0.0 (perfect) to 1.0 (heavy errors).
   */
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

  /**
   * Generates targeted drill strings designed to strengthen identified weak keys.
   * Combines weak keys with common vowel bridges and home-row anchors.
   * @param {string[]} weakKeyList Array of weak key characters
   * @param {number} wordCount Number of drill words to generate
   */
  static generateWeakKeyDrill(weakKeyList, wordCount = 20) {
    if (!weakKeyList || weakKeyList.length === 0) {
      weakKeyList = ['e', 't', 'a', 'o', 'i', 'n'];
    }

    const anchors = ['a', 'e', 'i', 'o', 'u', 's', 't', 'r', 'l'];
    const drills = [];

    for (let i = 0; i < wordCount; i++) {
      const target = weakKeyList[i % weakKeyList.length];
      const anchor1 = anchors[Math.floor(Math.random() * anchors.length)];
      const anchor2 = anchors[Math.floor(Math.random() * anchors.length)];
      
      const patterns = [
        `${target}${anchor1}${target}`,
        `${anchor1}${target}${anchor2}`,
        `${target}${anchor1}${target}${anchor2}`,
        `${anchor1}${target}${target}${anchor2}`,
        `${target}${target} ${anchor1}${target}`
      ];

      drills.push(patterns[i % patterns.length]);
    }

    return drills.join(' ');
  }
}
