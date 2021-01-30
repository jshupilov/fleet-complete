import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './service/api.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClient
  ],
  providers: [ApiService]
})
export class DataModule { }
