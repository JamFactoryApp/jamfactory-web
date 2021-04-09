import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {HttpClientModule} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {FooterComponent} from './components/footer/footer.component';
import {HeaderComponent} from './components/header/header.component';
import {NotificationsComponent} from './components/notifications/notifications.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    NgbModule
  ],
  declarations: [
    FooterComponent,
    HeaderComponent,
    NotificationsComponent
  ],
  exports: [
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    FooterComponent,
    HeaderComponent,
    NotificationsComponent,
    NgbModule
  ]
})
export class SharedModule {
}
