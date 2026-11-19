import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FavoritesStore } from './core/services/favorites.store';
import { ScrollMemory } from './core/services/scroll-memory';
import { Icon } from './shared/ui/icon';
import { ToastContainer } from './shared/ui/toast-container';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Icon, ToastContainer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly favorites = inject(FavoritesStore);

  constructor() {
    inject(ScrollMemory).init();
  }
}
