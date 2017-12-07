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
  jsCode = "";


  ngOnInit() {

  }

  loadDemo() {
    this.jlCode = `function unexciting(x)
    return 2*x
end`;
  this.jlFunction = `unexciting`;
  this.jlTypes = "Float32";
  }

  submit() {
    return this.ApiService.submitForJS(this.jlCode, this.jlFunction, this.jlTypes).subscribe(
        data => this.jsCode = data,
        error => console.log(error),
        () => {
          this.addJsToElement(this.jsCode);
          console.log("Loaded some sketchy js!")
        }
      );
  }

  addJsToElement(src: string): HTMLScriptElement {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = src;
    document.getElementsByTagName('head')[0].appendChild(script);
    return script;
  }
}
