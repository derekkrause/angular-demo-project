import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { FoodService } from '@api/food.service';
import { IResult } from '@api/models/result.interface';
import { TermCount } from '@api/models/term-count.interface';
import { ProductsReportService } from '../products-report.service';

describe('ProductsReportService', () => {
  it('returns undefined before loading and after an error without throwing', async () => {
    const stream = new Subject<IResult<TermCount>>();
    TestBed.configureTestingModule({
      providers: [ProductsReportService, { provide: FoodService, useValue: { getAdverseFoodEvents: () => stream } }],
    });
    const service = TestBed.inject(ProductsReportService);
    expect(service.foodAdverseEventResults()).toBeUndefined();
    TestBed.tick();
    expect(service.isLoading()).toBe(true);
    const failure = new Error('Request failed');
    stream.error(failure);
    await TestBed.inject(ApplicationRef).whenStable();
    TestBed.tick();
    expect(service.error()).toBe(failure);
    expect(service.isLoading()).toBe(false);
    expect(service.foodAdverseEventResults()).toBeUndefined();
  });
});
