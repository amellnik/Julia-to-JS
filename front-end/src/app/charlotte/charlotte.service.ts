import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { environment } from '../../environments/environment';

import 'rxjs/add/operator/map';

@Injectable()
export class CharlotteService {

  private headers = new Headers({
    'Content-Type': 'application/json'
  });
  private options = new RequestOptions({
    // headers: this.headers
  });

  constructor(private http: Http) { }

  submitForWat(jlCode:string, jlFunction:string, jlTypes:string) {
    let body =`{
      "definition": "${encodeURIComponent(jlCode)}",
      "function": "${encodeURIComponent(jlFunction)}",
      "types": "Tuple{${encodeURIComponent(jlTypes)},}"
    }`;
    return this.http.post(environment.charlotte_api_base + '/convert', body, this.options)
      .map(res => res.json())
  }

}
