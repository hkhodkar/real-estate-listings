import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ListingFilters, SORT_OPTIONS, SortKey, ViewMode } from '../../core/models/filters';
import { ListingsService } from '../../core/services/listings.service';
import { applyFilters, filtersFromParams, filtersToParams, viewFromParams } from '../../core/utils/listing-filters';
import { Icon } from '../../shared/ui/icon';
import { ListingCard } from '../../shared/ui/listing-card';
import { FilterBar } from './filter-bar';
import { ListingsMap } from './listings-map';

@Component({
  selector: 'app-listings-page',
  imports: [FilterBar, ListingCard, ListingsMap, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './listings-page.html',
  styleUrl: './listings-page.scss',
})
export class ListingsPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly listings = inject(ListingsService);

  private readonly params = toSignal(this.route.queryParams, { initialValue: {} as Params });

  protected readonly filters = computed(() => filtersFromParams(this.params()));
  protected readonly view = computed(() => viewFromParams(this.params()));
  protected readonly results = computed(() => applyFilters([...this.listings.all], this.filters()));
  protected readonly cityCount = this.listings.cities.length;
  protected readonly total = this.listings.all.length;
  protected readonly sortOptions = SORT_OPTIONS;
  protected readonly views: { id: ViewMode; label: string; icon: 'grid' | 'list' | 'map' }[] = [
    { id: 'grid', label: 'Grid', icon: 'grid' },
    { id: 'list', label: 'List', icon: 'list' },
    { id: 'map', label: 'Map', icon: 'map' },
  ];

  /** Card hovered in the map view, mirrored on its marker. */
  protected readonly highlightedId = signal<string | null>(null);

  protected updateFilters(filters: ListingFilters): void {
    this.navigate(filters, this.view(), true);
  }

  protected setSort(event: Event): void {
    const sort = (event.target as HTMLSelectElement).value as SortKey;
    this.navigate({ ...this.filters(), sort }, this.view(), true);
  }

  protected setView(view: ViewMode): void {
    if (view !== this.view()) this.navigate(this.filters(), view, false);
  }

  protected clearFilters(): void {
    this.navigate(filtersFromParams({ sort: this.filters().sort }), this.view(), true);
  }

  protected highlight(id: string | null): void {
    this.highlightedId.set(id);
  }

  protected onMarkerSelect(id: string): void {
    this.highlightedId.set(id);
    document.getElementById(`listing-${id}`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  private navigate(filters: ListingFilters, view: ViewMode, replaceUrl: boolean): void {
    const queryParams: Params = { ...filtersToParams(filters) };
    if (view !== 'grid') queryParams['view'] = view;
    this.router.navigate([], { relativeTo: this.route, queryParams, replaceUrl });
  }
}
