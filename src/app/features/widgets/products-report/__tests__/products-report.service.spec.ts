import { TestBed } from '@angular/core/testing';

import { ProductsReportService } from './products-report.service';

describe('ProductsReportService', () => {
  let service: ProductsReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductsReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
