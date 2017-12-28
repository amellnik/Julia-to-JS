import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ApiService]
})
export class AppComponent implements OnInit {

  constructor (
    private http: Http,
    private ApiService: ApiService
  ) {}

  jlCode = "";
  jlFunction = "";
  jlTypes = "";
  serverResponse:any;
  jsCode = "";
  serverError = "";
  jsFunctionCall = "";
  jsResult = "\n";
  waiting_on_API = false;


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

  submit() {
    // Get rid of any existing code including the injected portion
    this.jsCode = "";
    this.serverError = "";
    if (document.contains(document.getElementById("injected-js"))) {
      console.log("Removing old js code")
      document.getElementById("injected-js").remove();
      var Module = false;
    }

    this.waiting_on_API = true;
    return this.ApiService.submitForJS(this.jlCode, this.jlFunction, this.jlTypes).subscribe(
        data => this.serverResponse = data,
        error => this.handleServerError(error),
        () => {
          this.afterQuery();
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
