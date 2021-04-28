import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { CustomerRoutingModule } from './customer-routing';



@NgModule({
  declarations: [CustomerDashboardComponent],
  imports: [
    CommonModule,
    NzTableModule,
    CustomerRoutingModule,
  ]
})
export class CustomerModule { }
