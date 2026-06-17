import { describe, it, expect } from 'vitest';

const PRICE_CRATE = 18.90;
const PRICE_KEG = 79.00;

function calcCrateCost(crates: number) {
  return crates * PRICE_CRATE;
}

function calcKegCost(kegs: number) {
  return kegs * PRICE_KEG;
}

function calcTotal(crates: number, kegs: number) {
  return calcCrateCost(crates) + calcKegCost(kegs);
}

function calcLiters(crates: number, kegs: number) {
  return crates * 10 + kegs * 30;
}

function calcWeight(crates: number, kegs: number) {
  return crates * 18.2 + kegs * 39.5;
}

describe('B2BPortal Calculator Logic', () => {
  it('calculates crate cost correctly', () => {
    expect(calcCrateCost(5)).toBeCloseTo(94.50);
    expect(calcCrateCost(0)).toBeCloseTo(0);
    expect(calcCrateCost(10)).toBeCloseTo(189.00);
  });

  it('calculates keg cost correctly', () => {
    expect(calcKegCost(2)).toBeCloseTo(158.00);
    expect(calcKegCost(0)).toBeCloseTo(0);
    expect(calcKegCost(5)).toBeCloseTo(395.00);
  });

  it('calculates grand total correctly', () => {
    expect(calcTotal(5, 2)).toBeCloseTo(252.50);
    expect(calcTotal(0, 0)).toBeCloseTo(0);
  });

  it('calculates total liters correctly', () => {
    expect(calcLiters(5, 2)).toBe(110);
    expect(calcLiters(1, 1)).toBe(40);
    expect(calcLiters(0, 0)).toBe(0);
  });

  it('calculates estimated weight correctly', () => {
    expect(calcWeight(5, 2)).toBeCloseTo(170.0);
    expect(calcWeight(0, 0)).toBeCloseTo(0);
  });

  it('handles negative inputs gracefully', () => {
    expect(calcTotal(-1, 0)).toBeLessThan(0);
  });
});
