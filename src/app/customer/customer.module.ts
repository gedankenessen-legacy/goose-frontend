import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { CustomerRoutingModule } from './customer-routing';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CustomerSettingsComponent } from './customer-settings/customer-settings.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzFormModule } from 'ng-zorro-antd/form';

@NgModule({
  declarations: [CustomerDashboardComponent, CustomerSettingsComponent],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    NzButtonModule,
    NzTableModule,
    NzIconModule,
    NzInputModule,
    NzGridModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzLayoutModule,
  ],
})
export class CustomerModule { }
