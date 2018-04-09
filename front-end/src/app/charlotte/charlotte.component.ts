import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { CharlotteService } from './charlotte.service';

import 'codemirror/mode/julia/julia';
import * as wabt from './libwabt.js';


@Component({
  selector: 'app-charlotte',
  templateUrl: './charlotte.component.html',
  styleUrls: ['./charlotte.component.css'],
  providers: [CharlotteService]
})
export class CharlotteComponent implements OnInit {

  constructor(
    private http: Http,
    private CharlotteService: CharlotteService
  ) { }

  cmJulia = {
    mode: 'julia',
    lineNumbers: true
  };
  // TODO: Need to define this custom mode like https://github.com/WebAssembly/wabt/blob/master/demo/wast-mode.js but it's unclear how to do this with the current Angular wrapper to CM
  cmWat = {
    mode: 'wast',
    lineNumbers: true,
    readOnly: true
  };
  cmJS = {
    mode: 'javascript',
    lineNumbers: true
  };
  cmPlain = {
    mode: null,
    lineNumbers: true
  };

  jlCode = "";
  jlFunction = "";
  jlTypes = "";

  watCode = "";
  wasmBuild = "";
  jsFunctionCall = "";
  jsResult = "\n";

  waiting_on_API = false;
  serverError = "";

  ngOnInit() {
    this.loadDemo()
  }

  loadDemo() {
    this.jlCode = `function mathfun(x)
    2x
end
function mathfun1(x)
    4x
end
function mathfun2(x, y)
    mathfun(3x) + mathfun1(y)
end`;
    this.jlFunction = "mathfun2";
    this.jlTypes = "Float64, Float64";
    this.jsFunctionCall = `for (let i = 0; i < 11; i++) {
  console.log(mathfun2(i,i));
}`;
  }

  submit() {
    this.watCode = "";
    this.wasmBuild = "";
    this.jsResult = "";
    this.serverError = "";
    this.waiting_on_API = true;

    return this.CharlotteService.submitForWat(this.jlCode.replace(/\n/g, "\n"), this.jlFunction, this.jlTypes).subscribe(
      data => this.watCode = decodeURIComponent(data.result),
      error => this.handleServerError(error),
      () => this.afterConvert()
    );
  }

  handleServerError(error: any) {
    console.log(error);
    this.waiting_on_API = false;
    this.serverError = `Unexciting server error.  If it's timeout related, try again in ~30 sec.

    ` + error._body.toString();
  }

  afterConvert() {
    this.waiting_on_API = false;
    console.log(this.watCode)
  }

}
