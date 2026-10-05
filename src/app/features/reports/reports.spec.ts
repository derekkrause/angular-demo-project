import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ProductsReport } from '@features/widgets/products-report/products-report';
import Reports from './reports';
@Component({ selector: 'app-products-report', template: 'FDA product categories' })
class ReportStub {}
describe('Reports', () => {
  it('includes the product report on this page', async () => {
    await TestBed.configureTestingModule({ imports: [Reports] })
      .overrideComponent(Reports, { remove: { imports: [ProductsReport] }, add: { imports: [ReportStub] } })
      .compileComponents();
    const fixture = TestBed.createComponent(Reports);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-products-report')?.textContent).toContain('FDA product categories');
  });
});
