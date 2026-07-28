import { Component, computed, effect, inject } from '@angular/core';
import { IResult } from '@app/api/models/result.interface';
import { BarChart } from '@app/shared/charting/components/bar-chart/bar-chart';
import { ProductsReportService } from './products-report.service';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-products-report',
  imports: [BarChart, MatCardModule],
  providers: [ProductsReportService],
  templateUrl: './products-report.html',
  styleUrl: './products-report.scss',
})
export class ProductsReport {
  #reportService = inject(ProductsReportService);

  productMeta = computed<IResult['meta']>(() => {
    return this.#reportService.foodAdverseEventResults().meta;
  });

  productResults = computed<IResult['results']>(() => {
    const results = this.#reportService.foodAdverseEventResults().results;

    return results.sort((a, b) => a.count - b.count).slice(-10);
  });

  constructor() {
    effect(() => {
      console.log('product results: ', this.productResults());
    });
  }
}
