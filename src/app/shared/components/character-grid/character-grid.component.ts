import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { Character, ApiInfo } from '../../../core/models/character.model';
import { CharacterCardComponent } from '../character-card/character-card.component';

@Component({
  selector: 'app-character-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CharacterCardComponent],
  template: `
    <section class="grid-section" aria-label="Character search results">
      @if (characters().length > 0) {
        <div class="results-header">
          <p class="results-count">
            Showing <strong>{{ characters().length }}</strong> of
            <strong>{{ info()?.count || 0 }}</strong> characters
          </p>
        </div>
        <div class="grid" role="list">
          @for (character of characters(); track character.id; let i = $index) {
            <div
              class="grid-item"
              [style.animation-delay]="(i % 20) * 50 + 'ms'"
              role="listitem"
            >
              <app-character-card [character]="character" />
            </div>
          }
        </div>
        @if (hasMorePages()) {
          <div class="pagination">
            <button
              type="button"
              class="pagination-button"
              [disabled]="!info()?.prev"
              (click)="onPrevPage()"
              aria-label="Go to previous page"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              <span>Previous</span>
            </button>
            <span class="page-info">
              Page {{ currentPage() }} of {{ info()?.pages || 1 }}
            </span>
            <button
              type="button"
              class="pagination-button"
              [disabled]="!info()?.next"
              (click)="onNextPage()"
              aria-label="Go to next page"
            >
              <span>Next</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>
          </div>
        }
      } @else {
        <div class="empty-state">
          <div class="empty-portal">
            <svg viewBox="0 0 100 100" aria-hidden="true">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="10 5"/>
              <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="8 4"/>
              <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" stroke-width="1"/>
            </svg>
          </div>
          <h3 class="empty-title">No characters found</h3>
          <p class="empty-description">
            Try searching for a different name or adjusting your filters.
            Maybe they're in another dimension?
          </p>
        </div>
      }
    </section>
  `,
  styles: `
    .grid-section {
      width: 100%;
    }

    .results-header {
      margin-bottom: var(--space-6);
    }

    .results-count {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    .results-count strong {
      color: var(--rm-portal-green);
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: var(--space-6);
    }

    .grid-item {
      animation: fadeInUp 0.5s ease forwards;
      opacity: 0;
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

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: var(--space-4);
      margin-top: var(--space-10);
      padding-top: var(--space-6);
      border-top: 1px solid var(--border-color);
    }

    .pagination-button {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-3) var(--space-5);
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      color: var(--text-primary);
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .pagination-button:hover:not(:disabled) {
      border-color: var(--rm-portal-green);
      color: var(--rm-portal-green);
      background: rgba(151, 206, 76, 0.1);
    }

    .pagination-button:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .pagination-button svg {
      width: 18px;
      height: 18px;
    }

    .page-info {
      color: var(--text-secondary);
      font-size: 0.9rem;
      min-width: 100px;
      text-align: center;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--space-16) var(--space-4);
      text-align: center;
    }

    .empty-portal {
      width: 120px;
      height: 120px;
      color: var(--text-muted);
      margin-bottom: var(--space-6);
      animation: portalSpin 20s linear infinite;
    }

    .empty-portal svg {
      width: 100%;
      height: 100%;
    }

    @keyframes portalSpin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .empty-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: var(--space-2);
    }

    .empty-description {
      color: var(--text-secondary);
      max-width: 400px;
      line-height: 1.6;
    }

    @media (max-width: 640px) {
      .grid {
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        gap: var(--space-4);
      }

      .pagination {
        flex-wrap: wrap;
      }

      .pagination-button span {
        display: none;
      }

      .pagination-button {
        padding: var(--space-3);
      }
    }
  `,
})
export class CharacterGridComponent {
  readonly characters = input.required<Character[]>();
  readonly info = input<ApiInfo | null>(null);
  readonly currentPage = input<number>(1);

  readonly pageChange = output<number>();

  protected readonly hasMorePages = computed(() => {
    const info = this.info();
    return info ? info.pages > 1 : false;
  });

  protected onPrevPage(): void {
    const current = this.currentPage();
    if (current > 1) {
      this.pageChange.emit(current - 1);
    }
  }

  protected onNextPage(): void {
    const info = this.info();
    const current = this.currentPage();
    if (info && current < info.pages) {
      this.pageChange.emit(current + 1);
    }
  }
}
