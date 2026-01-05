import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/search/search.component').then((m) => m.SearchComponent),
  },
  {
    path: 'character/:id',
    loadComponent: () =>
      import('./features/character-detail/character-detail.component').then(
        (m) => m.CharacterDetailComponent
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
