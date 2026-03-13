/**
 * QuickLinks Component Tests
 * Tests for quick links CRUD operations and persistence
 */

import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { createQuickLinks } from './quicklinks.js';

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

describe('QuickLinks Component', () => {
  let storage;
  let quickLinks;
  let container;

  beforeEach(() => {
    storage = createMockStorage();
    quickLinks = createQuickLinks(storage);
    container = document.createElement('div');
  });

  afterEach(() => {
    storage.clear();
  });

  test('should add valid link', () => {
    const result = quickLinks.addLink('Google', 'https://google.com');
    expect(result).toBe(true);
    expect(quickLinks.getLinks().length).toBe(1);
  });

  test('should reject invalid URL', () => {
    const result = quickLinks.addLink('Invalid', 'not-a-url');
    expect(result).toBe(false);
    expect(quickLinks.getLinks().length).toBe(0);
  });

  test('should validate URL format', () => {
    expect(quickLinks.isValidUrl('https://example.com')).toBe(true);
    expect(quickLinks.isValidUrl('http://example.com')).toBe(true);
    expect(quickLinks.isValidUrl('ftp://example.com')).toBe(false);
    expect(quickLinks.isValidUrl('not-a-url')).toBe(false);
  });

  test('should delete link', () => {
    quickLinks.addLink('Google', 'https://google.com');
    const links = quickLinks.getLinks();
    quickLinks.deleteLink(links[0].id);
    expect(quickLinks.getLinks().length).toBe(0);
  });

  test('should persist links to storage', () => {
    quickLinks.addLink('Google', 'https://google.com');
    const stored = storage.get('quick-links');
    expect(stored.length).toBe(1);
    expect(stored[0].name).toBe('Google');
  });

  test('should restore links from storage', () => {
    const existingLinks = [
      { id: '1', name: 'Google', url: 'https://google.com', createdAt: Date.now() }
    ];
    storage.set('quick-links', existingLinks);
    
    quickLinks.init(container);
    expect(quickLinks.getLinks()).toEqual(existingLinks);
  });
});
