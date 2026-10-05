import { DOCUMENT } from '@angular/common';
import { computed, inject, Service, signal } from '@angular/core';

const THEME_PREFERENCE_LOCAL_STORAGE_KEY = 'themePreference';
const PREFERS_COLOR_SCHEME_DARK = '(prefers-color-scheme: dark)';
const DARK_MODE_CLASS_NAME = 'dark-mode';

const initialTheme: Theme = (localStorage.getItem(THEME_PREFERENCE_LOCAL_STORAGE_KEY) as Theme) ?? 'system';
export const prefersDark: boolean = window.matchMedia?.(PREFERS_COLOR_SCHEME_DARK).matches ?? false;

export type Theme = 'system' | 'dark' | 'light';

@Service()
export class ThemeService {
  readonly #document = inject(DOCUMENT);

  readonly theme = signal<Theme>(initialTheme);

  readonly isDarkMode = computed<boolean>(() => {
    const theme = this.theme();

    return theme === 'dark' || (theme === 'system' && prefersDark);
  });

  readonly githubIcon = computed<string>(() => {
    return this.isDarkMode() ? 'github_white' : 'github_black';
  });

  constructor() {
    this.#applyTheme(initialTheme);
  }

  setTheme(theme: Theme): void {
    // Update the DOM before notifying signal consumers. Components such as
    // canvas charts read computed CSS tokens as soon as this signal changes.
    this.#applyTheme(theme);
    this.theme.set(theme);
    localStorage.setItem(THEME_PREFERENCE_LOCAL_STORAGE_KEY, theme);
  }

  #applyTheme(theme: Theme): void {
    const isDark = theme === 'dark' || (theme === 'system' && prefersDark);
    this.#document.body.classList.toggle(DARK_MODE_CLASS_NAME, isDark);
  }
}
