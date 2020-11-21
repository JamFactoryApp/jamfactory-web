import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {DebugComponent} from './shared/components/debug/debug.component';
import {PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import {SharedModule} from './shared/shared.module';
import {BrowserModule} from '@angular/platform-browser';


@NgModule({
  declarations: [
    AppComponent,
    DebugComponent,
    PageNotFoundComponent
  ],
  imports: [
    AppRoutingModule,
    SharedModule,
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
