import { OutcomesReport } from '@features/widgets/outcomes-report/outcomes-report';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
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
@Component({ selector: 'app-outcomes-report', template: 'Reported Outcomes' })
class OutcomesStub {}
describe('Application navigation outcomes', () => {
  let fixture: ComponentFixture<App>;
  let router: Router;
  let http: HttpTestingController;
  const element = (): HTMLElement => fixture.nativeElement as HTMLElement;
  beforeEach(async () => {
    vi.spyOn(MatIconRegistry.prototype, 'getNamedSvgIcon').mockImplementation(() =>
      of(document.createElementNS('http://www.w3.org/2000/svg', 'svg')),
    );
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes), provideHttpClient(), provideHttpClientTesting()],
    })
      .overrideComponent(Dashboard, {
        remove: { imports: [ProductsReport, OutcomesReport] },
        add: { imports: [ReportStub, OutcomesStub] },
      })
      .overrideComponent(Reports, { remove: { imports: [ProductsReport] }, add: { imports: [ReportStub] } })
      .compileComponents();
    fixture = TestBed.createComponent(App);
    router = TestBed.inject(Router);
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    await router.navigateByUrl('/');
    await fixture.whenStable();
    fixture.detectChanges();
  });
  afterEach(() => {
    http.verify();
    vi.restoreAllMocks();
  });
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
  it('opens the recent food recall reports when Recalls is clicked', async () => {
    const link = element().querySelector<HTMLAnchorElement>('a[href="/recalls"]')!;
    link.click();
    await vi.waitFor(() => expect(router.url).toBe('/recalls'));
    expect(router.url).toBe('/recalls');
    expect(element().querySelector('mat-toolbar')?.textContent).toContain('Recalls');
    const request = http.expectOne((req) => req.url === 'open-fda/food/enforcement.json');
    expect(request.request.params.get('sort')).toBe('report_date:desc');
    request.flush({
      meta: { disclaimer: '', terms: '', license: '', last_updated: '2026-09-23' },
      results: [],
    });
    await fixture.whenStable();
    fixture.detectChanges();
    expect(element().querySelector('app-recalls-page')?.textContent).toContain('Food recalls');
    expect(link.classList.contains('mdc-list-item--activated')).toBe(true);
    expect(document.title).toBe('Recalls');
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
