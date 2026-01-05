import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      class="theme-toggle"
      (click)="themeService.toggleTheme()"
      [attr.aria-label]="ariaLabel()"
      [attr.title]="ariaLabel()"
    >
      <div class="toggle-track">
        <div class="toggle-thumb" [class.light]="isLight()">
          <svg
            class="icon sun"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
          <svg
            class="icon moon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            aria-hidden="true"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </div>
      </div>
    </button>
  `,
  styles: `
    .theme-toggle {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      background: transparent;
      border: none;
      cursor: pointer;
      outline: none;
    }

    .toggle-track {
      width: 56px;
      height: 30px;
      background: var(--toggle-track-bg, rgba(39, 39, 42, 0.8));
      border: 1px solid var(--toggle-track-border, var(--gray-600));
      border-radius: var(--radius-full);
      padding: 3px;
      transition: all var(--transition-base);
    }

    .theme-toggle:hover .toggle-track {
      border-color: var(--rm-portal-green);
    }

    .theme-toggle:focus-visible .toggle-track {
      outline: 2px solid var(--rm-portal-green);
      outline-offset: 2px;
    }

    .toggle-thumb {
      position: relative;
      width: 22px;
      height: 22px;
      background: var(--portal-gradient);
      border-radius: 50%;
      transition: transform var(--transition-spring);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .toggle-thumb.light {
      transform: translateX(26px);
    }

    .icon {
      position: absolute;
      width: 14px;
      height: 14px;
      color: var(--rm-dark-space);
      transition: all var(--transition-base);
    }

    .icon.sun {
      opacity: 0;
      transform: rotate(-90deg) scale(0.5);
    }

    .icon.moon {
      opacity: 1;
      transform: rotate(0deg) scale(1);
    }

    .toggle-thumb.light .icon.sun {
      opacity: 1;
      transform: rotate(0deg) scale(1);
    }

    .toggle-thumb.light .icon.moon {
      opacity: 0;
      transform: rotate(90deg) scale(0.5);
    }
  `,
})
export class ThemeToggleComponent {
  protected readonly themeService = inject(ThemeService);

  protected readonly isLight = computed(() => this.themeService.theme() === 'light');

  protected readonly ariaLabel = computed(() =>
    this.isLight() ? 'Switch to dark mode' : 'Switch to light mode'
  );
}
