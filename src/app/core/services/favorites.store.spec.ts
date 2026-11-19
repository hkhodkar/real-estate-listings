import { TestBed } from '@angular/core/testing';
import { FAVORITES_KEY, FavoritesStore } from './favorites.store';

describe('FavoritesStore', () => {
  const create = () => {
    TestBed.resetTestingModule();
    return TestBed.inject(FavoritesStore);
  };
  const stored = () => JSON.parse(localStorage.getItem(FAVORITES_KEY) ?? 'null');

  beforeEach(() => localStorage.clear());

  it('starts empty', () => {
    const store = create();
    expect(store.favoriteIds()).toEqual([]);
    expect(store.count()).toBe(0);
  });

  it('toggles a listing and persists it, newest first', () => {
    const store = create();
    expect(store.toggle('a')).toBe(true);
    store.toggle('b');
    expect(store.favoriteIds()).toEqual(['b', 'a']);
    expect(store.has('a')).toBe(true);
    expect(stored()).toEqual(['b', 'a']);

    expect(store.toggle('a')).toBe(false);
    expect(store.has('a')).toBe(false);
    expect(stored()).toEqual(['b']);
  });

  it('does not add duplicates', () => {
    const store = create();
    store.add('a');
    store.add('a');
    expect(store.count()).toBe(1);
  });

  it('restores saved ids in a new session', () => {
    create().add('villa-1');
    const next = create();
    expect(next.favoriteIds()).toEqual(['villa-1']);
  });

  it('clears everything', () => {
    const store = create();
    store.add('a');
    store.add('b');
    store.clear();
    expect(store.count()).toBe(0);
    expect(stored()).toEqual([]);
  });

  it('ignores corrupted storage', () => {
    localStorage.setItem(FAVORITES_KEY, '{not json');
    expect(create().favoriteIds()).toEqual([]);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(['a', 42, 'a', null, 'b']));
    expect(create().favoriteIds()).toEqual(['a', 'b']);
  });

  it('picks up changes made in another tab', () => {
    const store = create();
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(['from-other-tab']));
    window.dispatchEvent(new StorageEvent('storage', { key: FAVORITES_KEY }));
    expect(store.favoriteIds()).toEqual(['from-other-tab']);
  });
});
