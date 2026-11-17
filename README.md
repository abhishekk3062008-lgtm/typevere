# ⌨️ TypePro — Professional Touch Typing Tutor

**TypePro** is a modern, high-performance touch-typing tutor designed to train you from absolute basics to typing like a professional software engineer or writer (80–120+ WPM).

---

## 🌟 Why TypePro Teaches Professional Typing

Professional typing is not about frantically mashing keys; it is built on five core pillars:
1. **Never Looking Down**: Placing index fingers on the tactile bumps (**F** and **J**) and navigating entirely by tactile muscle memory.
2. **Strict Finger Boundaries**: Every key on the keyboard is mapped to a specific finger (Pinky, Ring, Middle, Index, Thumb).
3. **The Opposite Shift Hand Rule**: Holding the opposite Shift key when typing uppercase letters (e.g., Left Shift for right-hand keys, Right Shift for left-hand keys).
4. **Cadence & Rhythm**: Keeping smooth, steady keystroke intervals rather than bursting and stumbling.
5. **Adaptive Weak-Key Elimination**: Finding the keys you hesitate on or miss most often, and drilling them until they become second nature.

---

## 🚀 Key Features

- **High-Performance Typing Engine (`js/engine.js`)**:
  - Computes international standard typing metrics: **Net WPM**, **Gross (Raw) WPM**, **Accuracy %**, **CPM** (Characters Per Minute), and **Consistency %**.
  - Tracks keystroke latency down to the millisecond.
  - Automatically identifies weak keys and generates targeted practice strings.

- **Synthesized Audio Engine with Ben 10 Omnitrix SFX (`js/sound.js`)**:
  - Built with pure **Web Audio API** oscillators, filters, and noise envelopes. Zero external audio downloads, 0ms audio latency!
  - Profiles:
    - ⚡ **Ben 10 Omnitrix (Hero Time!)**:
      - **Dial Rotation Click**: Sci-fi alien selection ring chirp for every keystroke.
      - **Omnitrix Core Slam-Down**: Deep sub-impact and metallic latch lock when hitting the Spacebar.
      - **Core Pop-Up**: High-tech rising 3-tone electronic surge on session start.
      - **Red Timeout Warning**: Classic red flashing alarm double-beep on mistyped keys.
      - **Alien Transformation Flash & Voice**: Full rising laser power sweep, green sonic burst, triumphant chord, and voice callout (*"It's Hero Time!", "Heatblast!", "Diamondhead!", "Four Arms!", "XLR8!"*) on test completion.
    - **Cherry MX Blue** (Crisp tactile snap)
    - **Gateron / Holy Panda "Thock"** (Deep, lubricated linear clack)
    - **Vintage Typewriter** (Mechanical strike)
    - **Modern Bubble Pop** (Soft pops)
    - **Muted**

- **Anatomical Hand & Virtual Keyboard Guides (`js/hands.js` & `js/keyboard.js`)**:
  - Live SVG hands highlighting which finger to use for every upcoming key.
  - Tactile home bump indicators on **F** and **J**.
  - Color-coded finger zones across the keyboard.
  - Mistake **Heatmap Overlay** visualizing where your errors cluster on the physical keyboard.

- **6-Stage Progressive Touch-Typing Curriculum (`js/lessons.js`)**:
  - **Stage 1: Home Row Foundation** (F/J tactile anchors, D/K middle, S/L ring, A/; pinkies, G/H reaches, home row words)
  - **Stage 2: Top Row Reaches** (Core vowels E/I, upward index R/U, far reaches T/Y, ring & pinkies W/O/Q/P)
  - **Stage 3: Bottom Row Reaches** (V/M, C/comma, X/period, Z/slash, B/N, full pangrams)
  - **Stage 4: Capitalization & Shift Mastery** (Opposite shift hand coordination)
  - **Stage 5: Numbers & Common Symbols** (Number row 1–0, punctuation, developer symbols `{ } [ ] ( ) < > = + * &`)
  - **Stage 6: Professional Mastery** (Top 100/300 high-frequency words, JavaScript syntax, Python algorithms, business prose, literature quotes)

- **Multiple Training Modes**:
  - 📚 **Guided Curriculum**: Structured lessons with 1–3 star ratings based on WPM & accuracy.
  - ⏱️ **Speed Test**: 15s, 30s, 60s, 120s standardized benchmarks.
  - 📝 **Word Sprint**: 10, 25, 50, 100 word sprints.
  - 🎯 **Weak Keys Workout**: Adaptive drill targeting your specific weak keys.
  - ✏️ **Custom Text**: Practice any code file, book excerpt, or essay.

- **Post-Session Analytics & WPM Velocity Chart**:
  - Interactive HTML5 canvas graph illustrating your WPM acceleration curve over time.
  - Detailed breakdown of correct vs incorrect keystrokes, accuracy, and consistency.
  - Skill Tier Badges: *Novice*, *Developing*, *Intermediate*, *Fluent*, *Professional (80+ WPM)*, *Master (100+ WPM)*, *Godlike (120+ WPM)*.

- **6 Beautiful Color Themes**:
  - **Ben 10 Omnitrix HUD** (Neon radioactive alien green & deep obsidian black)
  - **Cyberpunk Neon**
  - **Matrix Terminal**
  - **Nordic Frost**
  - **Dark Obsidian**
  - **Clean Light**

- **Zero-Dependency & 100% Offline**:
  - Runs in any modern browser without needing `npm install` or external servers.
  - Saves your progress and high scores in `localStorage`.

---

## 🏃 Quick Start

### Option A: Double-Click (Windows)
Double-click [`launch.bat`](file:///c:/Users/Abhishek/OneDrive/Desktop/type/launch.bat) to start the local server and open TypePro in your default browser.

### Option B: Python Server
Open terminal in this directory and run:
```bash
python server.py
```
Then visit `http://localhost:8080`.

### Option C: Direct Browser Open
Double-click [`index.html`](file:///c:/Users/Abhishek/OneDrive/Desktop/type/index.html) in Windows Explorer to open it directly in Chrome, Edge, Firefox, or Brave.
