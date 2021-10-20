import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserModule} from '@angular/platform-browser';
import {httpInterceptorProviders} from './core/interceptors';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FooterComponent} from './components/footer/footer.component';
import {HeaderComponent} from './components/header/header.component';
import {NotificationsComponent} from './components/notifications/notifications.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {QueueSongComponent} from './components/queue-song/queue-song.component';
import {PlaybackControllerComponent} from './components/playback-controller/playback-controller.component';
import {QueueComponent} from './components/queue/queue.component';
import {SearchComponent} from './components/search/search.component';
import {JamsessionComponent} from './components/jamsession/jamsession.component';
import {QueueCollectionComponent} from './components/queue-collection/queue-collection.component';
import {TitleComponent} from './components/title/title.component';
import {RedirectGuard} from './core/guard/redirect.guard';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    NotificationsComponent,
    QueueSongComponent,
    PlaybackControllerComponent,
    QueueComponent,
    SearchComponent,
    JamsessionComponent,
    QueueCollectionComponent,
    TitleComponent,
    RedirectGuard
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  providers: [
    httpInterceptorProviders,
    RedirectGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
