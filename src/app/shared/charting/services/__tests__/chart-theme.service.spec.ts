import { TestBed } from '@angular/core/testing';
import { ChartThemeService } from '../chart-theme.service';

describe('Chart theme tokens', () => {
  it('reports missing theme tokens rather than silently displaying incorrect colors', () => {
    TestBed.configureTestingModule({});
    const service: ChartThemeService = TestBed.inject(ChartThemeService);
    expect(() => service.activeChartTheme()).toThrow('Required chart theme property');
  });
});
