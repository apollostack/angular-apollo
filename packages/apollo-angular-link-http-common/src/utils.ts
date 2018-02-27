import {
  HttpHeaders,
  HttpResponse,
  HttpParams,
  HttpClient,
} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

import {Request} from './types';

export const fetch = (
  req: Request,
  httpClient: HttpClient,
): Observable<HttpResponse<Object>> => {
  const shouldUseBody =
    ['POST', 'PUT', 'PATCH'].indexOf(req.method.toUpperCase()) !== -1;
  const shouldStringify = (param: string) =>
    ['variables', 'extensions'].indexOf(param.toLowerCase()) !== -1;

  // `body` for some, `params` for others
  let bodyOrParams = {};

  if (shouldUseBody) {
    bodyOrParams = {
      body: req.body,
    };
  } else {
    const params = Object.keys(req.body).reduce((httpParams, param) => {
      let val: string = (req.body as any)[param];
      if (shouldStringify(param.toLowerCase())) {
        val = JSON.stringify(val);
      }
      return httpParams.set(param, val);
    }, new HttpParams());

    bodyOrParams = {params};
  }

  // create a request
  return httpClient.request<Object>(req.method, req.url, {
    observe: 'response',
    responseType: 'json',
    reportProgress: false,
    ...bodyOrParams,
    ...req.options,
  });
};

export const mergeHeaders = (
  source: HttpHeaders,
  destination: HttpHeaders,
): HttpHeaders => {
  if (source && destination) {
    const merged = destination
      .keys()
      .reduce(
        (headers, name) => headers.set(name, destination.getAll(name)),
        source,
      );

    return merged;
  }

  return destination || source;
};

export function prioritize<T>(first: T, second: T, init: T): T {
  if (typeof first !== 'undefined') {
    init = first;
  } else if (typeof second !== 'undefined') {
    init = second;
  }

  return init;
}
