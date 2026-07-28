import { computed, DOCUMENT, inject, Service, Signal } from '@angular/core';
import { Theme, ThemeService } from '@app/core/theme/services/theme.service';
import { ChartTheme } from '../chart-theme.model';

@Service()
export class ChartThemeService {
  readonly #document = inject(DOCUMENT);
  readonly #themeService = inject(ThemeService);

  readonly #currentTheme: Signal<Theme> = this.#themeService.theme;

  activeChartTheme = computed<ChartTheme>(() => {
    // read #currentTheme for changes
    this.#currentTheme();

    const styles = getComputedStyle(this.#document.documentElement);
    const colorProbe = this.#document.createElement('span');
    colorProbe.style.display = 'none';
    this.#document.body.append(colorProbe);

    try {
      return {
        primary: this.#read(styles, colorProbe, '--app-chart-primary'),
        secondary: this.#read(styles, colorProbe, '--app-chart-secondary'),
        tertiary: this.#read(styles, colorProbe, '--app-chart-tertiary'),
        error: this.#read(styles, colorProbe, '--app-chart-error'),

        text: this.#read(styles, colorProbe, '--app-chart-text'),
        mutedText: this.#read(styles, colorProbe, '--app-chart-muted-text'),

        surface: this.#read(styles, colorProbe, '--app-chart-surface'),
        surfaceContainer: this.#read(styles, colorProbe, '--app-chart-surface-container'),

        outline: this.#read(styles, colorProbe, '--app-chart-outline'),
        outlineVariant: this.#read(styles, colorProbe, '--app-chart-outline-variant'),
      };
    } finally {
      colorProbe.remove();
    }
  });

  #read(styles: CSSStyleDeclaration, colorProbe: HTMLElement, property: string): string {
    const value = styles.getPropertyValue(property).trim();

    if (!value) {
      throw new Error(`Required chart theme property ${property} is missing.`);
    }

    // Canvas renderers cannot interpret CSS custom properties. Let the browser
    // resolve nested Material tokens (and light-dark()) to a concrete color.
    colorProbe.style.color = `var(${property})`;
    return getComputedStyle(colorProbe).color;
  }
}
