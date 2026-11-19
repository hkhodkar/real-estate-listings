import { Injectable } from '@angular/core';
import { AGENTS, CITIES, LISTINGS } from '../data/listings.data';
import { Agent, City, CityId, Listing, PROPERTY_TYPES, PropertyType } from '../models/listing';

/** Read-only access to the bundled demo listings. */
@Injectable({ providedIn: 'root' })
export class ListingsService {
  readonly all: readonly Listing[] = LISTINGS;
  readonly cities: readonly City[] = CITIES;

  private readonly byId = new Map(LISTINGS.map((l) => [l.id, l]));

  get(id: string): Listing | undefined {
    return this.byId.get(id);
  }

  agent(id: string): Agent | undefined {
    return AGENTS.find((a) => a.id === id);
  }

  cityName(id: CityId): string {
    return CITIES.find((c) => c.id === id)?.name ?? id;
  }

  typeLabel(type: PropertyType): string {
    return PROPERTY_TYPES.find((t) => t.id === type)?.label ?? type;
  }

  /** Other homes in the same community first, then the same city, closest price first. */
  similar(listing: Listing, count = 3): Listing[] {
    return LISTINGS.filter((l) => l.id !== listing.id && l.city === listing.city)
      .sort(
        (a, b) =>
          Number(b.community === listing.community) - Number(a.community === listing.community) ||
          Math.abs(a.price - listing.price) - Math.abs(b.price - listing.price),
      )
      .slice(0, count);
  }
}
