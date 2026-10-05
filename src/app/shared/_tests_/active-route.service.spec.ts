import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { ActiveRouteService } from '../services/active-route.service';
@Component({ template: '' })
class Page {}
describe('Route state', () => {
  it('updates the page title and URL after navigation, including query parameters', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'dashboard', component: Page, title: 'Dashboard' },
          { path: 'reports', component: Page, title: 'Reports' },
        ]),
      ],
    });
    const service: ActiveRouteService = TestBed.inject(ActiveRouteService);
    const harness: RouterTestingHarness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/dashboard');
    expect(service.title()).toBe('Dashboard');
    await harness.navigateByUrl('/reports?period=recent#totals');
    expect(service.title()).toBe('Reports');
    expect(service.url()).toBe('/reports?period=recent#totals');
  });
});
