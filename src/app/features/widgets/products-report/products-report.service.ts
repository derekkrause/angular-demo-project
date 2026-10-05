import { computed, inject, Injectable } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FoodService } from '@api/food.service';
import { Result } from '@api/models/result.interface';
import { TermCount } from '@api/models/term-count.interface';

@Injectable()
export class ProductsReportService {
  readonly #foodService = inject(FoodService);

  readonly #foodAdverseEvents = rxResource<Result<TermCount>, void>({
    stream: () => this.#foodService.getAdverseFoodEvents(),
  });

  readonly isLoading = this.#foodAdverseEvents.isLoading;
  readonly error = this.#foodAdverseEvents.error;
  readonly foodAdverseEventResults = computed(() =>
    this.#foodAdverseEvents.hasValue() ? this.#foodAdverseEvents.value() : undefined,
  );

  retry(): void {
    this.#foodAdverseEvents.reload();
  }
}
