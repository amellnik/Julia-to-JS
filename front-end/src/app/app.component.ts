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
  result = "";


  ngOnInit() {

  }

  loadDemo() {
    this.jlCode = `using StaticArrays
struct X
    a::Float64
    b::Float64
end

function myspecialfun(a)
    x = SVector(1., 2., a)
    y = SVector(a, a, 3.)
    z = X(a, 2a)
    return sum(x + 2y) - z.b + z.a
end`;
  this.jlFunction = `myspecialfun`;
  this.jlTypes = "Float64";
  }

  submit() {
    return this.ApiService.submitForJS(this.jlCode, this.jlFunction, this.jlTypes).subscribe(
        data => this.result = data,
        error => console.log(error),
        () => console.log(this.result)
      );
  }
}
