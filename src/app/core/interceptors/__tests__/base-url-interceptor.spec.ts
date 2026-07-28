import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { baseUrlInterceptor } from '@core/interceptors/base-url-interceptor';
import { environment } from '@environments/environment';

describe('baseUrlInterceptor', () => {
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([baseUrlInterceptor])), provideHttpClientTesting()],
    });

    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('prepends the API base URL to a relative URL', () => {
    const requestUrl = 'drug/event.json';
    const client = TestBed.inject(HttpClient);
    client.get(requestUrl).subscribe();

    const request = httpTesting.expectOne(`${environment.apiBaseUrl}/${requestUrl}`);
    expect(request.request.method).toBe('GET');
    request.flush({});
  });

  it('does not add a duplicate slash when the relative URL starts with one', () => {
    const client = TestBed.inject(HttpClient);
    client.get('/drug/label.json').subscribe();

    const request = httpTesting.expectOne(`${environment.apiBaseUrl}/drug/label.json`);
    request.flush({});
  });

  it.each(['http://example.com/resource', 'https://example.com/resource', 'HTTPS://example.com/resource'])(
    'leaves the absolute URL unchanged: %s',
    (url) => {
      const client = TestBed.inject(HttpClient);
      client.get(url).subscribe();

      const request = httpTesting.expectOne(url);
      request.flush({});
    },
  );
});
