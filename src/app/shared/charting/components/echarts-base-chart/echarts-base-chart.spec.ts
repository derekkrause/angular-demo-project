import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ECharts } from 'echarts/core';

import { ChartTheme } from '../../chart-theme.model';
import { ECHARTS_INIT } from '../../echarts.registry';
import { EchartsBaseChart } from './echarts-base-chart';

describe('EchartsBaseChart', () => {
  let component: EchartsBaseChart;
  let fixture: ComponentFixture<EchartsBaseChart>;
  let resizeObserverCallback: ResizeObserverCallback;
  let resizeObserver: Pick<ResizeObserver, 'disconnect' | 'observe'>;
  let chart: Pick<ECharts, 'dispose' | 'resize' | 'setOption'>;

  const chartTheme: ChartTheme = {
    primary: '#000000',
    secondary: '#000000',
    tertiary: '#000000',
    error: '#000000',
    surface: '#ffffff',
    surfaceContainer: '#ffffff',
    outline: '#000000',
    outlineVariant: '#000000',
    text: '#000000',
    mutedText: '#000000',
  };

  beforeEach(async () => {
    chart = {
      dispose: vi.fn(),
      resize: vi.fn(),
      setOption: vi.fn(),
    };
    resizeObserver = {
      disconnect: vi.fn(),
      observe: vi.fn(),
    };

    vi.stubGlobal(
      'ResizeObserver',
      vi.fn(function (callback: ResizeObserverCallback) {
        resizeObserverCallback = callback;
        return resizeObserver;
      }),
    );

    await TestBed.configureTestingModule({
      imports: [EchartsBaseChart],
      providers: [{ provide: ECHARTS_INIT, useValue: vi.fn(() => chart as ECharts) }],
    }).compileComponents();

    fixture = TestBed.createComponent(EchartsBaseChart);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('ariaLabel', 'Product totals');
    fixture.componentRef.setInput('options', {});
    fixture.componentRef.setInput('chartTheme', chartTheme);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('initializes the chart and exposes its accessible description', () => {
    expect(component).toBeTruthy();
    expect(fixture.nativeElement.querySelector('[role="img"]').getAttribute('aria-label')).toBe('Product totals');
    expect(chart.setOption).toHaveBeenCalledWith({}, { notMerge: true, lazyUpdate: false });
  });
  it('updates the displayed chart when options and its description change', () => {
    const options = { series: [{ type: 'bar', data: [8] }] };
    fixture.componentRef.setInput('options', options);
    fixture.componentRef.setInput('ariaLabel', 'Updated product totals');
    fixture.detectChanges();
    expect(chart.setOption).toHaveBeenLastCalledWith(options, { notMerge: true, lazyUpdate: false });
    expect(fixture.nativeElement.querySelector('[role="img"]').getAttribute('aria-label')).toBe(
      'Updated product totals',
    );
  });

  it('resizes the chart when its container changes size', () => {
    const container = fixture.nativeElement.querySelector('.chart') as HTMLDivElement;

    expect(resizeObserver.observe).toHaveBeenCalledWith(container);

    resizeObserverCallback([], resizeObserver as ResizeObserver);

    expect(chart.resize).toHaveBeenCalledOnce();
  });

  it('disconnects the observer and disposes the chart when destroyed', () => {
    fixture.destroy();

    expect(resizeObserver.disconnect).toHaveBeenCalledOnce();
    expect(chart.dispose).toHaveBeenCalledOnce();
  });
});
