import { afterNextRender, ChangeDetectionStrategy, Component, computed, DestroyRef, ElementRef, inject, input, viewChild } from '@angular/core';
import { L, osmTiles } from '../../core/map/leaflet';

@Component({
  selector: 'app-location-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div #mapEl class="mini-map" role="region" [attr.aria-label]="'Map showing ' + label()"></div>
    <a class="mini-map__link" [href]="osmUrl()" target="_blank" rel="noopener">Open larger map</a>
  `,
  styles: `
    :host { position: relative; display: block; overflow: hidden; border: 1px solid var(--border); border-radius: var(--radius); }
    .mini-map { height: 320px; background: #e8eef0; }
    .mini-map__link {
      position: absolute; top: 12px; right: 12px; z-index: 500; padding: 8px 12px; border-radius: 8px;
      background: var(--surface); box-shadow: var(--shadow-sm); color: var(--text); font-size: 0.85rem; font-weight: 600; text-decoration: none;
    }
    .mini-map__link:hover { color: var(--primary); }
    @media (max-width: 560px) { .mini-map { height: 260px; } }
  `,
})
export class LocationMap {
  readonly lat = input.required<number>();
  readonly lng = input.required<number>();
  readonly label = input('');

  protected readonly osmUrl = computed(
    () => `https://www.openstreetmap.org/?mlat=${this.lat()}&mlon=${this.lng()}#map=15/${this.lat()}/${this.lng()}`,
  );
  private readonly mapEl = viewChild.required<ElementRef<HTMLElement>>('mapEl');

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const center: L.LatLngTuple = [this.lat(), this.lng()];
      // scroll wheel zoom stays off so the page can scroll past the map
      const map = L.map(this.mapEl().nativeElement, { scrollWheelZoom: false }).setView(center, 14);
      osmTiles().addTo(map);
      L.circle(center, { radius: 450, color: '#0f766e', weight: 1, fillOpacity: 0.12 }).addTo(map);
      L.marker(center, { title: this.label(), keyboard: false }).addTo(map);
      const resize = new ResizeObserver(() => map.invalidateSize());
      resize.observe(this.mapEl().nativeElement);
      destroyRef.onDestroy(() => {
        resize.disconnect();
        map.remove();
      });
    });
  }
}
