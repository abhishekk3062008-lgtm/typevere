/**
 * storage.js - LocalStorage Persistence Manager.
 * Stores user progress, lesson stars, all-time records, settings, and aggregate weak keys.
 */

const STORAGE_KEYS = {
  SETTINGS: 'typetutor_settings_v1',
  LESSONS: 'typetutor_lessons_v1',
  STATS: 'typetutor_alltime_stats_v1',
  WEAK_KEYS: 'typetutor_weak_keys_v1'
};

const DEFAULT_SETTINGS = {
  theme: 'omnitrix', // 'omnitrix' | 'cyberpunk' | 'terminal' | 'nordic' | 'dark' | 'light'
  soundType: 'omnitrix', // 'omnitrix' | 'clicky' | 'thock' | 'typewriter' | 'pop' | 'none'
  volume: 0.40,
  showHands: true,
  showKeyboard: true,
  showFingerColors: true,
  strictMode: false,
  fontFamily: 'JetBrains Mono'
};

export class StorageManager {
  /**
   * Loads user settings or returns defaults.
   */
  static getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch (e) {
      console.warn('LocalStorage not available, falling back to defaults', e);
      return DEFAULT_SETTINGS;
    }
  }

  /**
   * Saves updated settings.
   */
  static saveSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings to localStorage', e);
    }
  }

  /**
   * Loads completed lesson states.
   * Format: { [lessonId]: { completed: true, bestWpm, bestAcc, stars, timestamp } }
   */
  static getLessonProgress() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LESSONS);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  }

  /**
   * Updates lesson score and unlocks stars.
   * Stars:
   * 1 Star: Reached target WPM or Accuracy > 90%
   * 2 Stars: Reached target WPM AND Accuracy >= 95%
   * 3 Stars: Reached target WPM + 10 AND Accuracy >= 98% (Pro Mastery)
   */
  static recordLessonResult(lessonId, metrics, targetWpm, minAccuracy = 95) {
    try {
      const progress = StorageManager.getLessonProgress();
      const existing = progress[lessonId] || { bestWpm: 0, bestAcc: 0, stars: 0 };

      let stars = 1;
      if (metrics.wpm >= targetWpm && metrics.accuracy >= minAccuracy) {
        stars = 2;
      }
      if (metrics.wpm >= targetWpm + 10 && metrics.accuracy >= 98) {
        stars = 3;
      }

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
      console.error('Failed to record lesson result', e);
      return null;
    }
  }

  /**
   * Gets aggregate all-time stats.
   */
  static getAllTimeStats() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STATS);
      return data ? JSON.parse(data) : {
        testsCompleted: 0,
        totalKeystrokes: 0,
        totalCorrectChars: 0,
        totalSecondsTyping: 0,
        highestWpm: 0,
        averageWpm: 0
      };
    } catch (e) {
      return {
        testsCompleted: 0,
        totalKeystrokes: 0,
        totalCorrectChars: 0,
        totalSecondsTyping: 0,
        highestWpm: 0,
        averageWpm: 0
      };
    }
  }

  /**
   * Records completed session metrics into all-time stats.
   */
  static recordSessionStats(metrics) {
    try {
      const stats = StorageManager.getAllTimeStats();
      stats.testsCompleted += 1;
      stats.totalKeystrokes += metrics.totalKeystrokes;
      stats.totalCorrectChars += metrics.correctChars;
      stats.totalSecondsTyping += Math.round(metrics.elapsedSeconds);

      if (metrics.wpm > stats.highestWpm) {
        stats.highestWpm = metrics.wpm;
      }

      // Rolling average WPM
      stats.averageWpm = Math.round(
        (stats.averageWpm * (stats.testsCompleted - 1) + metrics.wpm) / stats.testsCompleted
      );

      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
      return stats;
    } catch (e) {
      console.error('Failed to update stats in localStorage', e);
      return null;
    }
  }

  /**
   * Records errors to aggregate weak key memory.
   */
  static recordKeyErrors(keyStats) {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WEAK_KEYS);
      const weakKeys = data ? JSON.parse(data) : {};

      for (const [key, stat] of Object.entries(keyStats)) {
        if (!weakKeys[key]) {
          weakKeys[key] = { attempts: 0, errors: 0 };
        }
        weakKeys[key].attempts += stat.attempts || 0;
        weakKeys[key].errors += stat.errors || 0;
      }

      localStorage.setItem(STORAGE_KEYS.WEAK_KEYS, JSON.stringify(weakKeys));
    } catch (e) {
      console.error('Failed to record key errors', e);
    }
  }

  /**
   * Retrieves overall historical weakest keys.
   */
  static getAggregateWeakKeys(limit = 6) {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WEAK_KEYS);
      if (!data) return [];
      const weakKeys = JSON.parse(data);

      const list = [];
      for (const [key, stat] of Object.entries(weakKeys)) {
        if (stat.attempts >= 5 && stat.errors > 0) {
          list.push({
            key,
            attempts: stat.attempts,
            errors: stat.errors,
            errorRate: stat.errors / stat.attempts
          });
        }
      }

      list.sort((a, b) => b.errorRate - a.errorRate);
      return list.slice(0, limit);
    } catch (e) {
      return [];
    }
  }

  /**
   * Resets all progress and stats.
   */
  static clearAll() {
    try {
      localStorage.removeItem(STORAGE_KEYS.LESSONS);
      localStorage.removeItem(STORAGE_KEYS.STATS);
      localStorage.removeItem(STORAGE_KEYS.WEAK_KEYS);
    } catch (e) {
      console.error('Failed to clear storage', e);
    }
  }
}
