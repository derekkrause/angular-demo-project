import { Component, signal } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { NavPanel } from '../nav-panel/nav-panel';

@Component({
  selector: 'app-application-shell',
  imports: [MatSidenavModule, NavPanel, RouterOutlet],
  templateUrl: './application-shell.html',
  styleUrl: './application-shell.scss',
})
export class ApplicationShell {
  fixedInViewport = signal<boolean>(true);
  isDesktop = signal<boolean>(true);
}
