import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {DebugComponent} from './components/debug/debug.component';
import {HttpClientModule} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';
import {QueueSongComponent} from './components/queue-song/queue-song.component';
import {PlaybackControllerComponent} from './components/playback-controller/playback-controller.component';
import {QueueComponent} from './components/queue/queue.component';
import {SearchComponent} from './components/search/search.component';
import {LandingpageComponent} from './components/landing-page/landing-page.component';
import {JamSessionComponent} from './components/jam-session/jam-session.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { QueueCollectionComponent } from './components/queue-collection/queue-collection.component';

@NgModule({
  declarations: [
    AppComponent,
    DebugComponent,
    LandingpageComponent,
    QueueSongComponent,
    PlaybackControllerComponent,
    QueueComponent,
    SearchComponent,
    JamSessionComponent,
    PageNotFoundComponent,
    QueueCollectionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
