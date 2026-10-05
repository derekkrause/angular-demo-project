import { provideHttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconRegistry } from '@angular/material/icon';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { App } from './app';
import { routes } from './app.routes';
import Dashboard from '@features/dashboard/dashboard';
import Reports from '@features/reports/reports';
import { ProductsReport } from '@features/widgets/products-report/products-report';

@Component({ selector: 'app-products-report', template: 'FDA product categories' })
class ReportStub {}
describe('Application navigation outcomes', () => {
  let fixture: ComponentFixture<App>;
  let router: Router;
  const element = (): HTMLElement => fixture.nativeElement as HTMLElement;
  beforeEach(async () => {
    vi.spyOn(MatIconRegistry.prototype, 'getNamedSvgIcon').mockImplementation(() =>
      of(document.createElementNS('http://www.w3.org/2000/svg', 'svg')),
    );
    await TestBed.configureTestingModule({ imports: [App], providers: [provideRouter(routes), provideHttpClient()] })
      .overrideComponent(Dashboard, { remove: { imports: [ProductsReport] }, add: { imports: [ReportStub] } })
      .overrideComponent(Reports, { remove: { imports: [ProductsReport] }, add: { imports: [ReportStub] } })
      .compileComponents();
    fixture = TestBed.createComponent(App);
    router = TestBed.inject(Router);
    fixture.detectChanges();
    await router.navigateByUrl('/');
    await fixture.whenStable();
    fixture.detectChanges();
  });
  afterEach(() => vi.restoreAllMocks());
  it('redirects the home URL to the dashboard and shows its report and title', () => {
    expect(router.url).toBe('/dashboard');
    expect(element().querySelector('mat-toolbar')?.textContent).toContain('Dashboard');
    expect(element().querySelector('app-dashboard app-products-report')?.textContent).toContain(
      'FDA product categories',
    );
    expect(document.title).toBe('Dashboard');
  });
  it('navigates to Reports when its visible navigation link is clicked', async () => {
    const link: HTMLAnchorElement = element().querySelector<HTMLAnchorElement>('a[href="/reports"]')!;
    expect(link).not.toBeNull();
    link.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(router.url).toBe('/reports');
    expect(element().querySelector('mat-toolbar')?.textContent).toContain('Reports');
    expect(element().querySelector('app-reports app-products-report')).not.toBeNull();
    expect(link.classList.contains('mdc-list-item--activated')).toBe(true);
    expect(document.title).toBe('Reports');
  });
  it('redirects an unknown URL to the not-found page', async () => {
    await router.navigateByUrl('/missing-page');
    await fixture.whenStable();
    fixture.detectChanges();
    expect(router.url).toBe('/not-found');
    expect(element().querySelector('app-not-found')).not.toBeNull();
    expect(document.title).toBe('Not Found');
  });
});
