import { OutcomesReport } from '@features/widgets/outcomes-report/outcomes-report';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ProductsReport } from '@features/widgets/products-report/products-report';
import Dashboard from './dashboard';
@Component({ selector: 'app-products-report', template: 'FDA product categories' })
class ReportStub {}
@Component({ selector: 'app-outcomes-report', template: 'Reported Outcomes' })
class OutcomesStub {}
describe('Dashboard', () => {
  it('includes the product report on this page', async () => {
    await TestBed.configureTestingModule({ imports: [Dashboard] })
      .overrideComponent(Dashboard, {
        remove: { imports: [ProductsReport, OutcomesReport] },
        add: { imports: [ReportStub, OutcomesStub] },
      })
      .compileComponents();
    const fixture = TestBed.createComponent(Dashboard);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-outcomes-report')?.textContent).toContain('Reported Outcomes');
    expect(fixture.nativeElement.querySelector('app-products-report')?.textContent).toContain('FDA product categories');
  });
});
