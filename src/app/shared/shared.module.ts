import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {CommonModule} from '@angular/common';

@NgModule({
  imports:      [ CommonModule ],
  declarations: [],
  exports:      [ FormsModule, HttpClientModule, ReactiveFormsModule, FontAwesomeModule, CommonModule ]
})
export class SharedModule { }
