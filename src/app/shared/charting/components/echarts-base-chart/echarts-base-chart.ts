import { afterNextRender, Component, effect, ElementRef, input, OnDestroy, viewChild } from '@angular/core';
import { ECharts, EChartsCoreOption } from 'echarts/core';
import { ChartTheme } from '../../chart-theme.model';
import { echarts } from '../../echarts.registry';

@Component({
  selector: 'app-echarts-base-chart',
  templateUrl: './echarts-base-chart.html',
  styleUrl: './echarts-base-chart.scss',
})
export class EchartsBaseChart implements OnDestroy {
  readonly ariaLabel = input.required<string>();
  readonly options = input.required<EChartsCoreOption>();
  readonly chartTheme = input.required<ChartTheme>();

  readonly chartContainer = viewChild.required<ElementRef<HTMLDivElement>>('chartContainer');

  #chart: ECharts | undefined;
  #resizeObserver: ResizeObserver | undefined;

  constructor() {
    afterNextRender({
      write: () => {
        this.#initializeChart();
      },
    });

    effect(() => {
      const options = this.options();

      // Establish reactive dependency on theme/render changes.
      this.chartTheme();

      this.#updateChart(options);
    });
  }

  ngOnDestroy(): void {
    this.#resizeObserver?.disconnect();
    this.#resizeObserver = undefined;

    this.#chart?.dispose();
    this.#chart = undefined;
  }

  #initializeChart(): void {
    const container = this.chartContainer().nativeElement;

    this.#chart = echarts.init(container, this.chartTheme());

    this.#resizeObserver?.observe(container);

    this.#updateChart(this.options());
  }

  #updateChart(options: EChartsCoreOption): void {
    this.#chart?.setOption(options, {
      notMerge: true,
      lazyUpdate: false,
    });
  }
}
