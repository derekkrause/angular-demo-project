import { Component } from '@angular/core';
import { ProductsReport } from '@features/widgets/products-report/products-report';

@Component({
  selector: 'app-dashboard',
  imports: [ProductsReport],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export default class Dashboard {}
