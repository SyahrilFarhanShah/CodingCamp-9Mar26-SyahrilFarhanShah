/**
 * Storage Module Tests
 * Property-based tests for storage fallback resilience
 * 
 * **Property 18: Storage Fallback Resilience**
 * **Validates: Requirements 3.8, 4.7, 8.1**
 */

import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { createStorage } from './storage.js';
import fc from 'fast-check';

describe('Storage Module - Unit Tests', () => {
  let storage;

  beforeEach(() => {
    localStorage.clear();
    storage = createStorage();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Local Storage Operations', () => {
    test('should store and retrieve string values', () => {
      storage.set('test-key', 'test-value');
      expect(storage.get('test-key')).toBe('test-value');
    });

    test('should store and retrieve objects', () => {
      const obj = { name: 'Test', value: 123 };
      storage.set('test-obj', obj);
      expect(storage.get('test-obj')).toEqual(obj);
    });

    test('should store and retrieve arrays', () => {
      const arr = [1, 2, 3, 'test'];
      storage.set('test-arr', arr);
      expect(storage.get('test-arr')).toEqual(arr);
    });

    test('should return null for non-existent keys', () => {
      expect(storage.get('non-existent')).toBeNull();
    });

    test('should remove items', () => {
      storage.set('test-key', 'value');
      storage.remove('test-key');
      expect(storage.get('test-key')).toBeNull();
    });

    test('should report storage availability', () => {
      expect(storage.isAvailable()).toBe(true);
    });

    test('should have no error when storage is available', () => {
      expect(storage.getError()).toBeNull();
    });
  });

  describe('JSON Serialization', () => {
    test('should handle nested objects', () => {
      const nested = {
        level1: {
          level2: {
            level3: 'deep value'
          }
        }
      };
      storage.set('nested', nested);
      expect(storage.get('nested')).toEqual(nested);
    });

    test('should handle arrays of objects', () => {
      const data = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' }
      ];
      storage.set('items', data);
      expect(storage.get('items')).toEqual(data);
    });

    test('should handle boolean values', () => {
      storage.set('bool-true', true);
      storage.set('bool-false', false);
      expect(storage.get('bool-true')).toBe(true);
      expect(storage.get('bool-false')).toBe(false);
    });

    test('should handle null values', () => {
      storage.set('null-value', null);
      expect(storage.get('null-value')).toBeNull();
    });

    test('should handle number values', () => {
      storage.set('number', 42);
      expect(storage.get('number')).toBe(42);
    });
  });
});

describe('Storage Module - Property-Based Tests', () => {
  let storage;

  beforeEach(() => {
    localStorage.clear();
    storage = createStorage();
  });

  afterEach(() => {
    localStorage.clear();
  });

  // Feature: productivity-dashboard, Property 18: Storage Fallback Resilience
  test('Property 18: Storage operations should work with any JSON-serializable data', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.string(),
          fc.integer(),
          fc.boolean(),
          fc.array(fc.string()),
          fc.record({
            id: fc.string(),
            value: fc.integer(),
            active: fc.boolean()
          })
        ),
        (data) => {
          const key = 'test-key';
          const result = storage.set(key, data);
          expect(result).toBe(true);
          
          const retrieved = storage.get(key);
          expect(retrieved).toEqual(data);
          
          storage.remove(key);
          expect(storage.get(key)).toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: productivity-dashboard, Property 18: Storage Fallback Resilience
  test('Property 18: Storage should handle multiple keys independently', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            key: fc.string({ minLength: 1, maxLength: 20 }),
            value: fc.string()
          }),
          { minLength: 1, maxLength: 10 }
        ),
        (entries) => {
          // Store all entries
          entries.forEach(entry => {
            storage.set(entry.key, entry.value);
          });
          
          // Verify all entries
          entries.forEach(entry => {
            expect(storage.get(entry.key)).toBe(entry.value);
          });
          
          // Clean up
          entries.forEach(entry => {
            storage.remove(entry.key);
          });
        }
      ),
      { numRuns: 50 }
    );
  });
});

describe('Storage Module - Fallback Behavior', () => {
  test('should create storage with in-memory fallback when localStorage is unavailable', () => {
    // Mock localStorage to throw error
    const originalLocalStorage = global.localStorage;
    delete global.localStorage;
    
    const fallbackStorage = createStorage();
    
    expect(fallbackStorage.isAvailable()).toBe(false);
    expect(fallbackStorage.getError()).toContain('unavailable');
    
    // Should still work with in-memory storage
    fallbackStorage.set('test', 'value');
    expect(fallbackStorage.get('test')).toBe('value');
    
    // Restore localStorage
    global.localStorage = originalLocalStorage;
  });

  test('should handle quota exceeded errors gracefully', () => {
    const mockStorage = createStorage();
    
    // Mock localStorage.setItem to throw QuotaExceededError
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = jest.fn(() => {
      const error = new Error('QuotaExceededError');
      error.name = 'QuotaExceededError';
      throw error;
    });
    
    // Should fall back to memory storage
    const result = mockStorage.set('test', 'value');
    expect(result).toBe(true);
    
    // Restore original
    Storage.prototype.setItem = originalSetItem;
  });
});
