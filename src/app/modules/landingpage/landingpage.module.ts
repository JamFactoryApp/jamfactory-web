import { NgModule } from '@angular/core';
import {LandingpageRoutingModule} from './landingpage-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {LandingpageComponent} from './landingpage.component';



@NgModule({
  declarations: [
    LandingpageComponent
  ],
  imports: [
    LandingpageRoutingModule,
    SharedModule
  ]
})
export class LandingpageModule { }
