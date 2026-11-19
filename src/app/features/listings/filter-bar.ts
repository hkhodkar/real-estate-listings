import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { BEDS_OPTIONS, BedsFilter, ListingFilters } from '../../core/models/filters';
import { CityId, PROPERTY_TYPES, PropertyType } from '../../core/models/listing';
import { ListingsService } from '../../core/services/listings.service';
import { activeFilterCount, sameFilters } from '../../core/utils/listing-filters';
import { Icon } from '../../shared/ui/icon';

@Component({
  selector: 'app-filter-bar',
  imports: [ReactiveFormsModule, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './filter-bar.html',
  styleUrl: './filter-bar.scss',
})
export class FilterBar {
  readonly filters = input.required<ListingFilters>();
  readonly filtersChange = output<ListingFilters>();

  protected readonly cities = inject(ListingsService).cities;
  protected readonly types = PROPERTY_TYPES;
  protected readonly bedsOptions = BEDS_OPTIONS;
  protected readonly activeCount = computed(() => activeFilterCount(this.filters()));
  /** Filters are collapsed behind a button on small screens. */
  protected readonly expanded = signal(false);

  private lastEmitted: ListingFilters | null = null;

  protected readonly form = new FormGroup({
    q: new FormControl('', { nonNullable: true }),
    city: new FormControl<CityId | null>(null),
    type: new FormControl<PropertyType | null>(null),
    minPrice: new FormControl<number | null>(null),
    maxPrice: new FormControl<number | null>(null),
    beds: new FormControl<BedsFilter | null>(null),
  });

  constructor() {
    // URL -> form (back button, "clear filters", shared links)
    let previous: ListingFilters | null = null;
    effect(() => {
      const filters = this.filters();
      const prev = previous;
      previous = filters;
      // a sort change must not wipe what is still being typed
      if (prev && sameFilters({ ...filters, sort: prev.sort }, prev)) return;
      // our own update coming back through the URL
      if (this.lastEmitted && sameFilters(filters, { ...this.lastEmitted, sort: filters.sort })) return;
      if (sameFilters(filters, this.current())) return;
      this.lastEmitted = null;
      const { sort: _sort, ...values } = filters;
      this.form.setValue(values, { emitEvent: false });
    });

    // form -> URL
    this.form.valueChanges.pipe(debounceTime(250), takeUntilDestroyed(inject(DestroyRef))).subscribe(() => {
      const next = this.current();
      if (sameFilters(next, this.filters())) return;
      this.lastEmitted = next;
      this.filtersChange.emit(next);
    });
  }

  protected toggleExpanded(): void {
    this.expanded.update((v) => !v);
  }

  protected clear(): void {
    this.form.reset();
  }

  private current(): ListingFilters {
    const v = this.form.getRawValue();
    const price = (n: number | null) => (n == null || !Number.isFinite(n) || n < 0 ? null : Math.round(n));
    return {
      q: v.q.trim(),
      city: v.city,
      type: v.type,
      minPrice: price(v.minPrice),
      maxPrice: price(v.maxPrice),
      beds: v.beds,
      sort: this.filters().sort,
    };
  }
}
