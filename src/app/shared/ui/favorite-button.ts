import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { FavoritesStore } from '../../core/services/favorites.store';
import { ToastService } from '../../core/services/toast.service';
import { Icon } from './icon';

@Component({
  selector: 'app-favorite-button',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button type="button" class="fav" [class.fav--active]="active()" [class.fav--labelled]="labelled()"
      [attr.aria-pressed]="active()" [attr.aria-label]="labelled() ? null : (active() ? 'Remove ' : 'Save ') + title() + (active() ? ' from favorites' : ' to favorites')"
      (click)="toggle($event)">
      <app-icon name="heart" [filled]="active()" [size]="labelled() ? 18 : 20" />
      @if (labelled()) {
        <span>{{ active() ? 'Saved' : 'Save' }}</span>
      }
    </button>
  `,
  styleUrl: './favorite-button.scss',
})
export class FavoriteButton {
  private readonly store = inject(FavoritesStore);
  private readonly toast = inject(ToastService);

  readonly listingId = input.required<string>();
  readonly title = input('this home');
  /** Outline button with text instead of the round icon used on photos. */
  readonly labelled = input(false);

  protected readonly active = computed(() => this.store.has(this.listingId()));

  protected toggle(event: Event): void {
    event.stopPropagation();
    const id = this.listingId();
    const saved = this.store.toggle(id);
    if (saved) {
      this.toast.show('Saved to favorites');
    } else {
      this.toast.show('Removed from favorites', { label: 'Undo', run: () => this.store.add(id) });
    }
  }
}
