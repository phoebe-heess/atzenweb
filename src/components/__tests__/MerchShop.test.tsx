import { describe, it, expect } from 'vitest';
import merchData from '../../data/merch.json';

interface CartItem {
  item: typeof merchData[0];
  quantity: number;
  selectedSize?: string;
}

function calcSubtotal(cart: CartItem[]): number {
  return cart.reduce((acc, curr) => {
    const price = curr.item.promoPrice || curr.item.price;
    return acc + price * curr.quantity;
  }, 0);
}

function calcShipping(subtotal: number): number {
  return subtotal > 50 ? 0 : 4.90;
}

function calcTotal(cart: CartItem[]): number {
  const sub = calcSubtotal(cart);
  return sub + calcShipping(sub);
}

function addToCart(cart: CartItem[], item: typeof merchData[0], size?: string): CartItem[] {
  const newCart = [...cart];
  const existingIndex = newCart.findIndex(
    ci => ci.item.id === item.id && ci.selectedSize === size
  );
  if (existingIndex > -1) {
    newCart[existingIndex] = {
      ...newCart[existingIndex],
      quantity: newCart[existingIndex].quantity + 1,
    };
  } else {
    newCart.push({ item, quantity: 1, selectedSize: size });
  }
  return newCart;
}

function removeFromCart(cart: CartItem[], itemId: string, size?: string): CartItem[] {
  return cart.filter(ci => !(ci.item.id === itemId && ci.selectedSize === size));
}

function updateQuantity(cart: CartItem[], itemId: string, amount: number, size?: string): CartItem[] {
  return cart.map(ci => {
    if (ci.item.id === itemId && ci.selectedSize === size) {
      return { ...ci, quantity: Math.max(1, ci.quantity + amount) };
    }
    return ci;
  });
}

describe('MerchShop Cart Logic', () => {
  const cap = merchData[0];
  const shirt = merchData[1];
  const hoodie = merchData[2];

  it('adds a new item to cart', () => {
    const cart = addToCart([], cap);
    expect(cart).toHaveLength(1);
    expect(cart[0].item.id).toBe('m1');
    expect(cart[0].quantity).toBe(1);
  });

  it('increments quantity when adding existing item', () => {
    let cart = addToCart([], hoodie, 'L');
    cart = addToCart(cart, hoodie, 'L');
    expect(cart).toHaveLength(1);
    expect(cart[0].quantity).toBe(2);
  });

  it('adds separate entries for different sizes', () => {
    let cart = addToCart([], shirt, 'M');
    cart = addToCart(cart, shirt, 'L');
    expect(cart).toHaveLength(2);
    expect(cart[0].selectedSize).toBe('M');
    expect(cart[1].selectedSize).toBe('L');
  });

  it('removes an item from cart', () => {
    let cart = addToCart([], cap);
    cart = addToCart(cart, shirt, 'M');
    cart = removeFromCart(cart, cap.id);
    expect(cart).toHaveLength(1);
    expect(cart[0].item.id).toBe('m5');
  });

  it('removes only the matching size variant', () => {
    let cart = addToCart([], shirt, 'M');
    cart = addToCart(cart, shirt, 'L');
    cart = removeFromCart(cart, shirt.id, 'M');
    expect(cart).toHaveLength(1);
    expect(cart[0].selectedSize).toBe('L');
  });

  it('updates quantity by increment', () => {
    let cart = addToCart([], cap);
    cart = updateQuantity(cart, cap.id, 2, undefined);
    expect(cart[0].quantity).toBe(3);
  });

  it('updates quantity by decrement without going below 1', () => {
    let cart = addToCart([], cap);
    cart = updateQuantity(cart, cap.id, -1, undefined);
    expect(cart[0].quantity).toBe(1);
    cart = updateQuantity(cart, cap.id, -10, undefined);
    expect(cart[0].quantity).toBe(1);
  });

  it('calculates correct subtotal', () => {
    const cart = addToCart([], cap);
    const expectedSubtotal = (cap.promoPrice || cap.price) * 1;
    expect(calcSubtotal(cart)).toBeCloseTo(expectedSubtotal);
  });

  it('applies free shipping above 50', () => {
    expect(calcShipping(60)).toBe(0);
    expect(calcShipping(50.01)).toBe(0);
  });

  it('charges shipping below or at 50', () => {
    expect(calcShipping(50)).toBe(4.90);
    expect(calcShipping(0)).toBe(4.90);
    expect(calcShipping(25)).toBe(4.90);
  });

  it('calculates total with free shipping over 50', () => {
    const cart = [
      { item: hoodie, quantity: 1, selectedSize: 'L' },
    ];
    const sub = calcSubtotal(cart);
    expect(sub).toBeGreaterThan(50);
    expect(calcTotal(cart)).toBeCloseTo(sub);
  });

  it('calculates total with shipping under 50', () => {
    const cart = [
      { item: cap, quantity: 1 },
    ];
    const sub = calcSubtotal(cart);
    expect(sub).toBeLessThan(50);
    expect(calcTotal(cart)).toBeCloseTo(sub + 4.90);
  });
});
