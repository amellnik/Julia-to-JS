import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ExportwasmService } from './exportwasm.service';
import { ClarityIcons } from 'clarity-icons';
import 'codemirror/mode/julia/julia';


@Component({
  selector: 'app-exportwasm',
  templateUrl: './exportwasm.component.html',
  styleUrls: ['./exportwasm.component.css'],
  providers: [ExportwasmService]
})
export class ExportwasmComponent implements OnInit {

  constructor(
    private http: Http,
    private ExportwasmService: ExportwasmService
  ) { }

  cmConfig = {
    mode: 'julia',
    indentWithTabs: true,
    lineNumbers: true
    // theme: 'neat',
    // addModeClass: true
  };

  jlCode = "";
  jlFunction = "";
  jlTypes = "";
  serverResponse:any;
  jsCode = "";
  serverError = "";
  jsFunctionCall = "";
  jsResult = "\n";
  waiting_on_API = false;
  filename = "";

  ngOnInit() {
    this.loadDemo();
  }

  loadDemo() {
    this.jlCode = `function fib(n)
    n < 2 ? 1 : fib(n-1) + fib(n-2)
end`;
    this.jlFunction = "fib";
    this.jlTypes = "Int32";
    this.jsFunctionCall="_fib(6)"
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  submit() {
    // Get rid of any existing code including the injected portion
    this.jsCode = "";
    this.serverError = "";
    if (document.contains(document.getElementById("injected-js"))) {
      console.log("Removing old js code");
      document.getElementById("injected-js").remove();
      // Also delete the global variables for it
      window['Module'] = {};
    }

    this.waiting_on_API = true;
    return this.ExportwasmService.submitForJS(this.jlCode.replace(/\n/g, "\n"), this.jlFunction, this.jlTypes).subscribe(
        data => this.filename = data.filename,
        error => this.handleServerError(error),
        () => this.runChecks(30)
      );
  }

  runChecks(retries:number) {
    console.log("Checking server, retries left: " + retries)
    if (retries == 0 ) {
      console.log("Ran out of retries -- something went terribly wrong...");
      this.waiting_on_API = false;
      this.serverError = "The server never created a response for this request -- something must have gone terribly wrong."
      return 0;
    }
    this.ExportwasmService.checkForResult(this.filename).subscribe(
        data => this.serverResponse = data,
        error => this.handleServerError(error),
        () => {
          if (this.serverResponse.ready) {
            this.afterQuery();
          } else {
            this.sleep(5000).then(() => {
              this.runChecks(retries-1);
            })
          }
        }
      );
  }



  afterQuery() {
    this.waiting_on_API = false;
    // Check response to see if there was a conversion error
    if (this.serverResponse.hasOwnProperty('error')) {
      this.serverError = this.serverResponse.error;
      console.log(this.handleServerError);
      // Show server error here
    } else {
      this.jsCode = this.serverResponse.data;
      this.addJsToElement(this.jsCode);
      console.log("Loaded some sketchy js!")
    }
  }

  handleServerError(error: any) {
    console.log(error);
    this.waiting_on_API = false;
    this.serverError = `Unexciting server error.  If it's timeout related, try again in ~30 sec.

    ` + error._body.toString();
  }

  run_js() {  // No clue if this sort of thing works
    this.jsResult = '' + eval(this.jsFunctionCall);
  }

  addJsToElement(src: string): HTMLScriptElement {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = src;
    script.id = "injected-js";
    document.getElementsByTagName('head')[0].appendChild(script);
    return script;
  }

}
