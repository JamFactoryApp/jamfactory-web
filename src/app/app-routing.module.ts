import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LandingpageComponent} from './components/landing-page/landing-page.component';
import {JamSessionComponent} from './components/jam-session/jam-session.component';
// import {DebugComponent} from './components/debug/debug.component';
import {PageNotFoundComponent} from './components/page-not-found/page-not-found.component';

const routes: Routes = [
  {path: '', component: LandingpageComponent},
  // {path: 'debug', component: DebugComponent},
  {path: ':jamlabel', component: JamSessionComponent},
  {path: '*', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
