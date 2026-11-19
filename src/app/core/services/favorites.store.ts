import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';

export const FAVORITES_KEY = 'nestfinder.favorites';

/** Saved listing ids, newest first, kept in localStorage and synced across tabs. */
@Injectable({ providedIn: 'root' })
export class FavoritesStore {
  private readonly ids = signal<string[]>(readIds());

  readonly favoriteIds = this.ids.asReadonly();
  readonly count = computed(() => this.ids().length);
  private readonly lookup = computed(() => new Set(this.ids()));

  constructor() {
    const onStorage = (event: StorageEvent) => {
      if (event.key === FAVORITES_KEY || event.key === null) this.ids.set(readIds());
    };
    window.addEventListener('storage', onStorage);
    inject(DestroyRef).onDestroy(() => window.removeEventListener('storage', onStorage));
  }

  has(id: string): boolean {
    return this.lookup().has(id);
  }

  /** Returns true when the listing is now a favorite. */
  toggle(id: string): boolean {
    if (this.has(id)) {
      this.remove(id);
      return false;
    }
    this.add(id);
    return true;
  }

  add(id: string): void {
    if (this.has(id)) return;
    this.save([id, ...this.ids()]);
  }

  remove(id: string): void {
    if (!this.has(id)) return;
    this.save(this.ids().filter((x) => x !== id));
  }

  clear(): void {
    this.save([]);
  }

  private save(ids: string[]): void {
    this.ids.set(ids);
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
    } catch {
      // storage can be full or blocked (private mode); keep the in-memory list
    }
  }
}

function readIds(): string[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(FAVORITES_KEY) ?? '[]');
    if (!Array.isArray(parsed)) return [];
    return [...new Set(parsed.filter((x): x is string => typeof x === 'string'))];
  } catch {
    return [];
  }
}
