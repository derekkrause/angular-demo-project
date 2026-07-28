import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { routes } from './app.routes';
import { baseUrlInterceptor } from './core/interceptors/base-url-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(() => {
      const sanitizer = inject(DomSanitizer);
      const iconRegistry = inject(MatIconRegistry);
      iconRegistry.setDefaultFontSetClass('material-symbols-outlined');
      registerIcon('github_black', 'github-icons/github_black.svg', sanitizer, iconRegistry);
      registerIcon('github_white', 'github-icons/github_white.svg', sanitizer, iconRegistry);
      registerIcon('github_lockup_black', 'github-icons/github_lockup_black.svg', sanitizer, iconRegistry);
      registerIcon('github_lockup_white', 'github-icons/github_lockup_white.svg', sanitizer, iconRegistry);
    }),
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([baseUrlInterceptor])),
    provideRouter(routes),
  ],
};

function registerIcon(iconName: string, path: string, sanitizer: DomSanitizer, registry: MatIconRegistry): void {
  registry.addSvgIcon(iconName, sanitizer.bypassSecurityTrustResourceUrl(path));
}
