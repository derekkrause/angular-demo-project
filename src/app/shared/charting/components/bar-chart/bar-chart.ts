import { Component, computed, inject, input, Signal, untracked } from '@angular/core';
import { EChartsCoreOption } from 'echarts/core';
import { ChartTheme } from '../../chart-theme.model';
import { ChartThemeService } from '../../services/chart-theme.service';
import { EchartsBaseChart } from '../echarts-base-chart/echarts-base-chart';

@Component({
  selector: 'app-bar-chart',
  imports: [EchartsBaseChart],
  templateUrl: './bar-chart.html',
  styleUrl: './bar-chart.scss',
})
export class BarChart<T> {
  readonly #chartThemeService = inject(ChartThemeService);

  readonly data = input.required<T[]>();
  readonly xAxisKey = input.required<keyof T>();
  readonly yAxisKey = input.required<keyof T>();
  readonly seriesKey = input.required<keyof T>();

  protected readonly currentTheme: Signal<ChartTheme> = this.#chartThemeService.activeChartTheme;

  protected readonly ariaLabel = computed<string>(() => {
    const xKey = untracked(() => this.xAxisKey());
    const yKey = untracked(() => this.yAxisKey());
    const summary = this.data()
      .map((item) => `${item[xKey]}: ${item[yKey]}`)
      .join(', ');
    return `Bar chart showing the following data: ${summary}`;
  });

  protected readonly chartOptions = computed<EChartsCoreOption>(() => {
    // Keys should not change. Only want to update when data or theme changes.
    const xKey: keyof T = untracked(() => this.xAxisKey());
    const yKey: keyof T = untracked(() => this.yAxisKey());
    const seriesKey: keyof T = untracked(() => this.seriesKey());

    // Tracking changes to activeChartTheme;
    const theme = this.currentTheme();

    return {
      backgroundColor: theme.surfaceContainer,

      color: [theme.primary, theme.secondary, theme.tertiary],

      aria: {
        enabled: true,
        decal: {
          show: true,
        },
      },

      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        backgroundColor: theme.surfaceContainer,
        borderColor: theme.outlineVariant,
        textStyle: {
          color: theme.text,
        },
      },

      grid: {
        top: 24,
        right: 20,
        bottom: 44,
        left: 52,
        containLabel: true,
      },

      xAxis: {
        type: 'value',
        min: 0,
        minInterval: 1,
        data: this.data().map((item) => item[xKey]),

        axisLine: {
          lineStyle: {
            color: theme.outline,
          },
        },

        axisTick: {
          alignWithLabel: true,
        },

        axisLabel: {
          color: theme.mutedText,
        },
      },

      yAxis: {
        type: 'category',
        data: this.data().map((item) => item[yKey]),

        axisLabel: {
          color: theme.mutedText,
        },

        splitLine: {
          lineStyle: {
            color: theme.outlineVariant,
          },
        },
      },

      series: [
        {
          name: 'Products',
          type: 'bar',

          data: this.data().map((item) => item[seriesKey]),

          barMaxWidth: 72,

          itemStyle: {
            borderRadius: [6, 6, 0, 0],
          },

          emphasis: {
            focus: 'series',
          },
        },
      ],
    };
  });
}
