import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Listing } from '../../core/models/listing';
import { ListingsService } from '../../core/services/listings.service';
import { AreaPipe, BathsPipe, BedsPipe, PricePipe } from '../pipes/format.pipes';
import { FavoriteButton } from './favorite-button';
import { Icon } from './icon';

@Component({
  selector: 'app-listing-card',
  imports: [RouterLink, Icon, FavoriteButton, PricePipe, AreaPipe, BedsPipe, BathsPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': '"card card--" + layout()', '[class.card--highlight]': 'highlight()' },
  templateUrl: './listing-card.html',
  styleUrl: './listing-card.scss',
})
export class ListingCard {
  private readonly listings = inject(ListingsService);

  readonly listing = input.required<Listing>();
  readonly layout = input<'grid' | 'list' | 'compact'>('grid');
  readonly highlight = input(false);

  protected readonly cover = computed(() => this.listing().images[0]);
  protected readonly city = computed(() => this.listings.cityName(this.listing().city));
  protected readonly typeLabel = computed(() => this.listings.typeLabel(this.listing().type));
  protected readonly perSqft = computed(() => Math.round(this.listing().price / this.listing().area).toLocaleString('en-US'));
}
