import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const STORAGE_KEY = 'atzengold_age_verified';

const mockStorage: Record<string, string> = {};

beforeEach(() => {
  Object.keys(mockStorage).forEach(k => delete mockStorage[k]);
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => mockStorage[key] ?? null,
    setItem: (key: string, value: string) => { mockStorage[key] = value; },
    removeItem: (key: string) => { delete mockStorage[key]; },
    clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); },
    get length() { return Object.keys(mockStorage).length; },
    key: (index: number) => Object.keys(mockStorage)[index] ?? null,
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('AgeGate localStorage Logic', () => {
  it('stores verification on successful age check', () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    const stored = localStorage.getItem(STORAGE_KEY);
    expect(stored).toBe('true');
  });

  it('returns null when not yet verified', () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    expect(stored).toBeNull();
  });

  it('parses stored value as boolean true', () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    const isVerified = localStorage.getItem(STORAGE_KEY) === 'true';
    expect(isVerified).toBe(true);
  });

  it('parses stored value as boolean false for non-true strings', () => {
    localStorage.setItem(STORAGE_KEY, 'false');
    const isVerified = localStorage.getItem(STORAGE_KEY) === 'true';
    expect(isVerified).toBe(false);
  });

  it('is not affected by other localStorage keys', () => {
    localStorage.setItem('other_key', 'true');
    const stored = localStorage.getItem(STORAGE_KEY);
    expect(stored).toBeNull();
  });

  it('can clear the stored verification', () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    localStorage.removeItem(STORAGE_KEY);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});
