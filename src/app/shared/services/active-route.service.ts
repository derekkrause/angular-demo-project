import { inject, Service, signal } from '@angular/core';
import { NavigationEnd, Router, TitleStrategy } from '@angular/router';
import { filter } from 'rxjs';

@Service()
export class ActiveRouteService {
  readonly #router = inject(Router);
  readonly #titleStrategy = inject(TitleStrategy);

  readonly #title = signal<string>(this.#readCurrentTitle());
  readonly title = this.#title.asReadonly();

  constructor() {
    this.#router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => this.#title.set(this.#readCurrentTitle()));
  }

  #readCurrentTitle(): string {
    let route = this.#router.routerState.snapshot.root;

    while (route.firstChild) {
      route = route.firstChild;
    }

    return this.#titleStrategy.getResolvedTitleForRoute(route) ?? '';
  }
}
