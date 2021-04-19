import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeSettingsComponent } from './employee-settings/employee-settings.component';
import { EmployeeDashboardComponent } from './employee-dashboard/employee-dashboard.component';
import { EmployeeRoutingModule } from './employee-routing.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@NgModule({
  declarations: [EmployeeDashboardComponent, EmployeeSettingsComponent],
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
  ]
})
export class EmployeeModule { }
