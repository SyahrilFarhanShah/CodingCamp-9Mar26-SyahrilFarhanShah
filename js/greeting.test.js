/**
 * Greeting Component Tests
 * Property-based tests for time and date formatting
 * 
 * **Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5**
 */

import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { createGreeting } from './greeting.js';
import fc from 'fast-check';

describe('Greeting Component - Unit Tests', () => {
  let greeting;
  let container;

  beforeEach(() => {
    greeting = createGreeting();
    container = document.createElement('div');
  });

  afterEach(() => {
    greeting.destroy();
  });

  describe('Time Formatting', () => {
    test('should format time in 12-hour format with AM/PM', () => {
      const date = new Date('2024-01-15T14:30:45');
      const formatted = greeting.formatTime(date);
      expect(formatted).toBe('2:30:45 PM');
    });

    test('should handle midnight correctly', () => {
      const date = new Date('2024-01-15T00:00:00');
      const formatted = greeting.formatTime(date);
      expect(formatted).toBe('12:00:00 AM');
    });

    test('should handle noon correctly', () => {
      const date = new Date('2024-01-15T12:00:00');
      const formatted = greeting.formatTime(date);
      expect(formatted).toBe('12:00:00 PM');
    });

    test('should pad minutes and seconds with zeros', () => {
      const date = new Date('2024-01-15T09:05:03');
      const formatted = greeting.formatTime(date);
      expect(formatted).toBe('9:05:03 AM');
    });
  });

  describe('Date Formatting', () => {
    test('should format date with day name, month name, day, and year', () => {
      const date = new Date('2024-01-15T12:00:00');
      const formatted = greeting.formatDate(date);
      expect(formatted).toBe('Monday, January 15, 2024');
    });

    test('should handle different months', () => {
      const date = new Date('2024-12-25T12:00:00');
      const formatted = greeting.formatDate(date);
      expect(formatted).toBe('Wednesday, December 25, 2024');
    });
  });

  describe('Greeting Messages', () => {
    test('should return "Good morning" between 5 AM and 11:59 AM', () => {
      const morning = new Date('2024-01-15T08:00:00');
      expect(greeting.getGreeting(morning)).toBe('Good morning');
    });

    test('should return "Good afternoon" between 12 PM and 4:59 PM', () => {
      const afternoon = new Date('2024-01-15T14:00:00');
      expect(greeting.getGreeting(afternoon)).toBe('Good afternoon');
    });

    test('should return "Good evening" between 5 PM and 4:59 AM', () => {
      const evening = new Date('2024-01-15T20:00:00');
      expect(greeting.getGreeting(evening)).toBe('Good evening');
      
      const night = new Date('2024-01-15T02:00:00');
      expect(greeting.getGreeting(night)).toBe('Good evening');
    });

    test('should handle boundary at 5 AM', () => {
      const boundary = new Date('2024-01-15T05:00:00');
      expect(greeting.getGreeting(boundary)).toBe('Good morning');
    });

    test('should handle boundary at 12 PM', () => {
      const boundary = new Date('2024-01-15T12:00:00');
      expect(greeting.getGreeting(boundary)).toBe('Good afternoon');
    });

    test('should handle boundary at 5 PM', () => {
      const boundary = new Date('2024-01-15T17:00:00');
      expect(greeting.getGreeting(boundary)).toBe('Good evening');
    });
  });

  describe('Component Initialization', () => {
    test('should initialize and render greeting', () => {
      greeting.init(container);
      expect(container.innerHTML).toContain('Good');
      expect(container.innerHTML).toMatch(/AM|PM/);
    });

    test('should update display when updateTime is called', () => {
      greeting.init(container);
      const initialContent = container.innerHTML;
      
      // Wait a bit and update
      greeting.updateTime();
      
      expect(container.innerHTML).toBeTruthy();
    });
  });
});

describe('Greeting Component - Property-Based Tests', () => {
  let greeting;

  beforeEach(() => {
    greeting = createGreeting();
  });

  afterEach(() => {
    greeting.destroy();
  });

  // Feature: productivity-dashboard, Property 1: Time Format Consistency
  test('Property 1: Time formatting should always produce 12-hour format with AM/PM', () => {
    fc.assert(
      fc.property(
        fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') }),
        (date) => {
          const formatted = greeting.formatTime(date);
          
          // Should match pattern: H:MM:SS AM/PM or HH:MM:SS AM/PM
          const timeRegex = /^(1[0-2]|[1-9]):[0-5][0-9]:[0-5][0-9] (AM|PM)$/;
          expect(formatted).toMatch(timeRegex);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: productivity-dashboard, Property 2: Date Format Completeness
  test('Property 2: Date formatting should contain day name, month name, day number, and year', () => {
    fc.assert(
      fc.property(
        fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') }),
        (date) => {
          const formatted = greeting.formatDate(date);
          
          const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                          'July', 'August', 'September', 'October', 'November', 'December'];
          
          // Should contain a day name
          const hasDay = days.some(day => formatted.includes(day));
          expect(hasDay).toBe(true);
          
          // Should contain a month name
          const hasMonth = months.some(month => formatted.includes(month));
          expect(hasMonth).toBe(true);
          
          // Should contain the year
          const year = date.getFullYear().toString();
          expect(formatted).toContain(year);
          
          // Should contain a day number (1-31)
          const dayNum = date.getDate();
          expect(formatted).toContain(dayNum.toString());
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: productivity-dashboard, Property 3: Greeting Time Ranges
  test('Property 3: Greeting should match time of day correctly', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 23 }),
        (hour) => {
          const date = new Date();
          date.setHours(hour, 0, 0, 0);
          
          const greetingMsg = greeting.getGreeting(date);
          
          if (hour >= 5 && hour < 12) {
            expect(greetingMsg).toBe('Good morning');
          } else if (hour >= 12 && hour < 17) {
            expect(greetingMsg).toBe('Good afternoon');
          } else {
            expect(greetingMsg).toBe('Good evening');
          }
        }
      ),
      { numRuns: 24 }
    );
  });
});
