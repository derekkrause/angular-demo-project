import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemeToggle } from './theme-toggle';

describe('ThemeToggle', () => {
  let component: ThemeToggle;
  let fixture: ComponentFixture<ThemeToggle>;

  const selectTheme = async (ariaLabel: string): Promise<void> => {
    const trigger = fixture.nativeElement.querySelector(
      'button[aria-label^="Change theme"]',
    ) as HTMLButtonElement | null;

    expect(trigger).toBeTruthy();

    trigger?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const menuItem = Array.from(document.body.querySelectorAll<HTMLButtonElement>('button[role="menuitem"]')).find(
      (button) => button.getAttribute('aria-label') === ariaLabel,
    );

    expect(menuItem).toBeTruthy();

    menuItem?.click();
    fixture.detectChanges();
    await fixture.whenStable();
  };

  beforeEach(async () => {
    localStorage.clear();
    document.body.classList.remove('dark-mode');

    await TestBed.configureTestingModule({
      imports: [ThemeToggle],
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeToggle);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => {
    localStorage.clear();
    document.body.classList.remove('dark-mode');
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('updates localStorage when the user selects dark mode', async () => {
    await selectTheme('Dark Mode');

    expect(localStorage.getItem('themePreference')).toBe('dark');
  });

  it('updates localStorage when the user selects light mode', async () => {
    await selectTheme('Light Mode');

    expect(localStorage.getItem('themePreference')).toBe('light');
  });

  it('updates localStorage when the user selects the system default', async () => {
    await selectTheme('System Default');

    expect(localStorage.getItem('themePreference')).toBe('system');
  });

  it('adds dark-mode to the body when isDarkMode is true', async () => {
    await selectTheme('Dark Mode');

    expect(component.isDarkMode()).toBe(true);
    expect(document.body.classList.contains('dark-mode')).toBe(true);
  });

  it('removes dark-mode from the body when isDarkMode is false', async () => {
    document.body.classList.add('dark-mode');

    await selectTheme('Light Mode');

    expect(component.isDarkMode()).toBe(false);
    expect(document.body.classList.contains('dark-mode')).toBe(false);
  });
});
