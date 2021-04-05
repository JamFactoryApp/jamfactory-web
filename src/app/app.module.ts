import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {DebugComponent} from './shared/components/debug/debug.component';
import {PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import {SharedModule} from './shared/shared.module';
import {BrowserModule} from '@angular/platform-browser';
import {httpInterceptorProviders} from './core/interceptors/index';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    DebugComponent,
    PageNotFoundComponent
  ],
  imports: [
    AppRoutingModule,
    SharedModule,
    BrowserModule,
    NgbModule
  ],
  providers: [
    httpInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
