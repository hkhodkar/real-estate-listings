import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Homes for sale in the UAE | Nestfinder',
    loadComponent: () => import('./features/listings/listings-page').then((m) => m.ListingsPage),
  },
  {
    path: 'listings/:id',
    loadComponent: () => import('./features/property/property-page').then((m) => m.PropertyPage),
  },
  {
    path: 'favorites',
    title: 'Saved homes | Nestfinder',
    loadComponent: () => import('./features/favorites/favorites-page').then((m) => m.FavoritesPage),
  },
  { path: 'listings', redirectTo: '', pathMatch: 'full' },
  {
    path: '**',
    title: 'Page not found | Nestfinder',
    loadComponent: () => import('./features/not-found/not-found-page').then((m) => m.NotFoundPage),
  },
];
