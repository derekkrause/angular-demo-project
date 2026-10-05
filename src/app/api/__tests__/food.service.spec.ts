import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FoodService } from '../food.service';
import { FoodRecall } from '../models/food-recall.interface';
import { Result } from '../models/result.interface';
import { TermCount } from '../models/term-count.interface';

describe('FoodService API contract', () => {
  let http: HttpTestingController;
  let service: FoodService;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    http = TestBed.inject(HttpTestingController);
    service = TestBed.inject(FoodService);
  });
  afterEach(() => http.verify());
  it('requests counts by industry and returns the response to its consumer', () => {
    const response: Result<TermCount> = {
      meta: { disclaimer: '', terms: '', license: '', last_updated: '2026-10-04' },
      results: [{ term: 'Food', count: 4 }],
    };
    const received = vi.fn();
    service.getAdverseFoodEvents().subscribe(received);
    const request = http.expectOne((req) => req.url === 'open-fda/food/event.json');
    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('count')).toBe('products.industry_name.exact');
    request.flush(response);
    expect(received).toHaveBeenCalledWith(response);
  });
  it('propagates a failed request so the report can display an error', () => {
    const failed = vi.fn();
    service.getAdverseFoodEvents().subscribe({ error: failed });
    http
      .expectOne((req) => req.url === 'open-fda/food/event.json')
      .flush('Unavailable', { status: 503, statusText: 'Unavailable' });
    expect(failed).toHaveBeenCalledWith(expect.objectContaining({ status: 503 }));
  });
  it('requests reported outcomes using the exact outcome field', () => {
    const response: Result<TermCount> = {
      meta: { disclaimer: '', terms: '', license: '', last_updated: '2026-10-04' },
      results: [{ term: 'Hospitalization', count: 3 }],
    };
    const received = vi.fn();
    service.getReportedFoodOutcomes().subscribe(received);
    const request = http.expectOne((req) => req.url === 'open-fda/food/event.json');
    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('count')).toBe('outcomes.exact');
    expect(request.request.params.get('limit')).toBe('1000');
    request.flush(response);
    expect(received).toHaveBeenCalledWith(response);
  });

  it('requests the 20 most recent food enforcement reports', () => {
    const response: Result<FoodRecall> = {
      meta: { disclaimer: '', terms: '', license: '', last_updated: '2026-10-04' },
      results: [{ report_date: '20260923', recall_number: 'H-1339-2026' }],
    };
    const received = vi.fn();
    service.getRecentFoodRecalls().subscribe(received);
    const request = http.expectOne((req) => req.url === 'open-fda/food/enforcement.json');
    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('limit')).toBe('20');
    expect(request.request.params.get('sort')).toBe('report_date:desc');
    request.flush(response);
    expect(received).toHaveBeenCalledWith(response);
  });
});
