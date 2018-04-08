import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClarityModule } from "clarity-angular";
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CodemirrorModule } from 'ng2-codemirror';
// import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { CharlotteComponent } from './charlotte/charlotte.component';
import { ExportwasmComponent } from './exportwasm/exportwasm.component';

const appRoutes: Routes = [
  { path: 'export-wasm', component: ExportwasmComponent },
  { path: 'charlotte', component: CharlotteComponent },
  { path: '**', component: AboutComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    CharlotteComponent,
    ExportwasmComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false }
    ),
    BrowserModule,
    ClarityModule.forRoot(),
    FormsModule,
    HttpModule,
    CodemirrorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
