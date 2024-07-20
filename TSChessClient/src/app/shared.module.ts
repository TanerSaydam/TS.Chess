import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexiGridModule } from 'flexi-grid';
import {FlexiSelectModule } from 'flexi-select';
import { FormsModule } from '@angular/forms';
import { TrCurrencyPipe } from 'tr-currency';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FlexiGridModule,
    FlexiSelectModule,
    FormsModule,
    TrCurrencyPipe
  ],
  exports: [
    CommonModule,
    FlexiGridModule,
    FlexiSelectModule,
    FormsModule,
    TrCurrencyPipe
  ]
})
export class SharedModule { }
