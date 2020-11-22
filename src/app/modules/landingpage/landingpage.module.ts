import { NgModule } from '@angular/core';
import {LandingpageRoutingModule} from './landingpage-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {LandingpageComponent} from './landingpage.component';
import { InitiationComponent } from './initiation/initiation.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';



@NgModule({
  declarations: [
    LandingpageComponent,
    InitiationComponent,
    FooterComponent,
    HeaderComponent
  ],
  imports: [
    LandingpageRoutingModule,
    SharedModule
  ]
})
export class LandingpageModule { }
