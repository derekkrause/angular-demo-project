import { Component } from '@angular/core';
import { ThemeToggle } from '../theme-toggle/theme-toggle';
import { PageTitle } from "../page-title/page-title";

@Component({
  selector: 'app-nav-panel',
  imports: [ThemeToggle, PageTitle],
  templateUrl: './nav-panel.html',
  styleUrl: './nav-panel.scss',
})
export class NavPanel {}
