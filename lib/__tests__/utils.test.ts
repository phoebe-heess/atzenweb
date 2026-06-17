import { describe, it, expect } from 'vitest';
import { cn } from '../utils';

describe('cn utility', () => {
  it('combines multiple classes correctly', () => {
    const result = cn('class1', 'class2', 'class3');
    expect(result).toBe('class1 class2 class3');
  });

  it('filters out falsy values', () => {
    const result = cn('class1', null, 'class2', undefined, 'class3', false);
    expect(result).toBe('class1 class2 class3');
  });

  it('handles empty input', () => {
    const result = cn();
    expect(result).toBe('');
  });

  it('handles single class', () => {
    const result = cn('single-class');
    expect(result).toBe('single-class');
  });
});
