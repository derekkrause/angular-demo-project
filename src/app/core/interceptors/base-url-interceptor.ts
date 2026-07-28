import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { environment } from '@environments/environment';

export const OPEN_FDA_PREFIX = 'open-fda/';

export const baseUrlInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  if (!req.url.startsWith(OPEN_FDA_PREFIX)) return next(req);

  const path = req.url.slice(OPEN_FDA_PREFIX.length);
  const url = joinUrl(environment.apiBaseUrl, path);

  return next(
    req.clone({
      url,
    }),
  );
};

function joinUrl(baseUrl: string, path: string): string {
  return `${baseUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}
