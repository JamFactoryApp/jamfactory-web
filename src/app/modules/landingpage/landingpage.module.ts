import {NgModule} from '@angular/core';
import {LandingpageRoutingModule} from './landingpage-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {LandingpageComponent} from './landingpage.component';
import {InitiationComponent} from './initiation/initiation.component';


@NgModule({
  declarations: [
    LandingpageComponent,
    InitiationComponent
  ],
  imports: [
    LandingpageRoutingModule,
    SharedModule
  ]
})
export class LandingpageModule {
}
