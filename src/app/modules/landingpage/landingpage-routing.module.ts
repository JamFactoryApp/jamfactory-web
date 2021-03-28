import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LandingpageComponent} from './landingpage.component';
import {InitiationComponent} from './initiation/initiation.component';


const routes: Routes = [
  {
    path: '',
    component: LandingpageComponent,
    children: [
      {
        path: '',
        component: InitiationComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingpageRoutingModule {
}
