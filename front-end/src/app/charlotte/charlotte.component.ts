import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { CharlotteService } from './charlotte.service';

import 'codemirror/mode/julia/julia';
import 'codemirror/mode/javascript/javascript';
// import './wast-mode';
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
  wasmBuffer: Uint8Array;
  jsFunctionCall = "";
  jsResult = "\n";

  waiting_on_API = false;
  serverResponse: any;
  serverError = "";

  ngOnInit() {
    this.loadDemo()
  }

  submit() {
    this.watCode = "";
    this.wasmBuild = "";
    this.jsResult = "";
    this.serverError = "";
    this.waiting_on_API = true;

    return this.CharlotteService.submitForWat(this.jlCode.replace(/\n/g, "\n"), this.jlFunction, this.jlTypes).subscribe(
      data => this.serverResponse = data,
      error => this.handleServerError(error),
      () => this.afterConvert()
    );
  }

  handleServerError(error: any) {
    console.log(error);
    this.waiting_on_API = false;
    this.serverError = `Unexciting server error.  If it's timeout related, try again in ~30 sec.

    ` + error.toString();
  }

  afterConvert() {
    this.waiting_on_API = false;
    if (this.serverResponse.error) {
      this.serverError = this.serverResponse.message;
      return;
    }
    this.watCode = decodeURIComponent(this.serverResponse.result);
    console.log(this.watCode);
    this.compile();
  }

  compile() {
    try {
      // This throws an "Property does not exist on type..." error but still works
      var module = wabt.parseWat('test.wast', this.watCode);
      module.resolveNames();
      module.validate();
      var binaryOutput = module.toBinary({log: true, write_debug_names:true});
      this.wasmBuild = binaryOutput.log;
      this.wasmBuffer = binaryOutput.buffer;
      // var blob = new Blob([binaryOutput.buffer]);
      // if (binaryBlobUrl) {
      //   URL.revokeObjectURL(binaryBlobUrl);
      // }
      // binaryBlobUrl = URL.createObjectURL(blob);
      // downloadLink.setAttribute('href', binaryBlobUrl);
      // downloadEl.classList.remove('disabled');
    } catch (e) {
      this.wasmBuild += e.toString();
      // downloadEl.classList.add('disabled');
    } finally {
      if (module) module.destroy();
    }
  }

  run_js() {
    try {
      let wasmModule = new WebAssembly.Module(this.wasmBuffer);
      // let js = this.jsFunctionCall;
    //   let fn = new Function('wasmModule', 'console', js + '//# sourceURL=demo.js');
    // fn(wasm, wrappedConsole);
    this.jsResult = '' + eval(this.jsFunctionCall);
    } catch (e) {
      this.jsResult = String(e);
    }
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
    this.jsFunctionCall = `const wasmInstance =
      new WebAssembly.Instance(wasmModule, {});
const { mathfun2 } = wasmInstance.exports;
let res = [];
for (let i = 0; i < 10; i++) {
  res.push(mathfun2(i,i));
}
res;`;
  }

}
