import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { DashboardRoutingModule } from './dashboard-routing.module';
import { AgeWeightScatterGraphComponent } from './age-weight-scatter-graph/age-weight-scatter-graph.component';
import { FriendModule } from '../friend/friend.module';



@NgModule({
  declarations: [
    DashboardComponent,
    AgeWeightScatterGraphComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FriendModule,
    MatProgressSpinnerModule
  ]
})
export class DashboardModule { }
