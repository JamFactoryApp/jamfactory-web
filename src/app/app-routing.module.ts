import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DebugComponent} from './shared/components/debug/debug.component';
import {PageNotFoundComponent} from './shared/components/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/landingpage/landingpage.module').then(m => m.LandingpageModule)
  },
  {
    path: 'debug',
    component: DebugComponent
  },
  {
    path: ':jamlabel',
    loadChildren: () => import('./modules/jamsession/jamsession.module').then(m => m.JamsessionModule)
  },
  {
    path: '*',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
