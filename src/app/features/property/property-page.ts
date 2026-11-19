import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { ListingsService } from '../../core/services/listings.service';
import { ToastService } from '../../core/services/toast.service';
import { AreaPipe, BathsPipe, BedsPipe, PricePipe, ShortDatePipe } from '../../shared/pipes/format.pipes';
import { FavoriteButton } from '../../shared/ui/favorite-button';
import { Icon } from '../../shared/ui/icon';
import { ListingCard } from '../../shared/ui/listing-card';
import { ContactForm } from './contact-form';
import { Gallery } from './gallery';
import { LocationMap } from './location-map';

@Component({
  selector: 'app-property-page',
  imports: [RouterLink, Icon, FavoriteButton, ListingCard, Gallery, LocationMap, ContactForm, PricePipe, AreaPipe, BedsPipe, BathsPipe, ShortDatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './property-page.html',
  styleUrl: './property-page.scss',
})
export class PropertyPage {
  private readonly listings = inject(ListingsService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly location = inject(Location);

  /** Route param. */
  readonly id = input.required<string>();

  protected readonly listing = computed(() => this.listings.get(this.id()));
  protected readonly agent = computed(() => {
    const listing = this.listing();
    return listing ? this.listings.agent(listing.agentId) : undefined;
  });
  protected readonly similar = computed(() => {
    const listing = this.listing();
    return listing ? this.listings.similar(listing) : [];
  });
  protected readonly cityName = computed(() => {
    const listing = this.listing();
    return listing ? this.listings.cityName(listing.city) : '';
  });
  protected readonly typeLabel = computed(() => {
    const listing = this.listing();
    return listing ? this.listings.typeLabel(listing.type) : '';
  });
  protected readonly perSqft = computed(() => {
    const listing = this.listing();
    return listing ? Math.round(listing.price / listing.area).toLocaleString('en-US') : '';
  });
  protected readonly initials = computed(() =>
    (this.agent()?.name ?? '')
      .split(' ')
      .map((part) => part[0])
      .join(''),
  );

  constructor() {
    const title = inject(Title);
    effect(() => {
      const listing = this.listing();
      title.setTitle(listing ? `${listing.title} in ${listing.community} | Nestfinder` : 'Listing not found | Nestfinder');
    });
  }

  protected back(): void {
    // go back to the filtered results when we came from there, otherwise open the list
    if (this.router.lastSuccessfulNavigation()?.previousNavigation) this.location.back();
    else this.router.navigate(['/']);
  }

  protected async share(): Promise<void> {
    try {
      await navigator.clipboard.writeText(window.location.href);
      this.toast.show('Link copied to clipboard');
    } catch {
      this.toast.show('Could not copy the link');
    }
  }
}
