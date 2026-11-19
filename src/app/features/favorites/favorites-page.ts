import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Listing } from '../../core/models/listing';
import { FavoritesStore } from '../../core/services/favorites.store';
import { ListingsService } from '../../core/services/listings.service';
import { ToastService } from '../../core/services/toast.service';
import { PricePipe } from '../../shared/pipes/format.pipes';
import { ConfirmDialog } from '../../shared/ui/confirm-dialog';
import { Icon } from '../../shared/ui/icon';
import { ListingCard } from '../../shared/ui/listing-card';

@Component({
  selector: 'app-favorites-page',
  imports: [RouterLink, ListingCard, ConfirmDialog, Icon, PricePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './favorites-page.html',
  styleUrl: './favorites-page.scss',
})
export class FavoritesPage {
  private readonly store = inject(FavoritesStore);
  private readonly listings = inject(ListingsService);
  private readonly toast = inject(ToastService);

  /** Saved homes in the order they were saved; ids of removed listings are skipped. */
  protected readonly saved = computed(() =>
    this.store
      .favoriteIds()
      .map((id) => this.listings.get(id))
      .filter((l): l is Listing => !!l),
  );
  protected readonly totalValue = computed(() => this.saved().reduce((sum, l) => sum + l.price, 0));
  protected readonly cityCount = computed(() => new Set(this.saved().map((l) => l.city)).size);
  protected readonly confirmOpen = signal(false);

  protected askClear(): void {
    this.confirmOpen.set(true);
  }

  protected closeConfirm(): void {
    this.confirmOpen.set(false);
  }

  protected clearAll(): void {
    const previous = this.store.favoriteIds();
    this.store.clear();
    this.confirmOpen.set(false);
    this.toast.show(`Removed ${previous.length} saved ${previous.length === 1 ? 'home' : 'homes'}`, {
      label: 'Undo',
      run: () => [...previous].reverse().forEach((id) => this.store.add(id)),
    });
  }
}
