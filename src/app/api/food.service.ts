import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { FoodRecall } from './models/food-recall.interface';
import { TermCount } from './models/term-count.interface';
import { Result } from './models/result.interface';
import { OPEN_FDA_PREFIX } from '@app/core/interceptors/base-url-interceptor';

@Service()
export class FoodService {
  #http = inject(HttpClient);

  //#region ADVERSE EVENTS
  getAdverseFoodEvents(): Observable<Result<TermCount>> {
    const params = new HttpParams().set('count', 'products.industry_name.exact');

    return this.#http.get<Result<TermCount>>(OPEN_FDA_PREFIX + 'food/event.json', { params });
  }
  getReportedFoodOutcomes(): Observable<Result<TermCount>> {
    const params = new HttpParams().set('count', 'outcomes.exact').set('limit', '1000');
    return this.#http.get<Result<TermCount>>(OPEN_FDA_PREFIX + 'food/event.json', { params });
  }

  getRecentFoodRecalls(limit = 20): Observable<Result<FoodRecall>> {
    const params = new HttpParams().set('limit', limit).set('sort', 'report_date:desc');
    return this.#http.get<Result<FoodRecall>>(OPEN_FDA_PREFIX + 'food/enforcement.json', { params });
  }
}
