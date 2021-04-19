import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeSettingsComponent } from './employee-settings/employee-settings.component';
import { EmployeeDashboardComponent } from './employee-dashboard/employee-dashboard.component';

@NgModule({
  declarations: [EmployeeDashboardComponent, EmployeeSettingsComponent],
  imports: [
    CommonModule
  ]
})
export class EmployeeModule { }
