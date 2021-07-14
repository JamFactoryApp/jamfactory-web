import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PageNotFoundComponent} from './shared/components/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/landingpage/landingpage.module').then(m => m.LandingpageModule),
    pathMatch: 'full'
  },
  {
    path: 'jam/:jamlabel',
    loadChildren: () => import('./modules/jamsession/jamsession.module').then(m => m.JamsessionModule)
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
