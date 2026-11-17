/**
 * hands.js - Anatomical Hand Guides & Finger Position Indicator.
 * Renders ergonomic SVG hands and highlights active fingers in real-time.
 */

import { FINGER_COLORS } from './keyboard.js';

export class HandVisualizer {
  constructor(containerElement) {
    this.container = containerElement;
    this.currentFinger = null;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="hands-wrapper">
        <!-- Left Hand -->
        <div class="hand-box hand-left" id="hand-left">
          <div class="hand-title">Left Hand</div>
          <svg class="hand-svg" viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg">
            <g class="hand-outline">
              <!-- Palm base -->
              <path class="palm" d="M 40 140 C 40 190, 70 210, 100 210 C 130 210, 160 190, 160 140 Z" />
              
              <!-- Pinky (leftmost) -->
              <path id="finger-left-pinky" class="finger-path" 
                data-finger="left-pinky"
                d="M 35 140 C 30 110, 25 70, 35 45 C 45 45, 52 65, 52 130 Z" />
              
              <!-- Ring -->
              <path id="finger-left-ring" class="finger-path" 
                data-finger="left-ring"
                d="M 56 128 C 55 90, 52 40, 68 20 C 82 20, 80 50, 80 125 Z" />
              
              <!-- Middle -->
              <path id="finger-left-middle" class="finger-path" 
                data-finger="left-middle"
                d="M 84 125 C 84 75, 85 25, 100 10 C 115 25, 112 75, 112 125 Z" />
              
              <!-- Index -->
              <path id="finger-left-index" class="finger-path" 
                data-finger="left-index"
                d="M 116 128 C 118 75, 120 40, 134 25 C 148 40, 142 85, 140 135 Z" />
              
              <!-- Thumb -->
              <path id="finger-left-thumb" class="finger-path thumb-path" 
                data-finger="thumb"
                d="M 145 140 C 160 120, 175 110, 185 125 C 190 145, 170 170, 155 175 Z" />
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

        <!-- Realtime Guidance Chip -->
        <div class="hand-guide-instruction" id="hand-guide-instruction">
          <div class="guide-badge">READY</div>
          <div class="guide-text">Rest fingers on <strong>F</strong> and <strong>J</strong> home bumps</div>
        </div>

        <!-- Right Hand -->
        <div class="hand-box hand-right" id="hand-right">
          <div class="hand-title">Right Hand</div>
          <svg class="hand-svg" viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg">
            <g class="hand-outline">
              <!-- Palm base -->
              <path class="palm" d="M 40 140 C 40 190, 70 210, 100 210 C 130 210, 160 190, 160 140 Z" />
              
              <!-- Thumb (leftmost on right hand) -->
              <path id="finger-right-thumb" class="finger-path thumb-path" 
                data-finger="thumb"
                d="M 55 140 C 40 120, 25 110, 15 125 C 10 145, 30 170, 45 175 Z" />

              <!-- Index -->
              <path id="finger-right-index" class="finger-path" 
                data-finger="right-index"
                d="M 60 135 C 58 85, 52 40, 66 25 C 80 40, 82 75, 84 128 Z" />

              <!-- Middle -->
              <path id="finger-right-middle" class="finger-path" 
                data-finger="right-middle"
                d="M 88 125 C 88 75, 85 25, 100 10 C 115 25, 116 75, 116 125 Z" />

              <!-- Ring -->
              <path id="finger-right-ring" class="finger-path" 
                data-finger="right-ring"
                d="M 120 125 C 120 50, 118 20, 132 20 C 148 40, 145 90, 144 128 Z" />

              <!-- Pinky -->
              <path id="finger-right-pinky" class="finger-path" 
                data-finger="right-pinky"
                d="M 148 130 C 148 65, 155 45, 165 45 C 175 70, 170 110, 165 140 Z" />
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

  /**
   * Highlights the active finger for the upcoming key.
   * @param {object|null} keyInfo Returned from KEY_MAP (includes finger, hand, label, needsShift)
   * @param {string} expectedChar The char to type
   */
  highlightFinger(keyInfo, expectedChar) {
    // Clear previous active states
    this.fingerPaths.forEach(p => {
      p.classList.remove('finger-active');
      p.style.fill = '';
      p.style.stroke = '';
      p.style.filter = '';
    });

    if (!keyInfo) {
      if (this.instructionBadge) {
        this.instructionBadge.textContent = 'DONE';
        this.instructionBadge.style.backgroundColor = '#10b981';
        this.instructionText.innerHTML = 'Session Complete! Great work.';
      }
      return;
    }

    const { finger, fingerName, hand, needsShift, shiftKey } = keyInfo;
    const color = FINGER_COLORS[finger] || '#3b82f6';

    // Find and light up finger element(s)
    const activeFingerPaths = this.container.querySelectorAll(`[data-finger="${finger}"]`);
    activeFingerPaths.forEach(path => {
      // If finger is 'thumb', highlight both or preferred thumb
      if (finger === 'thumb' || (hand === 'left' && path.id.includes('left')) || (hand === 'right' && path.id.includes('right'))) {
        path.classList.add('finger-active');
        path.style.fill = color;
        path.style.stroke = '#ffffff';
        path.style.filter = `drop-shadow(0 0 10px ${color})`;
      }
    });

    // If shift is needed, also highlight the shift finger!
    if (needsShift) {
      const shiftFingerId = shiftKey === 'ShiftRight' ? 'finger-right-pinky' : 'finger-left-pinky';
      const shiftPath = document.getElementById(shiftFingerId);
      if (shiftPath) {
        shiftPath.classList.add('finger-active');
        shiftPath.style.fill = '#ec4899';
        shiftPath.style.filter = 'drop-shadow(0 0 10px #ec4899)';
      }
    }

    // Update real-time prompt instruction
    if (this.instructionBadge && this.instructionText) {
      const displayKey = expectedChar === ' ' ? 'SPACEBAR' : (expectedChar === '\n' ? 'ENTER' : expectedChar);
      this.instructionBadge.textContent = fingerName.toUpperCase();
      this.instructionBadge.style.backgroundColor = color;

      let msg = `Use <span class="guide-highlight" style="color: ${color}">${fingerName}</span> for key <strong>[${displayKey}]</strong>`;
      if (needsShift) {
        const oppShiftHand = shiftKey === 'ShiftRight' ? 'Right Pinky (Right Shift)' : 'Left Pinky (Left Shift)';
        msg += ` <span class="shift-hint">+ Hold ${oppShiftHand}</span>`;
      }
      this.instructionText.innerHTML = msg;
    }
  }
}
