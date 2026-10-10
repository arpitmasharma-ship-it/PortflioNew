import { describe, expect, it } from 'vitest';
import { initials, cn, formatDate } from './format.js';

describe('format helpers', () => {
  it('builds initials from a name', () => {
    expect(initials('Arpit Kumar')).toBe('AK');
    expect(initials('Arpit')).toBe('A');
    expect(initials('')).toBe('');
  });

  it('joins class names', () => {
    expect(cn('a', false, 'b')).toBe('a b');
    expect(cn('btn', null, undefined, 'btn-primary')).toBe('btn btn-primary');
  });

  it('formats dates safely', () => {
    expect(formatDate('')).toBe('');
    expect(formatDate('invalid-date')).toBe('');
    expect(formatDate('2026-05-15')).toContain('2026');
  });
});

