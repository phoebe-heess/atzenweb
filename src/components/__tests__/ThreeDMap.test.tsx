import { describe, it, expect } from 'vitest';

interface Venue {
  id: string;
  name: string;
  type: string;
  isGastronomy: boolean;
  address: string;
  distance: number;
  rating: string;
  isOpen: boolean;
  openingHours: string;
  hasFood: boolean;
  dogFriendly: boolean;
  longitude: number;
  latitude: number;
}

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
}

interface Filters {
  food: boolean;
  dogFriendly: boolean;
  openNow: boolean;
  gastronomy: boolean;
  retail: boolean;
}

function filterVenues(
  venues: Venue[],
  filters: Filters,
  radius: number,
  centerLat: number,
  centerLon: number
): Venue[] {
  return venues
    .map(v => ({ ...v, distance: getDistance(centerLat, centerLon, v.latitude, v.longitude) }))
    .filter(venue => {
      if (venue.distance > radius) return false;
      if (filters.openNow && !venue.isOpen) return false;
      if (filters.food && !venue.hasFood) return false;
      if (filters.dogFriendly && !venue.dogFriendly) return false;
      if (filters.gastronomy && !venue.isGastronomy) return false;
      if (filters.retail && venue.isGastronomy) return false;
      return true;
    })
    .sort((a, b) => a.distance - b.distance);
}

const MOCK_VENUES: Venue[] = [
  {
    id: 'v1', name: 'REWE Supermarkt', type: 'Supermarkt', isGastronomy: false,
    address: 'Königstraße 120, 90762 Fürth', distance: 0, rating: '4.2',
    isOpen: true, openingHours: '07:00 - 20:00', hasFood: true, dogFriendly: false,
    longitude: 11.015, latitude: 49.457
  },
  {
    id: 'v2', name: 'EDEKA Schätz', type: 'Supermarkt', isGastronomy: false,
    address: 'Waldstraße 101, 90763 Fürth', distance: 0, rating: '4.5',
    isOpen: true, openingHours: '07:00 - 20:00', hasFood: true, dogFriendly: false,
    longitude: 11.020, latitude: 49.454
  },
  {
    id: 'v3', name: 'Späti am Heizhaus', type: 'Späti', isGastronomy: false,
    address: 'Wandererstraße 89, 90429 Nürnberg', distance: 0, rating: '4.8',
    isOpen: true, openingHours: '14:00 - 02:00', hasFood: false, dogFriendly: true,
    longitude: 11.017, latitude: 49.456
  },
  {
    id: 'v4', name: 'Getränkemarkt', type: 'Getränkemarkt', isGastronomy: false,
    address: 'Leyher Straße 70, 90431 Nürnberg', distance: 0, rating: '4.0',
    isOpen: false, openingHours: '09:00 - 18:00', hasFood: false, dogFriendly: false,
    longitude: 11.022, latitude: 49.458
  },
  {
    id: 'v5', name: 'Biergarten Wöhrder Wiese', type: 'Biergarten', isGastronomy: true,
    address: 'Wassertorstraße 5, 90489 Nürnberg', distance: 0, rating: '4.7',
    isOpen: true, openingHours: '11:00 - 23:00', hasFood: true, dogFriendly: true,
    longitude: 11.025, latitude: 49.453
  },
  {
    id: 'v6', name: 'Kneipe Zum Atzenhof', type: 'Kneipe', isGastronomy: true,
    address: 'Atzenhof 1, 90768 Fürth', distance: 0, rating: '4.9',
    isOpen: true, openingHours: '17:00 - 01:00', hasFood: true, dogFriendly: true,
    longitude: 10.980, latitude: 49.470
  },
  {
    id: 'v7', name: 'Berlin Späti', type: 'Späti', isGastronomy: false,
    address: 'Oranienstraße 12, 10999 Berlin', distance: 0, rating: '4.3',
    isOpen: true, openingHours: '08:00 - 23:00', hasFood: false, dogFriendly: true,
    longitude: 13.420, latitude: 52.495
  },
];

const DEFAULT_FILTERS: Filters = {
  food: false, dogFriendly: false, openNow: false,
  gastronomy: false, retail: false,
};

describe('ThreeDMap Venue Filtering', () => {
  const centerLat = 49.4566;
  const centerLon = 11.0182;

  it('returns all venues within radius with no active filters', () => {
    const results = filterVenues(MOCK_VENUES, DEFAULT_FILTERS, 500, centerLat, centerLon);
    expect(results).toHaveLength(MOCK_VENUES.length);
  });

  it('filters by radius correctly', () => {
    const results = filterVenues(MOCK_VENUES, DEFAULT_FILTERS, 2, centerLat, centerLon);
    const berlinVenue = results.find(v => v.id === 'v7');
    expect(berlinVenue).toBeUndefined();
    expect(results.every(v => v.distance <= 2)).toBe(true);
  });

  it('filters by gastronomy (on-premise) only', () => {
    const results = filterVenues(MOCK_VENUES, { ...DEFAULT_FILTERS, gastronomy: true }, 100, centerLat, centerLon);
    expect(results.every(v => v.isGastronomy)).toBe(true);
    expect(results).toHaveLength(2);
  });

  it('filters by retail (off-premise) only', () => {
    const results = filterVenues(MOCK_VENUES, { ...DEFAULT_FILTERS, retail: true }, 500, centerLat, centerLon);
    expect(results.every(v => !v.isGastronomy)).toBe(true);
    expect(results).toHaveLength(5);
  });

  it('filters by open now', () => {
    const results = filterVenues(MOCK_VENUES, { ...DEFAULT_FILTERS, openNow: true }, 100, centerLat, centerLon);
    expect(results.every(v => v.isOpen)).toBe(true);
    expect(results.find(v => v.id === 'v4')).toBeUndefined();
  });

  it('filters by food availability', () => {
    const results = filterVenues(MOCK_VENUES, { ...DEFAULT_FILTERS, food: true }, 100, centerLat, centerLon);
    expect(results.every(v => v.hasFood)).toBe(true);
    expect(results).toHaveLength(4);
  });

  it('filters by dog friendly', () => {
    const results = filterVenues(MOCK_VENUES, { ...DEFAULT_FILTERS, dogFriendly: true }, 500, centerLat, centerLon);
    expect(results.every(v => v.dogFriendly)).toBe(true);
    expect(results).toHaveLength(4);
  });

  it('combines multiple filters', () => {
    const results = filterVenues(
      MOCK_VENUES,
      { food: true, dogFriendly: true, openNow: false, gastronomy: false, retail: false },
      100, centerLat, centerLon
    );
    expect(results.every(v => v.hasFood && v.dogFriendly)).toBe(true);
    expect(results).toHaveLength(2);
  });

  it('returns empty when no venues match', () => {
    const results = filterVenues(MOCK_VENUES, { ...DEFAULT_FILTERS, food: true, dogFriendly: true, gastronomy: true }, 100, centerLat, centerLon);
    expect(results.every(v => v.isGastronomy && v.hasFood && v.dogFriendly)).toBe(true);
    expect(results).toHaveLength(2);
  });

  it('sorts results by distance ascending', () => {
    const results = filterVenues(MOCK_VENUES, DEFAULT_FILTERS, 100, centerLat, centerLon);
    for (let i = 1; i < results.length; i++) {
      expect(results[i].distance).toBeGreaterThanOrEqual(results[i - 1].distance);
    }
  });
});

describe('getDistance (Haversine)', () => {
  it('returns 0 for the same coordinates', () => {
    expect(getDistance(49.4566, 11.0182, 49.4566, 11.0182)).toBe(0);
  });

  it('calculates approximate distance between two nearby points', () => {
    const d = getDistance(49.4566, 11.0182, 49.457, 11.015);
    expect(d).toBeGreaterThan(0);
    expect(d).toBeLessThan(1);
  });

  it('calculates approximate distance between Berlin and Nuremberg', () => {
    const d = getDistance(49.4566, 11.0182, 52.5200, 13.4050);
    expect(d).toBeGreaterThan(350);
    expect(d).toBeLessThan(450);
  });
});
