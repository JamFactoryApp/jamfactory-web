import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserModule} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {httpInterceptorProviders} from './core/interceptors';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
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
import {RedirectGuard} from './core/guards/redirect.guard';
import { CreateComponent } from './components/create/create.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SearchSongComponent } from './components/search-song/search-song.component';
import { QueueSongListComponent } from './components/queue-song/queue-song-list/queue-song-list.component';
import { QueueSongCardsComponent } from './components/queue-song/queue-song-cards/queue-song-cards.component';
import { ModalsComponent } from './components/modals/modals.component';

@NgModule({
  declarations: [
    AppComponent,
    QueueSongComponent,
    PlaybackControllerComponent,
    QueueComponent,
    SearchComponent,
    JamsessionComponent,
    QueueCollectionComponent,
    TitleComponent,
    RedirectGuard,
    CreateComponent,
    SidebarComponent,
    SearchSongComponent,
    QueueSongListComponent,
    QueueSongCardsComponent,
    ModalsComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
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
