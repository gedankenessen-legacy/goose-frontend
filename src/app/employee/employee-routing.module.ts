import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeDashboardComponent } from './employee-dashboard/employee-dashboard.component';
import { EmployeeSettingsComponent } from './employee-settings/employee-settings.component';

const routes: Routes = [
  {
    path: '',
    component: EmployeeDashboardComponent,
  },
  {
    path: 'edit',
    component: EmployeeSettingsComponent,
  },
  {
    path: ':employeeId/edit',
    component: EmployeeSettingsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeRoutingModule {}
