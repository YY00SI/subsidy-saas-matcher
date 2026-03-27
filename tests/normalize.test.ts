import { describe, it, expect } from 'vitest';
import { normalizeText, normalizeDate } from '../src/lib/normalize';

describe('normalize', () => {
  it('should normalize text', () => {
    expect(normalizeText('  テスト　')).toBe('テスト');
    expect(normalizeText('ABC')).toBe('ABC');
  });

  it('should normalize dates', () => {
    expect(normalizeDate('2024-01-01')).toBe('2024-01-01T00:00:00.000Z');
    expect(normalizeDate('invalid')).toBe(null);
  });
});
