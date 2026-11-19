import { LISTINGS } from '../data/listings.data';
import { DEFAULT_FILTERS, ListingFilters } from '../models/filters';
import { Listing } from '../models/listing';
import {
  activeFilterCount,
  applyFilters,
  filtersFromParams,
  filtersToParams,
  matchesFilters,
  sortListings,
  viewFromParams,
} from './listing-filters';

function listing(overrides: Partial<Listing>): Listing {
  return {
    id: 'x',
    ref: 'NF-1',
    title: 'Sample home',
    type: 'apartment',
    city: 'dubai',
    community: 'Dubai Marina',
    price: 1_000_000,
    beds: 2,
    baths: 2,
    area: 1000,
    lat: 25,
    lng: 55,
    description: '',
    amenities: [],
    images: [],
    listedAt: '2026-11-01',
    yearBuilt: 2020,
    parking: 1,
    furnished: false,
    agentId: 'sara',
    ...overrides,
  };
}

const f = (overrides: Partial<ListingFilters>): ListingFilters => ({ ...DEFAULT_FILTERS, ...overrides });

describe('matchesFilters', () => {
  const home = listing({});

  it('matches everything with default filters', () => {
    expect(matchesFilters(home, DEFAULT_FILTERS)).toBe(true);
  });

  it('filters by city and type', () => {
    expect(matchesFilters(home, f({ city: 'dubai' }))).toBe(true);
    expect(matchesFilters(home, f({ city: 'sharjah' }))).toBe(false);
    expect(matchesFilters(home, f({ type: 'villa' }))).toBe(false);
  });

  it('treats the price range as inclusive', () => {
    expect(matchesFilters(home, f({ minPrice: 1_000_000, maxPrice: 1_000_000 }))).toBe(true);
    expect(matchesFilters(home, f({ minPrice: 1_000_001 }))).toBe(false);
    expect(matchesFilters(home, f({ maxPrice: 999_999 }))).toBe(false);
  });

  it('uses "at least" for bedrooms and an exact match for studios', () => {
    expect(matchesFilters(home, f({ beds: 2 }))).toBe(true);
    expect(matchesFilters(home, f({ beds: 3 }))).toBe(false);
    expect(matchesFilters(home, f({ beds: 'studio' }))).toBe(false);
    expect(matchesFilters(listing({ beds: 0 }), f({ beds: 'studio' }))).toBe(true);
  });

  it('searches title, community and city, word by word and ignoring case', () => {
    expect(matchesFilters(home, f({ q: 'marina' }))).toBe(true);
    expect(matchesFilters(home, f({ q: '  SAMPLE   dubai ' }))).toBe(true);
    expect(matchesFilters(listing({ city: 'abu-dhabi', community: 'Corniche' }), f({ q: 'abu dhabi' }))).toBe(true);
    expect(matchesFilters(home, f({ q: 'marina villa' }))).toBe(false);
  });
});

describe('sortListings', () => {
  const a = listing({ id: 'a', price: 3, area: 10, listedAt: '2026-10-01' });
  const b = listing({ id: 'b', price: 1, area: 30, listedAt: '2026-11-01' });
  const c = listing({ id: 'c', price: 2, area: 20, listedAt: '2026-09-01' });
  const ids = (list: Listing[]) => list.map((l) => l.id);

  it('sorts by each key without mutating the input', () => {
    const input = [a, b, c];
    expect(ids(sortListings(input, 'newest'))).toEqual(['b', 'a', 'c']);
    expect(ids(sortListings(input, 'price-asc'))).toEqual(['b', 'c', 'a']);
    expect(ids(sortListings(input, 'price-desc'))).toEqual(['a', 'c', 'b']);
    expect(ids(sortListings(input, 'area-desc'))).toEqual(['b', 'c', 'a']);
    expect(ids(input)).toEqual(['a', 'b', 'c']);
  });
});

describe('applyFilters on the demo data', () => {
  it('returns villas in Dubai from 5M, cheapest first', () => {
    const result = applyFilters(LISTINGS, f({ city: 'dubai', type: 'villa', minPrice: 5_000_000, sort: 'price-asc' }));
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((l) => l.city === 'dubai' && l.type === 'villa' && l.price >= 5_000_000)).toBe(true);
    expect(result.map((l) => l.price)).toEqual([...result.map((l) => l.price)].sort((x, y) => x - y));
  });

  it('only returns studios for the studio filter', () => {
    const result = applyFilters(LISTINGS, f({ beds: 'studio' }));
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((l) => l.beds === 0)).toBe(true);
  });
});

describe('query params', () => {
  it('round-trips filters through query params', () => {
    const filters = f({ q: 'marina', city: 'dubai', type: 'apartment', minPrice: 500000, maxPrice: 3000000, beds: 2, sort: 'price-desc' });
    const params = filtersToParams(filters);
    expect(params).toEqual({ q: 'marina', city: 'dubai', type: 'apartment', minPrice: 500000, maxPrice: 3000000, beds: 2, sort: 'price-desc' });
    // the router hands everything back as strings
    const asStrings = Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)]));
    expect(filtersFromParams(asStrings)).toEqual(filters);
  });

  it('leaves defaults out of the URL', () => {
    expect(filtersToParams(DEFAULT_FILTERS)).toEqual({});
    expect(filtersToParams(f({ q: '   ' }))).toEqual({});
  });

  it('ignores invalid values', () => {
    expect(
      filtersFromParams({ city: 'paris', type: 'castle', minPrice: 'abc', maxPrice: '-5', beds: '9', sort: 'random' }),
    ).toEqual(DEFAULT_FILTERS);
    expect(filtersFromParams({ beds: 'studio' }).beds).toBe('studio');
  });

  it('reads the view mode with grid as the fallback', () => {
    expect(viewFromParams({ view: 'map' })).toBe('map');
    expect(viewFromParams({ view: 'list' })).toBe('list');
    expect(viewFromParams({ view: 'table' })).toBe('grid');
  });

  it('counts active filters, not sort order', () => {
    expect(activeFilterCount(DEFAULT_FILTERS)).toBe(0);
    expect(activeFilterCount(f({ city: 'ajman', minPrice: 0, sort: 'price-asc' }))).toBe(2);
  });
});
