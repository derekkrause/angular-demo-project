import { computed, inject, Injectable } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FoodService } from '@app/api/food.service';
import { IResult } from '@app/api/models/result.interface';

@Injectable()
export class ProductsReportService {
  readonly #foodService = inject(FoodService);

  readonly foodAdverseEventResults = computed<IResult>(() => this.#foodAdverseEvents.value());

  readonly #foodAdverseEvents = rxResource<IResult, void>({
    defaultValue: {} as IResult,
    stream: () => {
      return this.#foodService.getAdverseFoodEvents();
    }
  });
}
