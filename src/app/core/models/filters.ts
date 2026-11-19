import { CityId, PropertyType } from './listing';

export type SortKey = 'newest' | 'price-asc' | 'price-desc' | 'area-desc';

/** 'studio' means exactly 0 bedrooms, a number means "at least" */
export type BedsFilter = 'studio' | 1 | 2 | 3 | 4 | 5;

export type ViewMode = 'grid' | 'list' | 'map';

export interface ListingFilters {
  q: string;
  city: CityId | null;
  type: PropertyType | null;
  minPrice: number | null;
  maxPrice: number | null;
  beds: BedsFilter | null;
  sort: SortKey;
}

export const DEFAULT_FILTERS: ListingFilters = {
  q: '',
  city: null,
  type: null,
  minPrice: null,
  maxPrice: null,
  beds: null,
  sort: 'newest',
};

export const SORT_OPTIONS: { id: SortKey; label: string }[] = [
  { id: 'newest', label: 'Newest' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
  { id: 'area-desc', label: 'Largest first' },
];

export const BEDS_OPTIONS: { id: BedsFilter; label: string }[] = [
  { id: 'studio', label: 'Studio' },
  { id: 1, label: '1+ beds' },
  { id: 2, label: '2+ beds' },
  { id: 3, label: '3+ beds' },
  { id: 4, label: '4+ beds' },
  { id: 5, label: '5+ beds' },
];
