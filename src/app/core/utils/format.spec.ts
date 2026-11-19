import { bedsLabel, compactPrice, formatPrice } from './format';

describe('format', () => {
  it('formats prices in AED', () => {
    expect(formatPrice(2_750_000)).toBe('AED 2,750,000');
  });

  it('shortens prices for map markers', () => {
    expect(compactPrice(2_750_000)).toBe('2.75M');
    expect(compactPrice(3_100_000)).toBe('3.1M');
    expect(compactPrice(2_000_000)).toBe('2M');
    expect(compactPrice(24_500_000)).toBe('24.5M');
    expect(compactPrice(585_000)).toBe('585K');
  });

  it('labels studios and bedrooms', () => {
    expect(bedsLabel(0)).toBe('Studio');
    expect(bedsLabel(1)).toBe('1 bed');
    expect(bedsLabel(3)).toBe('3 beds');
  });
});
