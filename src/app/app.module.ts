import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserModule} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {httpInterceptorProviders} from './core/interceptors';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {APP_BASE_HREF, CommonModule} from '@angular/common';
import {QueueSongComponent} from './components/queue-song/queue-song.component';
import {PlaybackControllerComponent} from './components/playback-controller/playback-controller.component';
import {QueueComponent} from './components/queue/queue.component';
import {SearchComponent} from './components/search/search.component';
import {JamsessionComponent} from './components/jamsession/jamsession.component';
import {TitleComponent} from './components/title/title.component';
import {RedirectGuard} from './core/guards/redirect.guard';
import { CreateComponent } from './components/create/create.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SearchSongComponent } from './components/search/search-song/search-song.component';
import { QueueSongListComponent } from './components/queue-song/queue-song-list/queue-song-list.component';
import { QueueSongCardsComponent } from './components/queue-song/queue-song-cards/queue-song-cards.component';
import {SearchPlaylistComponent} from './components/search/search-playlist/search-playlist.component';
import {SearchAlbumComponent} from './components/search/search-album/search-album.component';
import { ModalsComponent } from './components/modals/modals.component';
import {Router} from '@angular/router';
import { SidebarNotificationComponent } from './components/sidebar/sidebar-notification/sidebar-notification.component';
import { SidebarOptionsComponent } from './components/sidebar/sidebar-options/sidebar-options.component';
import { SidebarCustomizationComponent } from './components/sidebar/sidebar-customization/sidebar-customization.component';
import { SidebarMembersComponent } from './components/sidebar/sidebar-members/sidebar-members.component';
import { SidebarMemberComponent } from './components/sidebar/sidebar-members/sidebar-member/sidebar-member.component';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  declarations: [
    AppComponent,
    QueueSongComponent,
    PlaybackControllerComponent,
    QueueComponent,
    SearchComponent,
    JamsessionComponent,
    TitleComponent,
    RedirectGuard,
    CreateComponent,
    SidebarComponent,
    SearchSongComponent,
    SearchPlaylistComponent,
    SearchAlbumComponent,
    QueueSongListComponent,
    QueueSongCardsComponent,
    ModalsComponent,
    SidebarNotificationComponent,
    SidebarOptionsComponent,
    SidebarCustomizationComponent,
    SidebarMembersComponent,
    SidebarMemberComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    QRCodeModule
  ],
  providers: [
    httpInterceptorProviders,
    RedirectGuard,
    { provide: APP_BASE_HREF, useValue: '/jam/' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private router: Router) {
    // Reload JamSession Component on label change
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }
}
