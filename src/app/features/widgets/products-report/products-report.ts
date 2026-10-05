import { Component, computed, inject, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BarChart } from '@shared/charting/components/bar-chart/bar-chart';
import { ProductsReportService } from './products-report.service';
import { Result } from '@api/models/result.interface';
import { TermCount } from '@api/models/term-count.interface';

@Component({
  selector: 'app-products-report',
  imports: [BarChart, MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule],
  providers: [ProductsReportService],
  templateUrl: './products-report.html',
  styleUrl: './products-report.scss',
})
export class ProductsReport {
  readonly #reportService = inject(ProductsReportService);

  protected readonly isLoading: Signal<boolean> = this.#reportService.isLoading;
  protected readonly error: Signal<Error | undefined> = this.#reportService.error;
  protected readonly report: Signal<Result<TermCount> | undefined> = this.#reportService.foodAdverseEventResults;
  protected readonly productResults: Signal<TermCount[]> = computed(
    () =>
      this.report()
        ?.results.toSorted((a, b) => a.count - b.count)
        .slice(-10) ?? [],
  );

  protected retry(): void {
    this.#reportService.retry();
  }
}
