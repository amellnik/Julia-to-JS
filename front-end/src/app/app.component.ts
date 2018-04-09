import { Component, OnInit } from '@angular/core';
import { ClarityIcons } from 'clarity-icons';
import 'codemirror/mode/julia/julia';

import * as CodeMirror from 'codemirror';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: []
})
export class AppComponent implements OnInit {

  constructor () {
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



  ngOnInit() {
  }

}
