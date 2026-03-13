/**
 * Timer Component Tests
 * Tests for timer countdown and persistence
 */

import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { createTimer } from './timer.js';

function createMockStorage() {
  const data = new Map();
  return {
    get(key) {
      return data.has(key) ? data.get(key) : null;
    },
    set(key, value) {
      data.set(key, value);
      return true;
    },
    remove(key) {
      data.delete(key);
    },
    isAvailable() {
      return true;
    },
    getError() {
      return null;
    },
    clear() {
      data.clear();
    }
  };
}

describe('Timer Component', () => {
  let storage;
  let timer;
  let container;

  beforeEach(() => {
    storage = createMockStorage();
    timer = createTimer(storage);
    container = document.createElement('div');
  });

  afterEach(() => {
    timer.destroy();
    storage.clear();
  });

  test('should format time correctly', () => {
    expect(timer.formatTime(1500)).toBe('25:00');
    expect(timer.formatTime(60)).toBe('01:00');
    expect(timer.formatTime(5)).toBe('00:05');
  });

  test('should initialize with 25 minutes', () => {
    timer.init(container);
    const state = timer.getState();
    expect(state.remainingSeconds).toBe(1500);
    expect(state.isRunning).toBe(false);
  });

  test('should reset to 25 minutes', () => {
    timer.init(container);
    timer.reset();
    const state = timer.getState();
    expect(state.remainingSeconds).toBe(1500);
    expect(state.isRunning).toBe(false);
  });

  test('should save state to storage', () => {
    timer.init(container);
    timer.saveState();
    const stored = storage.get('timer-state');
    expect(stored).toBeDefined();
    expect(stored.remainingSeconds).toBe(1500);
  });

  test('should restore state from storage', () => {
    storage.set('timer-state', {
      remainingSeconds: 300,
      isRunning: false,
      lastUpdate: Date.now()
    });
    
    timer.init(container);
    const state = timer.getState();
    expect(state.remainingSeconds).toBe(300);
  });
});
