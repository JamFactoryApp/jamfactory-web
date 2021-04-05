import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import {CommonModule} from '@angular/common';
import {FooterComponent} from './components/footer/footer.component';
import {HeaderComponent} from './components/header/header.component';

@NgModule({
  imports:      [ CommonModule ],
  declarations: [
    FooterComponent,
    HeaderComponent
  ],
  exports:      [ FormsModule, HttpClientModule, ReactiveFormsModule, CommonModule, FooterComponent, HeaderComponent]
})
export class SharedModule { }
