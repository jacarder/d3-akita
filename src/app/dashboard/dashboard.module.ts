import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { DashboardRoutingModule } from './dashboard-routing.module';



@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatProgressSpinnerModule
  ]
})
export class DashboardModule { }
