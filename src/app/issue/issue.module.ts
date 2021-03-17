import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NzTableModule } from 'ng-zorro-antd/table';



@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    NzTableModule
  ]
})
export class IssueModule { }
