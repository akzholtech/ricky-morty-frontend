import {
  Component,
  ChangeDetectionStrategy,
  output,
  signal,
  ElementRef,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  template: `
    <div class="search-container" [class.focused]="isFocused()">
      <div class="search-glow"></div>
      <div class="search-wrapper">
        <div class="portal-icon" [class.spinning]="isSearching()">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
        <input
          #searchInput
          type="search"
          [ngModel]="searchQuery()"
          (ngModelChange)="onSearchChange($event)"
          (focus)="isFocused.set(true)"
          (blur)="isFocused.set(false)"
          (keyup.enter)="onSearch()"
          placeholder="Search characters across dimensions..."
          class="search-input"
          aria-label="Search for Rick and Morty characters"
          autocomplete="off"
        />
        @if (searchQuery()) {
          <button
            type="button"
            class="clear-button"
            (click)="clearSearch()"
            aria-label="Clear search"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        }
        <button
          type="button"
          class="search-button"
          (click)="onSearch()"
          [disabled]="!searchQuery()"
          aria-label="Submit search"
        >
          <span class="button-text">Search</span>
          <div class="button-glow"></div>
        </button>
      </div>
    </div>
  `,
  styles: `
    .search-container {
      position: relative;
      width: 100%;
      max-width: 700px;
      margin: 0 auto;
    }

    .search-glow {
      position: absolute;
      inset: -2px;
      background: var(--portal-gradient);
      border-radius: var(--radius-2xl);
      opacity: 0;
      filter: blur(8px);
      transition: opacity var(--transition-base);
      z-index: -1;
    }

    .search-container.focused .search-glow {
      opacity: 0.6;
      animation: portalPulse 2s ease-in-out infinite;
    }

    .search-wrapper {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      background: var(--bg-input);
      backdrop-filter: blur(12px);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-2xl);
      padding: var(--space-3) var(--space-4);
      transition: all var(--transition-base);
    }

    .search-container.focused .search-wrapper {
      border-color: var(--rm-portal-green);
      background: var(--bg-card-hover);
    }

    .portal-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      color: var(--text-muted);
      transition: all var(--transition-base);
      flex-shrink: 0;
    }

    .search-container.focused .portal-icon {
      color: var(--rm-portal-green);
    }

    .portal-icon.spinning svg {
      animation: portalSpin 1s linear infinite;
    }

    .portal-icon svg {
      width: 100%;
      height: 100%;
    }

    .search-input {
      flex: 1;
      background: transparent;
      border: none;
      color: var(--text-primary);
      font-size: 1rem;
      font-weight: 400;
      outline: none;
      min-width: 0;
    }

    .search-input::placeholder {
      color: var(--text-muted);
    }

    .search-input::-webkit-search-cancel-button {
      display: none;
    }

    .clear-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      background: var(--gray-700);
      border: none;
      border-radius: var(--radius-full);
      color: var(--gray-400);
      cursor: pointer;
      transition: all var(--transition-fast);
      flex-shrink: 0;
    }

    .clear-button:hover {
      background: var(--gray-600);
      color: var(--gray-100);
    }

    .clear-button svg {
      width: 14px;
      height: 14px;
    }

    .search-button {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-2) var(--space-5);
      background: var(--portal-gradient);
      border: none;
      border-radius: var(--radius-xl);
      color: var(--rm-dark-space);
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      overflow: hidden;
      transition: all var(--transition-base);
      flex-shrink: 0;
    }

    .search-button:hover:not(:disabled) {
      transform: scale(1.05);
      box-shadow: 0 0 20px rgba(151, 206, 76, 0.4);
    }

    .search-button:active:not(:disabled) {
      transform: scale(0.98);
    }

    .search-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .button-text {
      position: relative;
      z-index: 1;
    }

    .button-glow {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.3) 50%,
        transparent 100%
      );
      transform: translateX(-100%);
      transition: transform 0.6s ease;
    }

    .search-button:hover:not(:disabled) .button-glow {
      transform: translateX(100%);
    }

    @keyframes portalPulse {
      0%, 100% { opacity: 0.6; }
      50% { opacity: 0.8; }
    }

    @keyframes portalSpin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @media (max-width: 640px) {
      .search-wrapper {
        padding: var(--space-2) var(--space-3);
      }

      .search-button {
        padding: var(--space-2) var(--space-3);
      }

      .button-text {
        font-size: 0.8rem;
      }
    }
  `,
})
export class SearchBarComponent {
  readonly search = output<string>();

  protected readonly searchQuery = signal('');
  protected readonly isFocused = signal(false);
  protected readonly isSearching = signal(false);

  private readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  protected onSearchChange(value: string): void {
    this.searchQuery.set(value);
  }

  protected onSearch(): void {
    const query = this.searchQuery().trim();
    if (query) {
      this.isSearching.set(true);
      this.search.emit(query);
      setTimeout(() => this.isSearching.set(false), 500);
    }
  }

  protected clearSearch(): void {
    this.searchQuery.set('');
    this.search.emit('');
    this.searchInput()?.nativeElement.focus();
  }
}
