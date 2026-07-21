import { Component } from '@angular/core';
import { ThemeToggle } from '../theme-toggle/theme-toggle';
import { PageTitle } from '../page-title/page-title';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

interface NavOption {
  title: string;
  path: string;
}

@Component({
  selector: 'app-nav-panel',
  imports: [MatButtonModule, MatIconModule, MatListModule, PageTitle, RouterLink, ThemeToggle],
  templateUrl: './nav-panel.html',
  styleUrl: './nav-panel.scss',
})
export class NavPanel {
  protected readonly navOptions: NavOption[] = [
    {
      title: 'Dashboard',
      path: '/dashboard',
    },
    {
      title: 'Recalls',
      path: '/recalls'
    },
    {
      title: 'Watchlist',
      path: '/watchlist'
    },
    {
      title: 'Companies',
      path: '/companies'
    },
    {
      title: 'Reports',
      path: '/reports'
    },
    {
      title: 'Settings',
      path: '/settings'
    }
  ];
}
