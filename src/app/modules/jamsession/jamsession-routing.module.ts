import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {JamsessionComponent} from './jamsession.component';


const routes: Routes = [
  {
    path: '',
    component: JamsessionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JamsessionRoutingModule {

}
