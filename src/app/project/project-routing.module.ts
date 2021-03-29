import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from "./settings/settings.component";

const routes: Routes = [
  {
    path: 'edit',
    component: SettingsComponent
  },
  {
    path: ':projectId/edit',
    component: SettingsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule { }
