import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { NotfoundComponent } from './notfound/notfound.component';

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
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./register/register.module').then((m) => m.RegisterModule),
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
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginModule),
  },
  {
    path: '**',
    component: NotfoundComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
