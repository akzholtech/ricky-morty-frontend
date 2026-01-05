import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'dark' | 'light';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly storageKey = 'rm-theme';

  readonly theme = signal<Theme>(this.getInitialTheme());

  constructor() {
    effect(() => {
      const currentTheme = this.theme();
      if (this.isBrowser) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        localStorage.setItem(this.storageKey, currentTheme);
      }
    });
  }

  toggleTheme(): void {
    this.theme.update((current) => (current === 'dark' ? 'light' : 'dark'));
  }

  private getInitialTheme(): Theme {
    if (!this.isBrowser) {
      return 'dark';
    }

    const stored = localStorage.getItem(this.storageKey) as Theme | null;
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }
}
