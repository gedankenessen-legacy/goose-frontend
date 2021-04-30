import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';
import { CustomerSettingsComponent } from './customer-settings/customer-settings.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerDashboardComponent,
  },
  {
    path: 'edit',
    component: CustomerSettingsComponent,
  },
  {
    path: ':customerId/edit',
    component: CustomerSettingsComponent,
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerRoutingModule { }
