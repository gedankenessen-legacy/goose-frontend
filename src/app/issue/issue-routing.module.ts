import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IssueComponent } from './issue/issue.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: '/project/:projectId/issue/:issueId',
    component: IssueComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IssueRoutingModule {}
