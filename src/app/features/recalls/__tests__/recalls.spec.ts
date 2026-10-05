import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import Recalls from '../recalls';

describe('Recalls page', () => {
  let fixture: ComponentFixture<Recalls>;
  let http: HttpTestingController;
  const element = (): HTMLElement => fixture.nativeElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Recalls],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(Recalls);
    fixture.detectChanges();
    TestBed.tick();
    fixture.detectChanges();
  });

  afterEach(() => http.verify());

  async function finish(): Promise<void> {
    await fixture.whenStable();
    fixture.detectChanges();
  }

  it('shows recent report details and the data limitation notice', async () => {
    expect(element().querySelector('mat-spinner')).not.toBeNull();
    http
      .expectOne((req) => req.url.endsWith('food/enforcement.json'))
      .flush({
        meta: { disclaimer: '', terms: '', license: '', last_updated: '2026-09-23' },
        results: [
          {
            report_date: '20260923',
            recall_number: 'H-1339-2026',
            classification: 'Class I',
            recalling_firm: 'Everything Sprouts, LLC',
            product_description: 'Crunchy Protein Sprout Mix',
            reason_for_recall: 'Potential contamination with Salmonella.',
            state: 'MN',
          },
        ],
      });
    await finish();
    expect(element().textContent).toContain('Food recalls');
    expect(element().textContent).toContain('2026-09-23');
    expect(element().textContent).toContain('Class I');
    expect(element().textContent).toContain('Everything Sprouts, LLC');
    expect(element().textContent).toContain('Potential contamination with Salmonella.');
    expect(element().textContent).toContain('not a real-time alert');
  });

  it('offers retry after an API error', async () => {
    http
      .expectOne((req) => req.url.endsWith('food/enforcement.json'))
      .flush('Unavailable', { status: 503, statusText: 'Unavailable' });
    await finish();
    expect(element().querySelector('[role="alert"]')?.textContent).toContain('Unable to load recall reports');
    element().querySelector<HTMLButtonElement>('button')!.click();
    TestBed.tick();
    fixture.detectChanges();
    expect(element().querySelector('mat-spinner')).not.toBeNull();
    http
      .expectOne((req) => req.url.endsWith('food/enforcement.json'))
      .flush({ meta: { disclaimer: '', terms: '', license: '', last_updated: '2026-09-23' }, results: [] });
    await finish();
    expect(element().textContent).toContain('No food recall reports are available.');
  });
});