import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { IssueRoutingModule } from './issue-routing.module';



@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    NzTableModule,
    IssueRoutingModule
  ]
})
export class IssueModule { }
