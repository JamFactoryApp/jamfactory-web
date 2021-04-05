import { NgModule } from '@angular/core';
import {JamsessionRoutingModule} from './jamsession-routing.module';
import {QueueSongComponent} from './queue-song/queue-song.component';
import {PlaybackControllerComponent} from './playback-controller/playback-controller.component';
import {QueueComponent} from './queue/queue.component';
import {SearchComponent} from './search/search.component';
import {JamsessionComponent} from './jamsession.component';
import {QueueCollectionComponent} from './queue-collection/queue-collection.component';
import {SharedModule} from '../../shared/shared.module';
import { TitleComponent } from './title/title.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    QueueSongComponent,
    PlaybackControllerComponent,
    QueueComponent,
    SearchComponent,
    JamsessionComponent,
    QueueCollectionComponent,
    TitleComponent
  ],
  imports: [
    JamsessionRoutingModule,
    SharedModule,
    NgbModule
  ]
})
export class JamsessionModule { }
