import { computed, inject, Injectable, ResourceRef, Signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FoodService } from '@api/food.service';
import { Result } from '@api/models/result.interface';
import { TermCount } from '@api/models/term-count.interface';

@Injectable()
export class OutcomesReportService {
  readonly #foodService: FoodService = inject(FoodService);
  readonly #outcomes: ResourceRef<Result<TermCount> | undefined> = rxResource<Result<TermCount>, void>({
    stream: () => this.#foodService.getReportedFoodOutcomes(),
  });
  readonly isLoading: Signal<boolean> = this.#outcomes.isLoading;
  readonly error: Signal<Error | undefined> = this.#outcomes.error;
  readonly report: Signal<Result<TermCount> | undefined> = computed(() =>
    this.#outcomes.hasValue() ? this.#outcomes.value() : undefined,
  );
  retry(): void {
    this.#outcomes.reload();
  }
}
