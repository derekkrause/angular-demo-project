import { Component, computed, inject, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FoodRecall } from '@api/models/food-recall.interface';
import { Result } from '@api/models/result.interface';
import { RecallsService } from './recalls.service';

@Component({
  selector: 'app-recalls-page',
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  providers: [RecallsService],
  templateUrl: './recalls.html',
  styleUrl: './recalls.scss',
})
export default class Recalls {
  readonly #service = inject(RecallsService);

  protected readonly isLoading: Signal<boolean> = this.#service.isLoading;
  protected readonly error: Signal<Error | undefined> = this.#service.error;
  protected readonly report: Signal<Result<FoodRecall> | undefined> = this.#service.report;
  protected readonly recalls: Signal<FoodRecall[]> = computed(() => this.report()?.results ?? []);

  protected formatReportDate(date: string | undefined): string {
    if (!date || date.length !== 8) return 'Date unavailable';
    return `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`;
  }

  protected retry(): void {
    this.#service.retry();
  }
}