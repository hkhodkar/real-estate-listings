export type PropertyType = 'apartment' | 'villa' | 'townhouse' | 'studio';

export type CityId = 'dubai' | 'abu-dhabi' | 'sharjah' | 'ajman' | 'ras-al-khaimah';

export interface City {
  id: CityId;
  name: string;
  lat: number;
  lng: number;
}

export interface Agent {
  id: string;
  name: string;
  title: string;
  email: string;
  languages: string[];
  color: string;
}

export interface ListingImage {
  src: string;
  alt: string;
}

export interface Listing {
  id: string;
  /** short reference shown to buyers, e.g. NF-1004 */
  ref: string;
  title: string;
  type: PropertyType;
  city: CityId;
  community: string;
  price: number;
  beds: number;
  baths: number;
  /** built-up area in square feet */
  area: number;
  lat: number;
  lng: number;
  description: string;
  amenities: string[];
  images: ListingImage[];
  listedAt: string;
  yearBuilt: number;
  parking: number;
  furnished: boolean;
  featured?: boolean;
  agentId: string;
}

export const PROPERTY_TYPES: { id: PropertyType; label: string }[] = [
  { id: 'apartment', label: 'Apartment' },
  { id: 'villa', label: 'Villa' },
  { id: 'townhouse', label: 'Townhouse' },
  { id: 'studio', label: 'Studio' },
];
