import { By } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Result } from '@api/models/result.interface';
import { TermCount } from '@api/models/term-count.interface';
import { BarChart } from '@shared/charting/components/bar-chart/bar-chart';
import { ProductsReport } from '../products-report';

@Component({ selector: 'app-bar-chart', template: '' })
class ChartStub {
  readonly data = input.required<TermCount[]>();
  readonly xAxisKey = input.required<string>();
  readonly yAxisKey = input.required<string>();
  readonly seriesKey = input.required<string>();
}

const response: Result<TermCount> = {
  meta: { disclaimer: '', terms: '', license: '', last_updated: '2026-10-04' },
  results: [
    { term: 'First', count: 5 },
    { term: 'Second', count: 1 },
  ],
};

describe('ProductsReport states', () => {
  let fixture: ComponentFixture<ProductsReport>;
  let http: HttpTestingController;
  const element = () => fixture.nativeElement as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsReport],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    })
      .overrideComponent(ProductsReport, {
        remove: { imports: [BarChart] },
        add: { imports: [ChartStub] },
      })
      .compileComponents();
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ProductsReport);
    fixture.detectChanges();
    TestBed.tick();
    fixture.detectChanges();
  });

  afterEach(() => http.verify());

  async function finish(): Promise<void> {
    await fixture.whenStable();
    fixture.detectChanges();
  }

  it('shows a spinner until data arrives, then renders metadata and a chart', async () => {
    expect(element().querySelector('mat-spinner')).not.toBeNull();
    expect(element().querySelector('app-bar-chart')).toBeNull();
    expect(element().querySelector('mat-card-subtitle')).toBeNull();
    http.expectOne((req) => req.url.endsWith('food/event.json')).flush(response);
    await finish();
    expect(element().querySelector('mat-spinner')).toBeNull();
    expect(element().querySelector('app-bar-chart')).not.toBeNull();
    expect(element().textContent).toContain('2026-10-04');
    const chart: ChartStub = fixture.debugElement.query(By.directive(ChartStub)).componentInstance as ChartStub;
    expect(chart.data()).toEqual([
      { term: 'Second', count: 1 },
      { term: 'First', count: 5 },
    ]);
    expect(response.results.map((item) => item.count)).toEqual([5, 1]);
  });

  it('shows an error and retries with a spinner before recovering', async () => {
    http
      .expectOne((req) => req.url.endsWith('food/event.json'))
      .flush('failure', { status: 500, statusText: 'Server Error' });
    await finish();
    expect(element().querySelector('[role="alert"]')?.textContent).toContain('Unable to load');
    expect(element().querySelector('app-bar-chart')).toBeNull();
    element().querySelector<HTMLButtonElement>('button')!.click();
    TestBed.tick();
    fixture.detectChanges();
    expect(element().querySelector('mat-spinner')).not.toBeNull();
    http.expectOne((req) => req.url.endsWith('food/event.json')).flush(response);
    await finish();
    expect(element().querySelector('[role="alert"]')).toBeNull();
    expect(element().querySelector('app-bar-chart')).not.toBeNull();
  });

  it('displays only the ten highest categories without changing the response', async () => {
    const results: TermCount[] = Array.from({ length: 12 }, (_, index) => ({
      term: 'Category ' + index,
      count: index,
    }));
    const original: TermCount[] = results.map((item) => ({ ...item }));
    http.expectOne((req) => req.url.endsWith('food/event.json')).flush({ ...response, results });
    await finish();
    const chart: ChartStub = fixture.debugElement.query(By.directive(ChartStub)).componentInstance as ChartStub;
    expect(chart.data().map((item) => item.count)).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    expect(results).toEqual(original);
  });

  it('shows an empty state for a successful response without results', async () => {
    http.expectOne((req) => req.url.endsWith('food/event.json')).flush({ ...response, results: [] });
    await finish();
    expect(element().textContent).toContain('No product-category data available.');
    expect(element().querySelector('app-bar-chart')).toBeNull();
  });
});
