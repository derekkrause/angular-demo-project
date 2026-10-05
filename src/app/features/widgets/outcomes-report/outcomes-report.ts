import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { Result } from '@api/models/result.interface';
import { TermCount } from '@api/models/term-count.interface';
import { BarChart } from '@shared/charting/components/bar-chart/bar-chart';
import { OutcomesReportService } from './outcomes-report.service';

@Component({
  selector: 'app-outcomes-report',
  imports: [
    DecimalPipe,
    BarChart,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
  ],
  providers: [OutcomesReportService],
  templateUrl: './outcomes-report.html',
  styleUrl: './outcomes-report.scss',
})
export class OutcomesReport {
  readonly #service: OutcomesReportService = inject(OutcomesReportService);
  protected readonly isLoading: Signal<boolean> = this.#service.isLoading;
  protected readonly error: Signal<Error | undefined> = this.#service.error;
  protected readonly report: Signal<Result<TermCount> | undefined> = this.#service.report;
  protected readonly outcomes: Signal<TermCount[]> = computed(() =>
    (this.report()?.results ?? [])
      .filter((item) => item.term.trim().length > 0 && item.count > 0)
      .toSorted((a, b) => a.count - b.count),
  );
  protected readonly chartHeight: Signal<number> = computed(() => Math.max(352, this.outcomes().length * 44 + 100));
  protected readonly columns: string[] = ['outcome', 'count'];
  protected retry(): void {
    this.#service.retry();
  }
}
