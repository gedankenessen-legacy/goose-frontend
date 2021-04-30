import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { CustomerRoutingModule } from './customer-routing';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CustomerSettingsComponent } from './customer-settings/customer-settings/customer-settings.component';

@NgModule({
  declarations: [CustomerDashboardComponent, CustomerSettingsComponent],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
  ],
})
export class CustomerModule {}
