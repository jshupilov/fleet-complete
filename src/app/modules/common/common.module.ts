import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { environment } from '@environments/environment';
import { CommonRoutingModule } from './common-routing.module';
import { HomeComponent } from './pages/home/home.component';

import { AgmCoreModule } from '@agm/core';            // @agm/core
import { AgmDirectionModule } from 'agm-direction';   // agm-direction
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    CommonRoutingModule,
    MatDatepickerModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    AgmCoreModule.forRoot({ // @agm/core
      apiKey: environment.googleMapApi,
    }),
    AgmDirectionModule,     // agm-direction
  ]
})
export class CommonPageModule {
  constructor() {
  }
}
