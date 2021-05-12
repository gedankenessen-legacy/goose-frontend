import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LogindashboardComponent } from './logindashboard/logindashboard.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { RegisterdashboardComponent } from './registerdashboard/registerdashboard.component';

const routes: Routes = [
  {
    path: 'company',
    canLoad: [AuthGuard],
    loadChildren: () =>
      import('./company/company.module').then((m) => m.CompanyModule),
  },
  {
    path: ':companyId/customers',
    canLoad: [AuthGuard],
    loadChildren: () =>
      import('./customer/customer.module').then((m) => m.CustomerModule),
  },
  {
    path: 'login',
    component: LogindashboardComponent,
  },
  {
    path: 'register',
    component: RegisterdashboardComponent,
  },
  {
    path: ':companyId/projects/:projectId/issues',
    canLoad: [AuthGuard],
    loadChildren: () =>
      import('./issue/issue.module').then((m) => m.IssueModule),
  },
  {
    path: ':companyId/projects',
    canLoad: [AuthGuard],
    loadChildren: () =>
      import('./project/project.module').then((m) => m.ProjectModule),
  },
  {
    path: ':companyId/employees',
    canLoad: [AuthGuard],
    loadChildren: () =>
      import('./employee/employee.module').then((m) => m.EmployeeModule),
  },
  {
    path: ':companyId/customers',
    canLoad: [AuthGuard],
    loadChildren: () =>
      import('./customer/customer.module').then((m) => m.CustomerModule),
  },
  {
    path: '',
    component: LogindashboardComponent,
  },
  {
    path: '**',
    component: NotfoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
