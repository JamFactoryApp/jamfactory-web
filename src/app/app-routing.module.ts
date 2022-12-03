import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {JamsessionComponent} from './components/jamsession/jamsession.component';
import {RedirectGuard} from './core/guards/redirect.guard';
import {CreateComponent} from './components/create/create.component';

const routes: Routes = [
  {
    path: 'create',
    component: CreateComponent
  },
  {
    path: ':jamlabel',
    component: JamsessionComponent
  },
  {
    path: '',
    canActivate: [RedirectGuard],
    component: RedirectGuard,
    data: {
      externalUrl: '../'
    }
  },
  {
    path: '**',
    redirectTo: ''
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
