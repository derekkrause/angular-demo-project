import { TestBed } from '@angular/core/testing';
import { ThemeService, prefersDark } from '../theme.service';
describe('Theme outcomes', () => {
  let service: ThemeService;
  beforeEach(() => {
    localStorage.clear();
    document.body.classList.remove('dark-mode');
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });
  afterEach(() => {
    localStorage.clear();
    document.body.classList.remove('dark-mode');
  });
  it('switches the GitHub icon for dark and light backgrounds', () => {
    service.setTheme('dark');
    expect(service.githubIcon()).toBe('github_white');
    service.setTheme('light');
    expect(service.githubIcon()).toBe('github_black');
  });
  it('returns to the browser preference when the user selects system mode', () => {
    service.setTheme('dark');
    service.setTheme('system');
    expect(service.isDarkMode()).toBe(Boolean(prefersDark));
    expect(document.body.classList.contains('dark-mode')).toBe(Boolean(prefersDark));
    expect(localStorage.getItem('themePreference')).toBe('system');
  });
});
