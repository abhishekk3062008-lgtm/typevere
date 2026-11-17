/**
 * app.js - Main Application Orchestrator for the Professional Touch-Typing Tutor.
 * Coordinates the typing engine, audio synthesis, virtual keyboard, anatomical hands,
 * progress tracking, canvas analytics charts, and UI viewports.
 */

import { TypingEngine } from './engine.js';
import { SoundEngine } from './sound.js';
import { VirtualKeyboard, KEY_MAP } from './keyboard.js';
import { HandVisualizer } from './hands.js';
import { StorageManager } from './storage.js';
import { CURRICULUM, getRandomWords } from './lessons.js';

export class TypingTutorApp {
  constructor() {
    this.engine = null;
    this.sound = new SoundEngine();
    this.keyboard = null;
    this.hands = null;
    this.settings = StorageManager.getSettings();

    // Active state
    this.activeMode = 'lesson'; // 'lesson' | 'timed' | 'words' | 'weak' | 'custom'
    this.activeLesson = null;
    this.activeTimedDuration = 60;
    this.activeWordCount = 50;
    this.currentText = '';

    // DOM Elements Cache
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
      volumeSlider: document.getElementById('volume-slider'),
      weakKeyBadgeList: document.getElementById('weak-keys-badge-list')
    };

    this.init();
  }

  init() {
    // Apply initial settings
    this.applyTheme(this.settings.theme);
    this.sound.setSoundType(this.settings.soundType);
    this.sound.setVolume(this.settings.volume);

    // Initialize sub-components
    this.keyboard = new VirtualKeyboard(this.dom.keyboardContainer, {
      showFingerColors: this.settings.showFingerColors
    });
    this.hands = new HandVisualizer(this.dom.handsContainer);

    // Instantiate typing engine
    this.engine = new TypingEngine({
      strictMode: this.settings.strictMode,
      onStart: (metrics) => this.handleEngineStart(metrics),
      onKeystroke: (data) => this.handleEngineKeystroke(data),
      onTick: (metrics) => this.handleEngineTick(metrics),
      onComplete: (metrics) => this.handleEngineComplete(metrics)
    });

    // Populate curriculum list
    this.renderCurriculumUI();

    // Bind event listeners
    this.bindEvents();

    // Default to First Lesson: Stage 1, Lesson 1
    const firstLesson = CURRICULUM[0].lessons[0];
    this.loadLesson(firstLesson);
  }

  /**
   * Sets up all DOM, keyboard, and mode event bindings.
   */
  bindEvents() {
    // Focus capture: clicking anywhere on typing area focuses the hidden input
    const typingArea = document.getElementById('typing-viewport');
    typingArea.addEventListener('click', () => {
      this.dom.hiddenInput.focus();
    });

    // Capture user keystrokes
    window.addEventListener('keydown', (e) => this.handleKeyDown(e));

    // Mode Selector Buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mode = btn.dataset.mode;
        this.switchMode(mode);
      });
    });

    // Timed sub-options (15s, 30s, 60s, 120s)
    document.querySelectorAll('.timed-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.timed-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeTimedDuration = parseInt(btn.dataset.time, 10);
        this.startTimedSession(this.activeTimedDuration);
      });
    });

    // Word count sub-options (10, 25, 50, 100)
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

    // Toggle Hands visibility
    const toggleHandsBtn = document.getElementById('toggle-hands-btn');
    if (toggleHandsBtn) {
      toggleHandsBtn.addEventListener('click', () => {
        const isHidden = this.dom.handsContainer.classList.toggle('hidden');
        toggleHandsBtn.classList.toggle('active', !isHidden);
      });
    }

    // Toggle Keyboard visibility
    const toggleKbBtn = document.getElementById('toggle-keyboard-btn');
    if (toggleKbBtn) {
      toggleKbBtn.addEventListener('click', () => {
        const isHidden = this.dom.keyboardContainer.classList.toggle('hidden');
        toggleKbBtn.classList.toggle('active', !isHidden);
      });
    }

    // Toggle Heatmap
    const toggleHeatmapBtn = document.getElementById('toggle-heatmap-btn');
    if (toggleHeatmapBtn) {
      toggleHeatmapBtn.addEventListener('click', () => {
        const active = toggleHeatmapBtn.classList.toggle('active');
        if (active) {
          const heatmap = this.engine.getKeyHeatmap();
          this.keyboard.applyHeatmap(heatmap);
        } else {
          this.keyboard.applyHeatmap(null);
        }
      });
    }

    // Reset / Restart session button
    document.getElementById('restart-btn').addEventListener('click', () => {
      this.restartCurrentSession();
    });

    // Custom text modal trigger & confirm
    const customTextModal = document.getElementById('custom-text-modal');
    document.getElementById('load-custom-btn')?.addEventListener('click', () => {
      customTextModal.classList.remove('hidden');
      document.getElementById('custom-text-input').focus();
    });
    document.getElementById('custom-modal-cancel')?.addEventListener('click', () => {
      customTextModal.classList.add('hidden');
    });
    document.getElementById('custom-modal-start')?.addEventListener('click', () => {
      const text = document.getElementById('custom-text-input').value.trim();
      if (text.length > 0) {
        customTextModal.classList.add('hidden');
        this.startCustomTextSession(text);
      }
    });

    // Modal Results buttons
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
    });

    // Test Sound Button
    const testSoundBtn = document.getElementById('test-sound-btn');
    if (testSoundBtn) {
      testSoundBtn.addEventListener('click', () => {
        if (this.sound.soundType === 'omnitrix') {
          this.sound.playOmnitrixTransform();
        } else {
          this.sound.playKey(true, ' ');
        }
      });
    }

    // Omnitrix Interactive Badge Click (Triggers Transformation & Hero Time Voice)
    const omnitrixBadge = document.getElementById('omnitrix-badge');
    if (omnitrixBadge) {
      omnitrixBadge.addEventListener('click', () => {
        omnitrixBadge.classList.add('slammed');
        setTimeout(() => omnitrixBadge.classList.remove('slammed'), 250);
        this.sound.playOmnitrixTransform();
      });
    }

    // Pro Tips Guide modal
    const tipsModal = document.getElementById('tips-modal');
    document.getElementById('tips-btn')?.addEventListener('click', () => {
      tipsModal.classList.remove('hidden');
    });
    document.getElementById('tips-modal-close')?.addEventListener('click', () => {
      tipsModal.classList.add('hidden');
    });
  }

  /**
   * Applies and persists theme palette.
   */
  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.settings.theme = theme;
    StorageManager.saveSettings(this.settings);
  }

  /**
   * Keyboard input interceptor.
   */
  handleKeyDown(e) {
    // Ignore key combinations with Ctrl, Alt, Command (except shortcuts like Ctrl+R or Alt+Tab)
    if (e.ctrlKey || e.altKey || e.metaKey) {
      if (e.key === 'r' && e.ctrlKey) return; // allow browser refresh
      return;
    }

    // Ignore if typing in textareas or inputs in modals
    if (e.target.tagName === 'TEXTAREA' || (e.target.tagName === 'INPUT' && e.target.id !== 'hidden-input')) {
      return;
    }

    // Ignore Tab and Escape unless handled
    if (e.key === 'Tab') {
      e.preventDefault();
      this.restartCurrentSession();
      return;
    }

    if (e.key === 'Escape') {
      this.dom.resultsModal.classList.add('hidden');
      document.getElementById('tips-modal').classList.add('hidden');
      document.getElementById('custom-text-modal').classList.add('hidden');
      return;
    }

    // Handle spacebar scroll prevention
    if (e.key === ' ') {
      e.preventDefault();
    }

    // Animate visual keypress
    this.keyboard.animateKeyPress(e.code);

    // Animate Omnitrix Dial rotation & slam
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

    // Process key in engine
    const res = this.engine.handleKey(e.key);
    if (!res) return;

    // Trigger mechanical sound feedback
    if (res.backspaced) {
      this.sound.playKey(true, 'Backspace');
    } else if (res.keystroke) {
      this.sound.playKey(res.keystroke.correct, res.keystroke.key);
    }
  }

  /**
   * Loads a specific curriculum lesson.
   */
  loadLesson(lesson) {
    this.activeMode = 'lesson';
    this.activeLesson = lesson;

    // Update Banner
    this.dom.lessonInfoBanner.classList.remove('hidden');
    this.dom.lessonTitle.textContent = lesson.title;
    this.dom.lessonDesc.textContent = lesson.instruction;
    this.dom.lessonTarget.innerHTML = `Target: <strong>${lesson.targetWpm} WPM</strong> | Min Accuracy: <strong>${lesson.minAccuracy}%</strong>`;

    this.setupSession(lesson.text, { mode: 'lesson' });
    this.updateActiveLessonUI(lesson.id);
  }

  /**
   * Advances to next lesson in the curriculum.
   */
  loadNextLesson() {
    if (!this.activeLesson) return;
    
    // Find current index
    let currentStageIndex = 0;
    let currentLessonIndex = 0;
    
    CURRICULUM.forEach((stage, sIdx) => {
      stage.lessons.forEach((l, lIdx) => {
        if (l.id === this.activeLesson.id) {
          currentStageIndex = sIdx;
          currentLessonIndex = lIdx;
        }
      });
    });

    const currentStage = CURRICULUM[currentStageIndex];
    if (currentLessonIndex + 1 < currentStage.lessons.length) {
      this.loadLesson(currentStage.lessons[currentLessonIndex + 1]);
    } else if (currentStageIndex + 1 < CURRICULUM.length) {
      this.loadLesson(CURRICULUM[currentStageIndex + 1].lessons[0]);
    } else {
      // Reached the very end of curriculum!
      this.loadLesson(CURRICULUM[0].lessons[0]);
    }
  }

  /**
   * Mode switching controller.
   */
  switchMode(mode) {
    this.activeMode = mode;

    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === mode);
    });

    document.getElementById('timed-options').classList.toggle('hidden', mode !== 'timed');
    document.getElementById('words-options').classList.toggle('hidden', mode !== 'words');
    this.dom.curriculumDrawer.classList.toggle('hidden', mode !== 'lesson');
    this.dom.lessonInfoBanner.classList.toggle('hidden', mode !== 'lesson');

    if (mode === 'timed') {
      this.startTimedSession(this.activeTimedDuration);
    } else if (mode === 'words') {
      this.startWordSession(this.activeWordCount);
    } else if (mode === 'weak') {
      this.startWeakKeySession();
    } else if (mode === 'custom') {
      document.getElementById('custom-text-modal').classList.remove('hidden');
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

    // Update banner for weak key drill
    this.dom.lessonInfoBanner.classList.remove('hidden');
    this.dom.lessonTitle.textContent = 'Targeted Weak Key Workout';
    this.dom.lessonDesc.textContent = `Adaptive drill focused on your current problem keys: [ ${combined.join(', ').toUpperCase()} ]`;
    this.dom.lessonTarget.innerHTML = `Target: <strong>Eliminate errors</strong> and smooth out rhythm.`;
  }

  startCustomTextSession(text) {
    this.setupSession(text, { mode: 'custom' });
    this.dom.lessonInfoBanner.classList.remove('hidden');
    this.dom.lessonTitle.textContent = 'Custom Practice Text';
    this.dom.lessonDesc.textContent = 'Personalized drill from your pasted passage or code snippet.';
    this.dom.lessonTarget.innerHTML = `Target: <strong>Clean, steady rhythm</strong>`;
  }

  restartCurrentSession() {
    this.setupSession(this.currentText, this.engine.options);
  }

  /**
   * Sets up text, renders character DOM, and resets metrics.
   */
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

    // Update keyboard and hand guides for the initial first character
    this.updateGuidesForNextChar();

    // Ensure hidden input is focused
    this.dom.hiddenInput.value = '';
    this.dom.hiddenInput.focus();
  }

  /**
   * Builds the interactive character-by-character display with caret.
   */
  renderTextDisplay() {
    this.dom.textDisplay.innerHTML = '';
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
    });

    this.dom.textDisplay.appendChild(frag);
    this.positionCaret(0);
  }

  /**
   * Smoothly positions the caret above the current character.
   */
  positionCaret(index) {
    if (!this.dom.caret) return;

    if (index >= this.engine.targetChars.length) {
      // Caret at end
      const lastChar = document.getElementById(`char-${this.engine.targetChars.length - 1}`);
      if (lastChar) {
        const rect = lastChar.getBoundingClientRect();
        const parentRect = this.dom.textDisplay.getBoundingClientRect();
        this.dom.caret.style.left = `${rect.right - parentRect.left}px`;
        this.dom.caret.style.top = `${rect.top - parentRect.top}px`;
      }
      return;
    }

    const targetCharElem = document.getElementById(`char-${index}`);
    if (targetCharElem) {
      const rect = targetCharElem.getBoundingClientRect();
      const parentRect = this.dom.textDisplay.getBoundingClientRect();

      this.dom.caret.style.left = `${rect.left - parentRect.left}px`;
      this.dom.caret.style.top = `${rect.top - parentRect.top}px`;

      // Auto scroll if line wraps down
      if (rect.top - parentRect.top > 120) {
        this.dom.textDisplay.scrollTop += 32;
      }
    }
  }

  /**
   * Updates keyboard and hand visualizers for the upcoming key.
   */
  updateGuidesForNextChar() {
    const nextChar = this.engine.getCurrentTarget();
    const keyInfo = this.keyboard.highlightTarget(nextChar);
    this.hands.highlightFinger(keyInfo, nextChar);
  }

  // --- Engine Lifecycle Callbacks ---

  handleEngineStart(metrics) {
    this.dom.caret.classList.add('typing');
    if (this.sound.soundType === 'omnitrix') {
      this.sound.playOmnitrixPopup();
    }
  }

  handleEngineKeystroke({ keystroke, currentIndex, metrics, isFinished }) {
    // Update character spans visually
    for (let i = 0; i < this.engine.targetChars.length; i++) {
      const span = document.getElementById(`char-${i}`);
      if (!span) continue;

      const input = this.engine.userInputs[i];
      if (input === null || input === undefined) {
        span.className = 'char pending' + (this.engine.targetChars[i] === ' ' ? ' char-space' : '');
      } else if (input.correct) {
        span.className = 'char correct' + (this.engine.targetChars[i] === ' ' ? ' char-space' : '');
      } else {
        span.className = 'char incorrect' + (this.engine.targetChars[i] === ' ' ? ' char-space' : '');
      }
    }

    // Advance caret
    this.positionCaret(currentIndex);

    // Update real-time guides
    this.updateGuidesForNextChar();

    // Update live metrics dashboard
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
    this.dom.caret.classList.remove('typing');

    // Ben 10 Omnitrix transformation sound + hero voice
    if (this.sound.soundType === 'omnitrix') {
      this.sound.playOmnitrixTransform();
    }

    // Record stats and unlock progress
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

    // Display Comprehensive Results Modal
    this.showResultsModal(metrics);
  }

  /**
   * Refreshes header live stats display.
   */
  updateStatsUI(metrics) {
    this.dom.liveWpm.textContent = metrics.wpm || 0;
    this.dom.liveAcc.textContent = `${metrics.accuracy || 100}%`;
    this.dom.liveConsistency.textContent = `${metrics.consistency || 100}%`;
    
    if (this.dom.progressBar) {
      this.dom.progressBar.style.width = `${metrics.progressPercent || 0}%`;
    }
  }

  /**
   * Renders the Results modal with speed graph and weak key intelligence.
   */
  showResultsModal(metrics) {
    const modal = this.dom.resultsModal;
    modal.classList.remove('hidden');

    // Populate metric badges
    document.getElementById('modal-final-wpm').textContent = metrics.wpm;
    document.getElementById('modal-raw-wpm').textContent = metrics.rawWpm;
    document.getElementById('modal-accuracy').textContent = `${metrics.accuracy}%`;
    document.getElementById('modal-consistency').textContent = `${metrics.consistency}%`;
    document.getElementById('modal-chars').textContent = `${metrics.correctChars}/${metrics.totalKeystrokes}`;
    document.getElementById('modal-time').textContent = `${metrics.elapsedSeconds}s`;

    // Proficiency tier
    const tierElem = document.getElementById('modal-tier');
    tierElem.textContent = `${metrics.tier.badge} ${metrics.tier.title}`;
    tierElem.style.color = metrics.tier.color;

    // Render Weak Keys
    const weakListElem = document.getElementById('modal-weak-keys');
    weakListElem.innerHTML = '';
    if (metrics.weakKeys && metrics.weakKeys.length > 0) {
      metrics.weakKeys.forEach(k => {
        const chip = document.createElement('span');
        chip.className = 'weak-chip';
        chip.innerHTML = `<strong>${k.key.toUpperCase()}</strong>: ${k.errors} err (${k.accuracy}%)`;
        weakListElem.appendChild(chip);
      });
      document.getElementById('modal-weak-container').classList.remove('hidden');
    } else {
      document.getElementById('modal-weak-container').classList.add('hidden');
    }

    // Draw Performance Chart on Canvas
    this.drawSpeedChart(this.engine.wpmSamples);
  }

  /**
   * Draws a clean WPM velocity curve on HTML5 canvas.
   */
  drawSpeedChart(samples) {
    const canvas = this.dom.resultsCanvas;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

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

    // Grid lines
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

    // Coordinate conversion helpers
    const getX = (t) => padding.left + ((t / maxTime) * chartW);
    const getY = (val) => padding.top + chartH - ((val / maxWpm) * chartH);

    // 1. Raw WPM dotted line
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

    // 2. Net WPM smooth solid curve
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 3;
    ctx.beginPath();
    samples.forEach((s, i) => {
      const x = getX(s.time);
      const y = getY(s.wpm);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Fill gradient below WPM curve
    const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    gradient.addColorStop(0, 'rgba(6, 182, 212, 0.25)');
    gradient.addColorStop(1, 'rgba(6, 182, 212, 0.0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(getX(samples[0].time), getY(samples[0].wpm));
    samples.forEach(s => ctx.lineTo(getX(s.time), getY(s.wpm)));
    ctx.lineTo(getX(samples[samples.length - 1].time), padding.top + chartH);
    ctx.lineTo(getX(samples[0].time), padding.top + chartH);
    ctx.closePath();
    ctx.fill();

    // Data points
    samples.forEach(s => {
      const x = getX(s.time);
      const y = getY(s.wpm);
      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  /**
   * Renders the progressive curriculum drawer with lock status and stars.
   */
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

// Bootstrap application on DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
  window.typerApp = new TypingTutorApp();
});
