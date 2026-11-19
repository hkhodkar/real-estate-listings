import { Params } from '@angular/router';
import { BedsFilter, DEFAULT_FILTERS, ListingFilters, SORT_OPTIONS, SortKey, ViewMode } from '../models/filters';
import { CityId, Listing, PROPERTY_TYPES, PropertyType } from '../models/listing';

const CITY_IDS: CityId[] = ['dubai', 'abu-dhabi', 'sharjah', 'ajman', 'ras-al-khaimah'];

export function matchesFilters(listing: Listing, f: ListingFilters): boolean {
  if (f.city && listing.city !== f.city) return false;
  if (f.type && listing.type !== f.type) return false;
  if (f.minPrice != null && listing.price < f.minPrice) return false;
  if (f.maxPrice != null && listing.price > f.maxPrice) return false;
  if (f.beds === 'studio' && listing.beds !== 0) return false;
  if (typeof f.beds === 'number' && listing.beds < f.beds) return false;
  const q = f.q.trim().toLowerCase();
  if (q) {
    const haystack = `${listing.title} ${listing.community} ${listing.city.replace(/-/g, ' ')}`.toLowerCase();
    if (!q.split(/\s+/).every((word) => haystack.includes(word))) return false;
  }
  return true;
}

export function sortListings(listings: Listing[], sort: SortKey): Listing[] {
  const sorted = [...listings];
  switch (sort) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'area-desc':
      return sorted.sort((a, b) => b.area - a.area);
    default:
      return sorted.sort((a, b) => b.listedAt.localeCompare(a.listedAt) || a.id.localeCompare(b.id));
  }
}

export function applyFilters(listings: Listing[], f: ListingFilters): Listing[] {
  return sortListings(
    listings.filter((l) => matchesFilters(l, f)),
    f.sort,
  );
}

function toPrice(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : null;
}

function toBeds(value: unknown): BedsFilter | null {
  if (value === 'studio') return 'studio';
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 && n <= 5 ? (n as BedsFilter) : null;
}

/** Reads filters from URL query params, ignoring anything invalid. */
export function filtersFromParams(params: Params): ListingFilters {
  const city = params['city'];
  const type = params['type'];
  const sort = params['sort'];
  return {
    q: typeof params['q'] === 'string' ? params['q'] : '',
    city: CITY_IDS.includes(city) ? city : null,
    type: PROPERTY_TYPES.some((t) => t.id === type) ? (type as PropertyType) : null,
    minPrice: toPrice(params['minPrice']),
    maxPrice: toPrice(params['maxPrice']),
    beds: toBeds(params['beds']),
    sort: SORT_OPTIONS.some((s) => s.id === sort) ? sort : DEFAULT_FILTERS.sort,
  };
}

/** Query params for the given filters; defaults are left out to keep URLs short. */
export function filtersToParams(f: ListingFilters): Params {
  const params: Params = {};
  if (f.q.trim()) params['q'] = f.q.trim();
  if (f.city) params['city'] = f.city;
  if (f.type) params['type'] = f.type;
  if (f.minPrice != null) params['minPrice'] = f.minPrice;
  if (f.maxPrice != null) params['maxPrice'] = f.maxPrice;
  if (f.beds != null) params['beds'] = f.beds;
  if (f.sort !== DEFAULT_FILTERS.sort) params['sort'] = f.sort;
  return params;
}

export function viewFromParams(params: Params): ViewMode {
  const view = params['view'];
  return view === 'list' || view === 'map' ? view : 'grid';
}

/** Number of active filters (sort and view don't count). */
export function activeFilterCount(f: ListingFilters): number {
  return [f.q.trim() || null, f.city, f.type, f.minPrice, f.maxPrice, f.beds].filter((v) => v != null).length;
}

export function sameFilters(a: ListingFilters, b: ListingFilters): boolean {
  return (Object.keys(DEFAULT_FILTERS) as (keyof ListingFilters)[]).every((k) => a[k] === b[k]);
}
