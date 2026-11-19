const full = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

export function formatPrice(price: number): string {
  return `AED ${full.format(price)}`;
}

/** Short form used on map markers, e.g. 2.75M or 585K. */
export function compactPrice(price: number): string {
  if (price >= 1_000_000) {
    const m = price / 1_000_000;
    return `${m >= 10 ? m.toFixed(1).replace(/\.0$/, '') : m.toFixed(2).replace(/\.?0+$/, '')}M`;
  }
  return `${Math.round(price / 1000)}K`;
}

export function formatArea(sqft: number): string {
  return `${full.format(sqft)} sqft`;
}

export function formatDate(iso: string): string {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function bedsLabel(beds: number): string {
  if (beds === 0) return 'Studio';
  return `${beds} bed${beds === 1 ? '' : 's'}`;
}

export function bathsLabel(baths: number): string {
  return `${baths} bath${baths === 1 ? '' : 's'}`;
}
