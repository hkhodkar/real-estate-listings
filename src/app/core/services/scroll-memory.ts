import { inject, Injectable } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';

/**
 * Scrolls to the top when the page changes, but not when only query params
 * change (filters), and restores the old position on back/forward.
 */
@Injectable({ providedIn: 'root' })
export class ScrollMemory {
  private readonly router = inject(Router);
  private readonly positions = new Map<number, number>();
  private currentId = 0;
  private restoreId: number | null = null;
  private lastPath = '';

  init(): void {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.positions.set(this.currentId, window.scrollY);
        this.restoreId = event.restoredState?.navigationId ?? null;
      } else if (event instanceof NavigationEnd) {
        this.currentId = event.id;
        const path = event.urlAfterRedirects.split(/[?#]/)[0];
        const saved = this.restoreId !== null ? this.positions.get(this.restoreId) : undefined;
        if (saved !== undefined) {
          // wait for the restored page to render before scrolling
          setTimeout(() => window.scrollTo({ top: saved, behavior: 'instant' }), 30);
        } else if (path !== this.lastPath) {
          window.scrollTo({ top: 0, behavior: 'instant' });
        }
        this.lastPath = path;
      }
    });
  }
}
