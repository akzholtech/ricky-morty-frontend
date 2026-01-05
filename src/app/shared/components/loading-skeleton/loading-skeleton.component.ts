import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-loading-skeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="skeleton-grid" role="status" aria-label="Loading characters">
      <span class="sr-only">Loading characters, please wait...</span>
      @for (item of skeletonItems; track item) {
        <div class="skeleton-card" [style.animation-delay]="item * 100 + 'ms'">
          <div class="skeleton-image"></div>
          <div class="skeleton-content">
            <div class="skeleton-title"></div>
            <div class="skeleton-row"></div>
            <div class="skeleton-row short"></div>
            <div class="skeleton-row"></div>
            <div class="skeleton-row short"></div>
            <div class="skeleton-footer"></div>
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    .skeleton-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: var(--space-6);
    }

    .skeleton-card {
      background: var(--bg-card);
      border-radius: var(--radius-xl);
      overflow: hidden;
      border: 1px solid var(--border-color);
      animation: fadeIn 0.3s ease forwards;
      opacity: 0;
    }

    @keyframes fadeIn {
      to { opacity: 1; }
    }

    .skeleton-image {
      aspect-ratio: 1;
      background: linear-gradient(
        90deg,
        var(--gray-800) 0%,
        var(--gray-700) 50%,
        var(--gray-800) 100%
      );
      background-size: 200% 100%;
      animation: shimmer 1.5s ease-in-out infinite;
    }

    .skeleton-content {
      padding: var(--space-4);
    }

    .skeleton-title {
      height: 24px;
      width: 70%;
      background: linear-gradient(
        90deg,
        var(--gray-700) 0%,
        var(--gray-600) 50%,
        var(--gray-700) 100%
      );
      background-size: 200% 100%;
      border-radius: var(--radius-md);
      margin-bottom: var(--space-4);
      animation: shimmer 1.5s ease-in-out infinite;
    }

    .skeleton-row {
      height: 16px;
      width: 100%;
      background: linear-gradient(
        90deg,
        var(--gray-700) 0%,
        var(--gray-600) 50%,
        var(--gray-700) 100%
      );
      background-size: 200% 100%;
      border-radius: var(--radius-sm);
      margin-bottom: var(--space-2);
      animation: shimmer 1.5s ease-in-out infinite;
    }

    .skeleton-row.short {
      width: 60%;
    }

    .skeleton-footer {
      height: 16px;
      width: 40%;
      background: linear-gradient(
        90deg,
        var(--gray-700) 0%,
        var(--gray-600) 50%,
        var(--gray-700) 100%
      );
      background-size: 200% 100%;
      border-radius: var(--radius-sm);
      margin-top: var(--space-4);
      animation: shimmer 1.5s ease-in-out infinite;
    }

    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    @media (max-width: 640px) {
      .skeleton-grid {
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        gap: var(--space-4);
      }
    }
  `,
})
export class LoadingSkeletonComponent {
  readonly count = input<number>(8);

  protected readonly skeletonItems = Array.from({ length: 8 }, (_, i) => i);
}
