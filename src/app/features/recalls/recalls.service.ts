import { computed, inject, Injectable, ResourceRef, Signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FoodRecall } from '@api/models/food-recall.interface';
import { Result } from '@api/models/result.interface';
import { FoodService } from '@api/food.service';

@Injectable()
export class RecallsService {
  readonly #foodService = inject(FoodService);
  readonly #recalls: ResourceRef<Result<FoodRecall> | undefined> = rxResource<Result<FoodRecall>, void>({
    stream: () => this.#foodService.getRecentFoodRecalls(),
  });

  readonly isLoading: Signal<boolean> = this.#recalls.isLoading;
  readonly error: Signal<Error | undefined> = this.#recalls.error;
  readonly report: Signal<Result<FoodRecall> | undefined> = computed(() =>
    this.#recalls.hasValue() ? this.#recalls.value() : undefined,
  );

  retry(): void {
    this.#recalls.reload();
  }
}