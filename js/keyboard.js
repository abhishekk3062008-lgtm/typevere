/**
 * keyboard.js - Interactive Virtual Keyboard with Anatomical Finger Mapping,
 * Real-time Active Key Lighting, Keypress Animation, and Heatmap Overlays.
 */

// Finger color tokens mapping
export const FINGER_COLORS = {
  'left-pinky': '#ec4899',   // Magenta / Pink
  'left-ring': '#8b5cf6',    // Purple / Violet
  'left-middle': '#3b82f6',  // Blue
  'left-index': '#06b6d4',   // Cyan / Teal
  'thumb': '#10b981',        // Emerald Green
  'right-index': '#eab308',  // Yellow / Amber
  'right-middle': '#f97316', // Orange
  'right-ring': '#ef4444',   // Red / Coral
  'right-pinky': '#d946ef'   // Fuchsia
};

// Character to key code and primary finger assignment
export const KEY_MAP = {
  // Number row
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

  // Top letter row
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
  '\\': { code: 'Backslash', label: '\\', shift: '|', finger: 'right-pinky', hand: 'right', fingerName: 'Right Pinky' },
  '|': { code: 'Backslash', label: '\\', shift: '|', finger: 'right-pinky', hand: 'right', fingerName: 'Right Pinky', needsShift: true, shiftKey: 'ShiftLeft' },

  // Home row
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

  // Bottom row
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

  // Control keys & Space
  ' ': { code: 'Space', label: 'Space', finger: 'thumb', hand: 'both', fingerName: 'Thumb' },
  '\n': { code: 'Enter', label: 'Enter ↵', finger: 'right-pinky', hand: 'right', fingerName: 'Right Pinky' }
};

// Physical keyboard layout definition
export const KEYBOARD_LAYOUT = [
  // Row 1: Numbers & symbols
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
  // Row 2: Top letters
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
  // Row 3: Home row
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
  // Row 4: Bottom row
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
  // Row 5: Spacebar & Modifiers
  [
    { code: 'ControlLeft', label: 'Ctrl', width: 'w-mod', finger: 'left-pinky' },
    { code: 'AltLeft', label: 'Alt', width: 'w-mod', finger: 'left-ring' },
    { code: 'Space', label: 'Space', width: 'w-space', finger: 'thumb' },
    { code: 'AltRight', label: 'Alt', width: 'w-mod', finger: 'right-ring' },
    { code: 'ControlRight', label: 'Ctrl', width: 'w-mod', finger: 'right-pinky' }
  ]
];

export class VirtualKeyboard {
  constructor(containerElement, options = {}) {
    this.container = containerElement;
    this.options = {
      showFingerColors: true,
      showHeatmap: false,
      ...options
    };

    this.activeKeyElements = new Set();
    this.keyElementsMap = new Map(); // code -> element
    this.render();
  }

  /**
   * Generates DOM structure for the virtual keyboard.
   */
  render() {
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
        keyElem.dataset.finger = key.finger;

        // Visual tactile home bumps on F and J
        if (key.bump) {
          keyElem.classList.add('has-bump');
          const bumpIndicator = document.createElement('span');
          bumpIndicator.className = 'home-bump';
          keyElem.appendChild(bumpIndicator);
        }

        // Shift secondary label (e.g. ! on 1)
        if (key.shift) {
          const shiftSpan = document.createElement('span');
          shiftSpan.className = 'key-shift-label';
          shiftSpan.textContent = key.shift;
          keyElem.appendChild(shiftSpan);
        }

        // Primary label
        const mainSpan = document.createElement('span');
        mainSpan.className = 'key-main-label';
        mainSpan.textContent = key.label;
        keyElem.appendChild(mainSpan);

        // Finger color accent dot
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

  /**
   * Highlights the key(s) needed for the next expected character.
   * Handles Shift keys when capitalization or shifted symbols are needed.
   * @param {string} char The next expected character
   * @returns {object|null} Key info including finger and hand
   */
  highlightTarget(char) {
    // Clear previous target highlights
    this.keyElementsMap.forEach(elem => {
      elem.classList.remove('target-active', 'shift-target-active');
    });

    if (!char) return null;

    const keyInfo = KEY_MAP[char];
    if (!keyInfo) return null;

    // Highlight target key
    const targetElem = this.keyElementsMap.get(keyInfo.code);
    if (targetElem) {
      targetElem.classList.add('target-active');
    }

    // If shift is needed, also highlight the appropriate Shift key!
    if (keyInfo.needsShift && keyInfo.shiftKey) {
      const shiftElem = this.keyElementsMap.get(keyInfo.shiftKey);
      if (shiftElem) {
        shiftElem.classList.add('shift-target-active');
      }
    }

    return keyInfo;
  }

  /**
   * Triggers realistic physical key-press animation when user strikes a physical key.
   * @param {string} code KeyboardEvent.code (e.g., 'KeyF', 'Space')
   */
  animateKeyPress(code) {
    const elem = this.keyElementsMap.get(code);
    if (!elem) return;

    elem.classList.add('pressed');
    setTimeout(() => {
      elem.classList.remove('pressed');
    }, 120);
  }

  /**
   * Applies heatmap error intensity coloring to each key.
   * @param {object} heatmapData Map of char/key -> { errorRate, intensity }
   */
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

  /**
   * Toggles finger color visualization.
   */
  toggleFingerColors(enabled) {
    this.options.showFingerColors = enabled;
    if (enabled) {
      this.container.classList.remove('hide-finger-colors');
    } else {
      this.container.classList.add('hide-finger-colors');
    }
  }
}
