import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeSettingsComponent } from './employee-settings/employee-settings.component';
import { EmployeeDashboardComponent } from './employee-dashboard/employee-dashboard.component';
import { EmployeeRoutingModule } from './employee-routing.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzFormModule } from 'ng-zorro-antd/form';

@NgModule({
  declarations: [EmployeeDashboardComponent, EmployeeSettingsComponent],
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzGridModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzLayoutModule,
  ],
})
export class EmployeeModule {}
