import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {JamsessionComponent} from './components/jamsession/jamsession.component';
import {RedirectGuard} from './core/guards/redirect.guard';
import {CreateComponent} from './components/create/create.component';

const routes: Routes = [
  {
    path: 'jam/create',
    component: CreateComponent
  },
  {
    path: 'jam/:jamlabel',
    component: JamsessionComponent
  },
  {
    path: 'jam',
    canActivate: [RedirectGuard],
    component: RedirectGuard,
    data: {
      externalUrl: '../'
    }
  },
  {
    path: '**',
    redirectTo: 'jam'
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {relativeLinkResolution: 'legacy'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
