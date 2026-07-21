import { Component, inject, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActiveRouteService } from '@app/shared/services/active-route.service';

@Component({
  selector: 'app-top-bar',
  imports: [MatButtonModule, MatIconModule, MatToolbarModule],
  templateUrl: './top-bar.html',
  styleUrl: './top-bar.scss',
})
export class TopBar {
  readonly #activeRouteService = inject(ActiveRouteService);

  protected readonly title: Signal<string> = this.#activeRouteService.title;
}
