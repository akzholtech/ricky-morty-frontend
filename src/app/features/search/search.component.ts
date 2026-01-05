import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  OnInit,
} from '@angular/core';
import { Subject, switchMap, debounceTime, tap } from 'rxjs';
import { CharacterService } from '../../core/services/character.service';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { CharacterGridComponent } from '../../shared/components/character-grid/character-grid.component';
import { LoadingSkeletonComponent } from '../../shared/components/loading-skeleton/loading-skeleton.component';
import { ThemeToggleComponent } from '../../shared/components/theme-toggle/theme-toggle.component';
import { Character, ApiInfo } from '../../core/models/character.model';

@Component({
  selector: 'app-search',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SearchBarComponent, CharacterGridComponent, LoadingSkeletonComponent, ThemeToggleComponent],
  template: `
    <div class="search-page">
      <header class="header">
        <div class="theme-toggle-wrapper">
          <app-theme-toggle />
        </div>
        <div class="logo-container">
          <h1 class="logo">
            <span class="logo-rick">Rick</span>
            <span class="logo-and">&</span>
            <span class="logo-morty">Morty</span>
          </h1>
          <p class="tagline">Multiverse Character Explorer</p>
        </div>
        <div class="portal-decoration" aria-hidden="true">
          <div class="portal-ring outer"></div>
          <div class="portal-ring middle"></div>
          <div class="portal-ring inner"></div>
        </div>
      </header>

      <main class="main-content">
        <section class="search-section" aria-label="Search characters">
          <app-search-bar (search)="onSearch($event)" />
          <div class="filter-chips" role="group" aria-label="Quick filters">
            @for (filter of quickFilters; track filter.label) {
              <button
                type="button"
                class="filter-chip"
                [class.active]="activeFilter() === filter.value"
                (click)="applyQuickFilter(filter.value)"
              >
                {{ filter.label }}
              </button>
            }
          </div>
        </section>

        <section class="results-section" aria-live="polite">
          @if (isLoading()) {
            <app-loading-skeleton />
          } @else {
            <app-character-grid
              [characters]="characters()"
              [info]="apiInfo()"
              [currentPage]="currentPage()"
              (pageChange)="onPageChange($event)"
            />
          }
        </section>
      </main>

      <footer class="footer">
        <p>
          Data provided by
          <a
            href="https://rickandmortyapi.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Rick and Morty API
          </a>
        </p>
      </footer>
    </div>
  `,
  styles: `
    .search-page {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .header {
      position: relative;
      text-align: center;
      padding: var(--space-12) var(--space-4) var(--space-8);
      overflow: hidden;
    }

    .theme-toggle-wrapper {
      position: absolute;
      top: var(--space-4);
      right: var(--space-4);
      z-index: 10;
    }

    .logo-container {
      position: relative;
      z-index: 1;
    }

    .logo {
      font-family: 'Creepster', cursive;
      font-size: clamp(2.5rem, 8vw, 5rem);
      font-weight: 400;
      line-height: 1.1;
      margin-bottom: var(--space-2);
      animation: fadeInUp 0.6s ease forwards;
    }

    .logo-rick {
      color: var(--rm-rick-blue);
      text-shadow:
        0 0 10px rgba(135, 206, 235, 0.5),
        0 0 20px rgba(135, 206, 235, 0.3);
    }

    .logo-and {
      color: var(--rm-portal-green);
      margin: 0 0.1em;
    }

    .logo-morty {
      color: var(--rm-morty-yellow);
      text-shadow:
        0 0 10px rgba(240, 230, 140, 0.5),
        0 0 20px rgba(240, 230, 140, 0.3);
    }

    .tagline {
      color: var(--text-secondary);
      font-size: 1.1rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      animation: fadeInUp 0.6s ease 0.2s forwards;
      opacity: 0;
    }

    .portal-decoration {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 400px;
      height: 400px;
      pointer-events: none;
    }

    .portal-ring {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      border: 2px solid;
      opacity: 0.15;
    }

    .portal-ring.outer {
      width: 100%;
      height: 100%;
      border-color: var(--rm-portal-green);
      animation: portalRotate 30s linear infinite;
    }

    .portal-ring.middle {
      width: 70%;
      height: 70%;
      border-color: var(--rm-portal-cyan);
      animation: portalRotate 20s linear infinite reverse;
    }

    .portal-ring.inner {
      width: 40%;
      height: 40%;
      border-color: var(--rm-dimension-pink);
      animation: portalRotate 15s linear infinite;
    }

    @keyframes portalRotate {
      from { transform: translate(-50%, -50%) rotate(0deg); }
      to { transform: translate(-50%, -50%) rotate(360deg); }
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .main-content {
      flex: 1;
      width: 100%;
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 var(--space-4) var(--space-12);
    }

    .search-section {
      margin-bottom: var(--space-10);
    }

    .filter-chips {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: var(--space-2);
      margin-top: var(--space-4);
    }

    .filter-chip {
      padding: var(--space-2) var(--space-4);
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-full);
      color: var(--text-secondary);
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .filter-chip:hover {
      border-color: var(--rm-portal-green);
      color: var(--rm-portal-green);
    }

    .filter-chip.active {
      background: var(--rm-portal-green);
      border-color: var(--rm-portal-green);
      color: #0a0a0a;
    }

    .results-section {
      min-height: 400px;
    }

    .footer {
      text-align: center;
      padding: var(--space-6) var(--space-4);
      border-top: 1px solid var(--border-color);
      color: var(--text-muted);
      font-size: 0.875rem;
    }

    .footer a {
      color: var(--rm-portal-green);
      text-decoration: none;
      transition: color var(--transition-fast);
    }

    .footer a:hover {
      color: var(--rm-portal-cyan);
      text-decoration: underline;
    }

    @media (max-width: 640px) {
      .header {
        padding: var(--space-8) var(--space-4) var(--space-6);
      }

      .tagline {
        font-size: 0.9rem;
      }

      .portal-decoration {
        width: 300px;
        height: 300px;
      }
    }
  `,
})
export class SearchComponent implements OnInit {
  private readonly characterService = inject(CharacterService);

  protected readonly isLoading = signal(true);
  protected readonly characters = signal<Character[]>([]);
  protected readonly apiInfo = signal<ApiInfo | null>(null);
  protected readonly currentPage = signal(1);
  protected readonly searchQuery = signal('');
  protected readonly activeFilter = signal<string>('');

  protected readonly quickFilters = [
    { label: 'All', value: '' },
    { label: 'Alive', value: 'alive' },
    { label: 'Dead', value: 'dead' },
    { label: 'Human', value: 'human' },
    { label: 'Alien', value: 'alien' },
  ];

  private readonly searchTrigger$ = new Subject<{ query: string; page: number }>();

  ngOnInit(): void {
    this.searchTrigger$
      .pipe(
        tap(() => this.isLoading.set(true)),
        debounceTime(300),
        switchMap(({ query, page }) =>
          this.characterService.getCharacters({
            name: query || undefined,
            status: this.isStatusFilter(this.activeFilter()) ? this.activeFilter() as 'Alive' | 'Dead' : undefined,
            species: this.isSpeciesFilter(this.activeFilter()) ? this.activeFilter() : undefined,
            page,
          })
        )
      )
      .subscribe((response) => {
        this.characters.set(response.results);
        this.apiInfo.set(response.info);
        this.isLoading.set(false);
      });

    // Initial load
    this.searchTrigger$.next({ query: '', page: 1 });
  }

  protected onSearch(query: string): void {
    this.searchQuery.set(query);
    this.currentPage.set(1);
    this.searchTrigger$.next({ query, page: 1 });
  }

  protected onPageChange(page: number): void {
    this.currentPage.set(page);
    this.searchTrigger$.next({ query: this.searchQuery(), page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  protected applyQuickFilter(value: string): void {
    this.activeFilter.set(value);
    this.currentPage.set(1);
    this.searchTrigger$.next({ query: this.searchQuery(), page: 1 });
  }

  private isStatusFilter(value: string): boolean {
    return ['alive', 'dead'].includes(value.toLowerCase());
  }

  private isSpeciesFilter(value: string): boolean {
    return ['human', 'alien'].includes(value.toLowerCase());
  }
}
