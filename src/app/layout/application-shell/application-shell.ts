import { Component, signal } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { NavPanel } from '@layout/nav-panel/nav-panel';
import { TopBar } from '@layout/top-bar/top-bar';

@Component({
  selector: 'app-application-shell',
  imports: [MatSidenavModule, NavPanel, RouterOutlet, TopBar],
  templateUrl: './application-shell.html',
  styleUrl: './application-shell.scss',
})
export class ApplicationShell {
  fixedInViewport = signal<boolean>(true);
  isDesktop = signal<boolean>(true);
}
