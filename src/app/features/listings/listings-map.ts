import { LocationStrategy } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  output,
  untracked,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { escapeHtml, L, osmTiles } from '../../core/map/leaflet';
import { Listing } from '../../core/models/listing';
import { FavoritesStore } from '../../core/services/favorites.store';
import { bathsLabel, bedsLabel, compactPrice, formatArea, formatPrice } from '../../core/utils/format';
import { Icon } from '../../shared/ui/icon';

@Component({
  selector: 'app-listings-map',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div #mapEl class="map" role="region" aria-label="Map of listings"></div>
    <button type="button" class="map__fit btn btn--outline btn--sm" (click)="fitToResults(true)" [disabled]="!listings().length">
      <app-icon name="focus" [size]="16" /> Fit results
    </button>
    @if (!listings().length) {
      <div class="map__empty">No homes in this area match your filters</div>
    }
  `,
  styles: `
    :host { position: relative; display: block; overflow: hidden; border: 1px solid var(--border); border-radius: var(--radius); }
    .map { width: 100%; height: 100%; background: #e8eef0; }
    .map__fit { position: absolute; top: 12px; right: 12px; z-index: 500; box-shadow: var(--shadow-sm); }
    .map__empty {
      position: absolute; top: 50%; left: 50%; z-index: 500; transform: translate(-50%, -50%);
      padding: 12px 18px; border-radius: 12px; background: var(--surface); box-shadow: var(--shadow); font-weight: 600; text-align: center;
    }
  `,
})
export class ListingsMap {
  private readonly router = inject(Router);
  private readonly location = inject(LocationStrategy);
  private readonly favorites = inject(FavoritesStore);

  readonly listings = input.required<Listing[]>();
  readonly highlightedId = input<string | null>(null);
  readonly markerSelect = output<string>();

  private readonly mapEl = viewChild.required<ElementRef<HTMLElement>>('mapEl');
  private map?: L.Map;
  private readonly markers = new Map<string, L.Marker>();
  /** Once the user pans or zooms we stop re-fitting the map on resize. */
  private touched = false;

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const el = this.mapEl().nativeElement;
      this.map = L.map(el, { zoomControl: true, attributionControl: true }).setView([25.0, 55.2], 8);
      osmTiles().addTo(this.map);
      this.map.on('popupopen', (e) => this.wirePopup(e.popup));
      // far out, price pills overlap, so they shrink to dots until you zoom in
      const updateZoomClass = () => el.classList.toggle('zoomed-out', (this.map?.getZoom() ?? 0) < 11);
      this.map.on('zoomend', updateZoomClass);
      updateZoomClass();
      for (const type of ['mousedown', 'touchstart', 'wheel', 'keydown']) {
        el.addEventListener(type, () => (this.touched = true), { passive: true });
      }

      const resize = new ResizeObserver(() => {
        this.map?.invalidateSize();
        if (!this.touched) this.fitToResults(false);
      });
      resize.observe(el);
      destroyRef.onDestroy(() => {
        resize.disconnect();
        this.map?.remove();
      });

      this.renderMarkers(untracked(this.listings));
      this.fitToResults(false);
    });

    // new results: redraw markers and zoom to them
    effect(() => {
      const listings = this.listings();
      if (!this.map) return;
      untracked(() => {
        this.renderMarkers(listings);
        this.fitToResults(true);
      });
    });

    // hovered card or saved homes changed: restyle markers
    effect(() => {
      const active = this.highlightedId();
      this.favorites.favoriteIds();
      for (const [id, marker] of this.markers) {
        const el = marker.getElement();
        el?.classList.toggle('is-active', id === active);
        el?.classList.toggle('is-fav', this.favorites.has(id));
        marker.setZIndexOffset(id === active ? 1000 : 0);
      }
    });
  }

  fitToResults(animate: boolean): void {
    const listings = this.listings();
    if (!this.map || !listings.length) return;
    if (listings.length === 1) {
      this.map.setView([listings[0].lat, listings[0].lng], 14, { animate });
      return;
    }
    const bounds = L.latLngBounds(listings.map((l) => [l.lat, l.lng] as L.LatLngTuple));
    this.map.fitBounds(bounds, { padding: [48, 48], maxZoom: 14, animate });
  }

  private renderMarkers(listings: Listing[]): void {
    if (!this.map) return;
    this.map.closePopup();
    for (const marker of this.markers.values()) marker.remove();
    this.markers.clear();

    for (const listing of listings) {
      const classes = ['price-marker'];
      if (listing.id === this.highlightedId()) classes.push('is-active');
      if (this.favorites.has(listing.id)) classes.push('is-fav');
      const icon = L.divIcon({
        className: classes.join(' '),
        html: `<span>${compactPrice(listing.price)}</span>`,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
        popupAnchor: [0, -36],
      });
      const marker = L.marker([listing.lat, listing.lng], {
        icon,
        title: `${listing.title}, ${formatPrice(listing.price)}`,
        riseOnHover: true,
        keyboard: true,
      })
        .bindPopup(() => this.popupHtml(listing), { closeButton: true, minWidth: 240, maxWidth: 260, className: 'listing-popup' })
        .on('click', () => this.markerSelect.emit(listing.id))
        .addTo(this.map);
      this.markers.set(listing.id, marker);
    }
  }

  private href(id: string): string {
    return this.location.prepareExternalUrl(this.router.serializeUrl(this.router.createUrlTree(['/listings', id])));
  }

  private popupHtml(l: Listing): string {
    const facts = [bedsLabel(l.beds), bathsLabel(l.baths), formatArea(l.area)].join(' · ');
    return `
      <a class="map-card" href="${this.href(l.id)}" data-id="${escapeHtml(l.id)}">
        <img src="${l.images[0].src}" alt="" width="260" height="146" />
        <span class="map-card__body">
          <strong>${formatPrice(l.price)}</strong>
          <span class="map-card__title">${escapeHtml(l.title)}</span>
          <span class="map-card__meta">${escapeHtml(l.community)}</span>
          <span class="map-card__meta">${facts}</span>
        </span>
      </a>`;
  }

  // popup links are plain HTML, so route them through the router to avoid a full reload
  private wirePopup(popup: L.Popup): void {
    const link = popup.getElement()?.querySelector<HTMLAnchorElement>('a.map-card');
    link?.addEventListener('click', (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.button !== 0) return;
      event.preventDefault();
      this.router.navigate(['/listings', link.dataset['id']]);
    });
  }
}
