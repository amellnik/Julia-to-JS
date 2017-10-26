import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { environment } from '../environments/environment';

import 'rxjs/add/operator/map';

@Injectable()
export class ApiService {

  private headers = new Headers({
    'Content-Type': 'application-x-www-form-urlencoded'
  });
  private options = new RequestOptions({
    headers: this.headers
  })

  constructor(private http: Http) { }

  submitForJS(jlCode:string, jlFunction:string, jlTypes:string) {
    let body = `script=${encodeURIComponent(jlCode)}&function=${encodeURIComponent(jlFunction)}&types=${encodeURIComponent(jlTypes)}`;
    return this.http.post(environment.api_base + '/incomming', body, this.options)
      .map(res => res.json())
  }



}
