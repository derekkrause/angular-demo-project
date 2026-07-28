import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { IResult } from './models/result.interface';
import { OPEN_FDA_PREFIX } from '@app/core/interceptors/base-url-interceptor';

@Service()
export class FoodService {
  #http = inject(HttpClient);

  //#region ADVERSE EVENTS
  getAdverseFoodEvents(): Observable<IResult> {
    const params = new HttpParams().set('count', 'products.industry_name.exact');

    return this.#http.get<IResult>(OPEN_FDA_PREFIX + 'food/event.json', { params });
  }
}
