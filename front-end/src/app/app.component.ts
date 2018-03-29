import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ApiService } from './api.service';
import { ClarityIcons } from 'clarity-icons';
import 'codemirror/mode/julia/julia';

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
  ) {
    ClarityIcons.add({"julia": `<svg
     version="1.1"
     viewBox="0 0 104.33789 96.837892"
     id="svg2"
     inkscape:version="0.91 r13725"
     sodipodi:docname="julia_logo.svg"
     width="104.33789"
     height="96.837891"><metadata
       id="metadata32"><rdf:RDF><cc:Work
           rdf:about=""><dc:format>image/svg+xml</dc:format><dc:type
             rdf:resource="http://purl.org/dc/dcmitype/StillImage" /><dc:title></dc:title></cc:Work></rdf:RDF></metadata><defs
       id="defs30" /><circle
       cx="25.918945"
       cy="-70.918945"
       r="20"
       id="circle22"
       style="fill:#d5635c;stroke:#cb3c33;stroke-width:3.83789062;stroke-linecap:butt;stroke-miterlimit:4"
       transform="scale(1,-1)" /><circle
       cx="52.168945"
       cy="-25.918945"
       r="20"
       id="circle24"
       style="fill:#60ad51;stroke:#389826;stroke-width:3.83789062;stroke-linecap:butt;stroke-miterlimit:4"
       transform="scale(1,-1)" /><circle
       cx="78.418945"
       cy="-70.918945"
       r="20"
       id="circle26"
       style="fill:#aa79c1;stroke:#9558b2;stroke-width:3.83789062;stroke-linecap:butt;stroke-miterlimit:4"
       transform="scale(1,-1)" /></svg>`});
  }



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
    return this.ApiService.submitForJS(this.jlCode.replace(/\n/g, "\n"), this.jlFunction, this.jlTypes).subscribe(
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
    this.ApiService.checkForResult(this.filename).subscribe(
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
