import { By } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Result } from '@api/models/result.interface';
import { TermCount } from '@api/models/term-count.interface';
import { BarChart } from '@shared/charting/components/bar-chart/bar-chart';
import { OutcomesReport } from '../outcomes-report';

@Component({ selector: 'app-bar-chart', template: '' })
class ChartStub {
  readonly seriesName = input<string>('Products');
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

describe('OutcomesReport states', () => {
  let fixture: ComponentFixture<OutcomesReport>;
  let http: HttpTestingController;
  const element = () => fixture.nativeElement as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutcomesReport],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    })
      .overrideComponent(OutcomesReport, {
        remove: { imports: [BarChart] },
        add: { imports: [ChartStub] },
      })
      .compileComponents();
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(OutcomesReport);
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
    const rows: HTMLTableRowElement[] = Array.from(element().querySelectorAll('tbody tr'));
    expect(rows).toHaveLength(2);
    expect(rows[0].textContent).toContain('Second');
    expect(rows[1].textContent).toContain('First');
    expect(chart.seriesName()).toBe('Reported outcomes');
    expect(element().textContent).toContain('Reports may contain multiple outcomes');
    expect(element().textContent).toContain('unverified');
    expect(element().textContent).toContain('causation or incidence');
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

  it('displays all meaningful outcomes without changing the response', async () => {
    const results: TermCount[] = Array.from({ length: 12 }, (_, index) => ({
      term: 'Category ' + index,
      count: index + 1,
    }));
    const original: TermCount[] = results.map((item) => ({ ...item }));
    http.expectOne((req) => req.url.endsWith('food/event.json')).flush({ ...response, results });
    await finish();
    const chart: ChartStub = fixture.debugElement.query(By.directive(ChartStub)).componentInstance as ChartStub;
    expect(chart.data().map((item) => item.count)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    expect(results).toEqual(original);
  });

  it('omits blank and zero-count categories without changing the response', async () => {
    const results: TermCount[] = [
      { term: ' ', count: 4 },
      { term: 'Death', count: 0 },
      { term: 'Hospitalization', count: 3 },
    ];
    http.expectOne((req) => req.url.endsWith('food/event.json')).flush({ ...response, results });
    await finish();
    const chart: ChartStub = fixture.debugElement.query(By.directive(ChartStub)).componentInstance as ChartStub;
    expect(chart.data()).toEqual([{ term: 'Hospitalization', count: 3 }]);
    expect(results).toHaveLength(3);
  });

  it('shows an empty state for a successful response without results', async () => {
    http.expectOne((req) => req.url.endsWith('food/event.json')).flush({ ...response, results: [] });
    await finish();
    expect(element().textContent).toContain('No reported outcome data available.');
    expect(element().querySelector('app-bar-chart')).toBeNull();
  });
});
