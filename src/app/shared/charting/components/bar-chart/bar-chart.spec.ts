import { Component, input, signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { EChartsCoreOption } from 'echarts/core';
import { ChartTheme } from '../../chart-theme.model';
import { ChartThemeService } from '../../services/chart-theme.service';
import { EchartsBaseChart } from '../echarts-base-chart/echarts-base-chart';
import { BarChart } from './bar-chart';

interface Row {
  term: string;
  count: number;
}
@Component({ selector: 'app-echarts-base-chart', template: '<div role="img" [attr.aria-label]="ariaLabel()"></div>' })
class ChartStub {
  readonly ariaLabel = input.required<string>();
  readonly options = input.required<EChartsCoreOption>();
  readonly chartTheme = input.required<ChartTheme>();
}
describe('Bar chart presentation', () => {
  let fixture: ComponentFixture<BarChart<Row>>;
  let theme: WritableSignal<ChartTheme>;
  const chart = (): ChartStub => fixture.debugElement.query(By.directive(ChartStub)).componentInstance as ChartStub;
  beforeEach(async () => {
    theme = signal<ChartTheme>({
      primary: '#111111',
      secondary: '#222222',
      tertiary: '#333333',
      error: '#ff0000',
      surface: '#ffffff',
      surfaceContainer: '#eeeeee',
      outline: '#444444',
      outlineVariant: '#555555',
      text: '#000000',
      mutedText: '#666666',
    });
    await TestBed.configureTestingModule({
      imports: [BarChart],
      providers: [{ provide: ChartThemeService, useValue: { activeChartTheme: theme } }],
    })
      .overrideComponent(BarChart, { remove: { imports: [EchartsBaseChart] }, add: { imports: [ChartStub] } })
      .compileComponents();
    fixture = TestBed.createComponent(BarChart<Row>);
    fixture.componentRef.setInput('data', [{ term: 'Food', count: 5 }]);
    fixture.componentRef.setInput('xAxisKey', 'count');
    fixture.componentRef.setInput('yAxisKey', 'term');
    fixture.componentRef.setInput('seriesKey', 'count');
    fixture.detectChanges();
  });
  it('renders category labels and counts with an accessible description', () => {
    expect(chart().options()).toMatchObject({ yAxis: { data: ['Food'] }, series: [{ data: [5] }] });
    expect(fixture.nativeElement.querySelector('[role="img"]').getAttribute('aria-label')).toContain('5: Food');
  });
  it('updates the visible series and description when new data arrives', () => {
    fixture.componentRef.setInput('data', [{ term: 'Drinks', count: 9 }]);
    fixture.detectChanges();
    expect(chart().options()).toMatchObject({ yAxis: { data: ['Drinks'] }, series: [{ data: [9] }] });
    expect(chart().ariaLabel()).toContain('9: Drinks');
    expect(chart().ariaLabel()).not.toContain('Food');
  });
  it('updates chart colors when the application theme changes', () => {
    theme.set({ ...theme(), primary: '#abcdef', text: '#fedcba' });
    fixture.detectChanges();
    expect(chart().options()).toMatchObject({
      color: ['#abcdef', theme().secondary, theme().tertiary],
      tooltip: { textStyle: { color: '#fedcba' } },
    });
  });
});
