import { Component } from '@angular/core';
import { OutcomesReport } from '@features/widgets/outcomes-report/outcomes-report';
import { ProductsReport } from '@features/widgets/products-report/products-report';

@Component({
  selector: 'app-dashboard',
  imports: [ProductsReport, OutcomesReport],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export default class Dashboard {}
